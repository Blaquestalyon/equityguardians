import type { APIRoute } from 'astro';
import { getPartnerSessionFromRequest } from '../../../../lib/partner-auth';

export const prerender = false;

// Every field the Partner Realtor Enrollment Form can send. All optional at
// the wire level; server-side validation lives here so we can give friendly
// errors that name the exact field.
interface EnrollmentPayload {
  // A. Submission & Partner Tracking
  eg_partner_id?: string;
  enrollment_date?: string;
  form_completed_date?: string;
  referral_source?: string;

  // B. Agent Identity & Contact
  agent_full_name?: string;
  agent_license_number?: string;
  license_state?: string;
  license_expiration_date?: string;
  license_type?: string;
  years_licensed?: string;
  preferred_contact_method?: string;
  agent_email?: string;
  agent_phone?: string;
  agent_mailing_address?: string;

  // C. Brokerage & Sponsoring Broker
  brokerage_name?: string;
  brokerage_license_number?: string;
  brokerage_address?: string;
  sponsoring_broker_name?: string;
  sponsoring_broker_license_number?: string;
  sponsoring_broker_email?: string;
  sponsoring_broker_phone?: string;
  contracting_entity_name?: string;
  contracting_entity_type?: string;

  // D. Practice Profile & Markets Served
  states_served?: string;
  practice_role?: string;
  counties_markets_served?: string;
  primary_mls_board?: string;
  estimated_annual_closings?: string;

  // E. Agreement, Consents & Signature
  partner_agreement_ack?: string;
  partner_agreement_version?: string;
  terms_privacy_ack?: string;
  marketing_optin?: string;
  cobrand_assets_provided?: string;
  agent_signature?: string;
  signature_date?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Text fields plus any File uploads that came in with the form.
interface ParsedRequest {
  body: EnrollmentPayload;
  headshot: File | null;
  logo: File | null;
}

async function parseBody(request: Request): Promise<ParsedRequest> {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    // JSON path preserved for API-only integrations; no files supported here.
    const j = (await request.json().catch(() => ({}))) as EnrollmentPayload;
    return { body: j, headshot: null, logo: null };
  }
  const form = await request.formData();
  const out: any = {};
  let headshot: File | null = null;
  let logo: File | null = null;
  form.forEach((v, k) => {
    if (v instanceof File) {
      // Ignore empty file inputs (browsers send an empty File when nothing chosen).
      if (!v.name || v.size === 0) return;
      if (k === 'headshot_file') headshot = v;
      else if (k === 'logo_file') logo = v;
      return;
    }
    if (out[k] !== undefined) out[k] = [out[k], String(v)].flat().join(', ');
    else out[k] = String(v);
  });
  return { body: out as EnrollmentPayload, headshot, logo };
}

// Airtable upload-attachment endpoint. Accepts base64 content up to 5 MB.
// Docs: https://airtable.com/developers/web/api/upload-attachment
async function uploadAttachment(
  baseId: string,
  recordId: string,
  fieldName: string,
  file: File,
  token: string,
): Promise<{ ok: true } | { ok: false; status: number; body: string }> {
  const buf = await file.arrayBuffer();
  // Convert ArrayBuffer -> base64 without blowing the call stack for large files.
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  const base64 = Buffer.from(binary, 'binary').toString('base64');

  const url = `https://content.airtable.com/v0/${baseId}/${recordId}/${encodeURIComponent(fieldName)}/uploadAttachment`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentType: file.type || 'application/octet-stream',
      file: base64,
      filename: file.name,
    }),
  });
  if (!res.ok) return { ok: false, status: res.status, body: await res.text() };
  return { ok: true };
}

// Pretty labels for Airtable columns. Order matters visually in the base.
const FIELD_LABELS: Record<keyof EnrollmentPayload, string> = {
  eg_partner_id: 'EG Partner ID',
  enrollment_date: 'Enrollment Date',
  form_completed_date: 'Date Form Completed',
  referral_source: 'Referral Source',

  agent_full_name: 'Agent Full Name',
  agent_license_number: 'Agent License Number',
  license_state: 'License State(s)',
  license_expiration_date: 'License Expiration',
  license_type: 'License Type',
  years_licensed: 'Years Licensed',
  preferred_contact_method: 'Preferred Contact',
  agent_email: 'Agent Email',
  agent_phone: 'Agent Phone',
  agent_mailing_address: 'Agent Mailing Address',

  brokerage_name: 'Brokerage Name',
  brokerage_license_number: 'Brokerage License Number',
  brokerage_address: 'Brokerage Address',
  sponsoring_broker_name: 'Sponsoring Broker Name',
  sponsoring_broker_license_number: 'Sponsoring Broker License Number',
  sponsoring_broker_email: 'Sponsoring Broker Email',
  sponsoring_broker_phone: 'Sponsoring Broker Phone',
  contracting_entity_name: 'Contracting Party',
  contracting_entity_type: 'Entity Type',

  states_served: 'States Served',
  practice_role: 'Practice Role',
  counties_markets_served: 'Counties / Markets Served',
  primary_mls_board: 'Primary MLS / Board',
  estimated_annual_closings: 'Estimated Annual Closings',

  partner_agreement_ack: 'Partner Agreement Acknowledged',
  partner_agreement_version: 'Partner Agreement Version',
  terms_privacy_ack: 'Terms & Privacy Acknowledged',
  marketing_optin: 'Co-branded Marketing Opt-in',
  cobrand_assets_provided: 'Headshot / Logo Provided',
  agent_signature: 'Agent Signature',
  signature_date: 'Signature Date',
};

// Normalize a license number for the group key.
function normalizeLicense(s: string): string {
  return s.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}
function normalizeEmail(s: string): string {
  return s.trim().toLowerCase();
}

// Build a stable "Enrollment Group" key that identifies the same agent across
// resubmissions. We deliberately choose license # + email so that a typo in
// one still lets the other match (see fallback lookup below).
function enrollmentGroupKey(license: string, email: string): string {
  return `${normalizeLicense(license)}::${normalizeEmail(email)}`;
}

// Airtable "formula" escape for a single string value.
function q(s: string): string {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

interface AirtableRecord {
  id: string;
  createdTime?: string;
  fields: Record<string, unknown>;
}

async function airtableList(
  baseId: string,
  table: string,
  token: string,
  filterByFormula: string,
): Promise<AirtableRecord[]> {
  const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`);
  url.searchParams.set('filterByFormula', filterByFormula);
  url.searchParams.set('pageSize', '100');
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    // Missing table on first-ever run is possible; caller decides how loud to be.
    throw new Error(`Airtable list failed ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { records?: AirtableRecord[] };
  return data.records || [];
}

export const POST: APIRoute = async ({ request }) => {
  const session = getPartnerSessionFromRequest(request);
  if (!session) {
    return json({ error: 'Your session has expired. Please sign in again.' }, 401);
  }

  let body: EnrollmentPayload;
  let headshot: File | null;
  let logo: File | null;
  try {
    const parsed = await parseBody(request);
    body = parsed.body;
    headshot = parsed.headshot;
    logo = parsed.logo;
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Server-side validation of file uploads (client also validates, but never trust the client).
  const MAX_BYTES = 5 * 1024 * 1024;
  const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const fileChecks: Array<[File | null, string]> = [
    [headshot, 'Headshot'],
    [logo, 'Brokerage logo'],
  ];
  for (const [f, label] of fileChecks) {
    if (!f) continue;
    if (f.size > MAX_BYTES) {
      return json({ error: `${label} exceeds the 5 MB limit.` }, 400);
    }
    if (!ALLOWED_TYPES.has(f.type)) {
      return json({ error: `${label} must be JPG, PNG, or WebP.` }, 400);
    }
  }

  // Server-side validation of the required fields (matches the PDF's * marks
  // and what's usable for versioning).
  const requiredChecks: Array<[keyof EnrollmentPayload, string]> = [
    ['form_completed_date', 'Date form completed'],
    ['agent_full_name', 'Agent full name'],
    ['agent_license_number', 'Real estate license number'],
    ['license_state', 'License state(s)'],
    ['license_expiration_date', 'License expiration'],
    ['license_type', 'License type'],
    ['agent_email', 'Email'],
    ['agent_phone', 'Phone'],
    ['agent_mailing_address', 'Mailing address'],
    ['brokerage_name', 'Brokerage name'],
    ['brokerage_address', 'Brokerage address'],
    ['sponsoring_broker_name', 'Sponsoring broker name'],
    ['sponsoring_broker_email', 'Sponsoring broker email'],
    ['sponsoring_broker_phone', 'Sponsoring broker phone'],
    ['contracting_entity_name', 'Contracting party'],
    ['states_served', 'States served'],
    ['counties_markets_served', 'Counties / markets served'],
    ['partner_agreement_version', 'Partner Realtor Agreement version signed'],
    ['agent_signature', 'Agent signature'],
    ['signature_date', 'Date'],
  ];
  for (const [key, label] of requiredChecks) {
    const v = (body[key] || '').toString().trim();
    if (!v) return json({ error: `${label} is required.` }, 400);
  }

  // The two consents are checkbox flags and must be explicitly acknowledged.
  const partnerAck = (body.partner_agreement_ack || '').toString().trim().toLowerCase();
  const termsAck = (body.terms_privacy_ack || '').toString().trim().toLowerCase();
  const isYes = (v: string) => v === 'yes' || v === 'true' || v === 'on' || v === '1';
  if (!isYes(partnerAck)) {
    return json({ error: 'You must agree to the Partner Realtor Agreement to enroll.' }, 400);
  }
  if (!isYes(termsAck)) {
    return json({ error: 'You must agree to the Terms of Service and Privacy Policy to enroll.' }, 400);
  }

  const env: any = { ...process.env, ...(import.meta.env as any) };
  const token =
    env.AIRTABLE_TOKEN ||
    env.AIRTABLE_API_KEY ||
    env.AIRTABLE_PAT ||
    env.AIRTABLE_ACCESS_TOKEN;
  const baseId = env.AIRTABLE_BASE_ID || env.AIRTABLE_BASE;
  const table =
    env.AIRTABLE_TABLE_PARTNER_ENROLL ||
    env.AIRTABLE_PARTNER_ENROLL_TABLE ||
    'Partner Enrollments';

  if (!token || !baseId) {
    console.error('[intake/enrollment] Missing Airtable config.', {
      hasToken: Boolean(token),
      hasBaseId: Boolean(baseId),
      table,
    });
    return json(
      {
        error:
          'The enrollment system is not fully configured yet. Please contact admin@equityguardians.com. (Server missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID)',
      },
      503,
    );
  }

  // Compute the dedupe key. We keep both raw license # and normalized values
  // in the record so a human can audit why two rows were grouped.
  const licenseRaw = (body.agent_license_number || '').toString().trim();
  const emailRaw = (body.agent_email || '').toString().trim();
  const groupKey = enrollmentGroupKey(licenseRaw, emailRaw);
  const normLicense = normalizeLicense(licenseRaw);
  const normEmail = normalizeEmail(emailRaw);

  // Look for prior submissions from the same agent so we can:
  //   1. Compute the next version number (v1, v2, ...).
  //   2. Mark previous rows as superseded (leaving them in place, never deleting).
  //   3. Reuse the same Enrollment Group ID everyone shares.
  //
  // Match strategy: primary is groupKey exact match. Fallback (belt & suspenders):
  // license # OR email match individually, in case one was typoed in a prior run.
  let priorRecords: AirtableRecord[] = [];
  try {
    const formula = `OR({Enrollment Group}=${q(groupKey)},AND({License # (normalized)}=${q(
      normLicense,
    )},{License # (normalized)}!=""),AND(LOWER({Agent Email})=${q(normEmail)},{Agent Email}!=""))`;
    priorRecords = await airtableList(baseId, table, token, formula);
  } catch (err) {
    // First-ever run: table may not exist, or columns may not exist yet.
    // We log and continue as v1 rather than blocking the submission.
    console.warn(
      '[intake/enrollment] Dedupe lookup failed (assuming v1). If the table has no records yet, this is expected.',
      String(err),
    );
    priorRecords = [];
  }

  const version = priorRecords.length + 1;
  const isDuplicate = priorRecords.length > 0;

  const now = new Date();
  const submittedIso = now.toISOString();

  // Build the Airtable fields object. Only non-empty values are included.
  const fields: Record<string, string | number | boolean> = {
    'Submitted By': session.name,
    'Submitted At': submittedIso,
    'Form ID': 'EG-ENROLL-US-v1.0',
    'Form Version': '1.0',
    'Enrollment Group': groupKey,
    'License # (normalized)': normLicense,
    'Version': version,
    'Status': isDuplicate ? 'Superseded prior' : 'Current',
    'Is Duplicate': isDuplicate,
    'Prior Submissions': priorRecords.length,
  };
  for (const [key, label] of Object.entries(FIELD_LABELS) as [keyof EnrollmentPayload, string][]) {
    const v = (body[key] || '').toString().trim();
    if (v) fields[label] = v;
  }

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[intake/enrollment] Airtable error', res.status, errText);
      let hint = 'Please try again in a moment or email admin@equityguardians.com.';
      if (res.status === 401 || res.status === 403) {
        hint = 'Airtable rejected our credentials (401/403). Check AIRTABLE_TOKEN scope & base access.';
      } else if (res.status === 404) {
        hint = `Airtable table not found. Verify AIRTABLE_BASE_ID and AIRTABLE_TABLE_PARTNER_ENROLL (looking for "${table}").`;
      } else if (res.status === 422) {
        hint = 'Airtable schema mismatch. Ensure the target table has fields matching the labels being sent.';
      }
      return json({ error: hint, airtableStatus: res.status }, 502);
    }

    const airtableResp = await res.json().catch(() => ({}));
    const recordId: string | null = airtableResp?.records?.[0]?.id || null;

    // Build a human-friendly Reference that encodes the version.
    // Shape: EG-ENROLL-<license6>-v<N>-<recIdShort>
    // Falls back to the record id if license is empty.
    let reference = recordId || '';
    if (recordId) {
      const shortLic = (normLicense || 'UNKNOWN').slice(0, 8) || 'UNKNOWN';
      reference = `EG-ENROLL-${shortLic}-v${version}-${recordId.slice(-6)}`;
      try {
        const patchRes = await fetch(url, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            records: [{ id: recordId, fields: { Reference: reference } }],
            typecast: true,
          }),
        });
        if (!patchRes.ok) {
          const patchErr = await patchRes.text();
          console.warn('[intake/enrollment] Reference write-back failed', patchRes.status, patchErr);
        }
      } catch (patchErr) {
        console.warn('[intake/enrollment] Reference write-back threw', patchErr);
      }
    }

    // Best-effort: mark prior records as "Superseded" so the newest is easy to
    // find in Airtable views. Failure here does not fail the submission.
    if (priorRecords.length > 0) {
      const priorIds = priorRecords.map((r) => r.id);
      // Airtable PATCH accepts up to 10 records per call.
      const chunks: string[][] = [];
      for (let i = 0; i < priorIds.length; i += 10) chunks.push(priorIds.slice(i, i + 10));
      for (const chunk of chunks) {
        try {
          const patchPriorRes = await fetch(url, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              records: chunk.map((id) => ({ id, fields: { Status: 'Superseded' } })),
              typecast: true,
            }),
          });
          if (!patchPriorRes.ok) {
            const t = await patchPriorRes.text();
            console.warn('[intake/enrollment] Marking priors superseded failed', patchPriorRes.status, t);
          }
        } catch (e) {
          console.warn('[intake/enrollment] Marking priors superseded threw', e);
        }
      }
    }

    // Upload attachments (headshot + logo) if the opt-in provided them. These are
    // best-effort: upload failures are logged and surfaced in the response but do
    // not fail the submission (the row is already written).
    const attachmentWarnings: string[] = [];
    if (recordId && headshot) {
      const r = await uploadAttachment(baseId, recordId, 'Headshot', headshot, token);
      if (!r.ok) {
        console.warn('[intake/enrollment] Headshot upload failed', r.status, r.body);
        attachmentWarnings.push('headshot');
      }
    }
    if (recordId && logo) {
      const r = await uploadAttachment(baseId, recordId, 'Logo', logo, token);
      if (!r.ok) {
        console.warn('[intake/enrollment] Logo upload failed', r.status, r.body);
        attachmentWarnings.push('logo');
      }
    }

    return json({
      ok: true,
      recordId,
      reference,
      version,
      isDuplicate,
      priorSubmissions: priorRecords.length,
      attachmentWarnings,
    });
  } catch (err) {
    console.error('[intake/enrollment] Unexpected error', err);
    return json({ error: 'Something went wrong. Please try again shortly.' }, 500);
  }
};

export const GET: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
