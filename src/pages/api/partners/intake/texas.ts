import type { APIRoute } from 'astro';
import { getPartnerSessionFromRequest } from '../../../../lib/partner-auth';

export const prerender = false;

// Every field the Texas Member Intake Form can send. All optional at the
// wire level: validation lives here so we can give friendly errors.
interface IntakePayload {
  // A. Submission & Deal Tracking
  referring_realtor?: string;
  brokerage?: string;
  eg_partner_id?: string;
  realtor_email?: string;
  realtor_phone?: string;
  closing_date?: string;
  date_completed?: string;

  // B. Member Identity & Contact
  member_1_name?: string;
  member_2_name?: string;
  additional_members?: string;
  buyers_on_title?: string;
  member_mailing_address?: string;
  member_email?: string;
  member_phone?: string;

  // C. Property Profile
  property_street?: string;
  property_city?: string;
  property_county?: string;
  property_state?: string;
  property_zip?: string;
  property_type?: string;
  year_built?: string;
  square_footage?: string;
  lot_size?: string;
  bedrooms?: string;
  baths?: string;
  apn?: string;
  hoa_applies?: string;
  hoa_name?: string;
  legal_description?: string;

  // D. Transaction & Buyer Profile
  purchase_price?: string;
  seller_concessions?: string;
  purchase_type?: string;
  occupancy?: string;
  first_time_buyer_program?: string;

  // E. Loan & Financing
  lender_name?: string;
  loan_amount?: string;
  down_payment?: string;
  ltv?: string;
  loan_type?: string;
  interest_rate?: string;
  loan_term?: string;
  rate_type?: string;
  pmi_present?: string;
  pmi_monthly?: string;
  escrow_present?: string;
  escrow_monthly?: string;
  first_payment_date?: string;
  prepayment_penalty?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function parseBody(request: Request): Promise<IntakePayload> {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return (await request.json().catch(() => ({}))) as IntakePayload;
  }
  const form = await request.formData();
  const out: any = {};
  form.forEach((v, k) => {
    // Multi-value fields (unlikely here but future-proof) collapse to CSV.
    if (out[k] !== undefined) out[k] = [out[k], String(v)].flat().join(', ');
    else out[k] = String(v);
  });
  return out as IntakePayload;
}

// Human-readable label for the Airtable field name.
// Keeping snake_case source keys, but writing pretty labels into Airtable
// so the base is comfortable to read even before we design a nicer view.
const FIELD_LABELS: Record<keyof IntakePayload, string> = {
  referring_realtor: 'Referring Realtor',
  brokerage: 'Brokerage',
  eg_partner_id: 'EG Partner ID',
  realtor_email: 'Realtor Email',
  realtor_phone: 'Realtor Phone',
  closing_date: 'Closing Date',
  date_completed: 'Date Completed',
  member_1_name: 'Member 1 Name',
  member_2_name: 'Member 2 Name',
  additional_members: 'Additional Members On Title',
  buyers_on_title: 'Buyers On Title',
  member_mailing_address: 'Member Mailing Address',
  member_email: 'Member Email',
  member_phone: 'Member Phone',
  property_street: 'Property Street',
  property_city: 'Property City',
  property_county: 'Property County',
  property_state: 'Property State',
  property_zip: 'Property ZIP',
  property_type: 'Property Type',
  year_built: 'Year Built',
  square_footage: 'Square Footage',
  lot_size: 'Lot Size',
  bedrooms: 'Bedrooms',
  baths: 'Baths',
  apn: 'APN',
  hoa_applies: 'HOA Applies',
  hoa_name: 'HOA Name',
  legal_description: 'Legal Description',
  purchase_price: 'Purchase Price',
  seller_concessions: 'Seller Concessions',
  purchase_type: 'Purchase Type',
  occupancy: 'Occupancy',
  first_time_buyer_program: 'First-Time Buyer Program',
  lender_name: 'Lender Name',
  loan_amount: 'Loan Amount',
  down_payment: 'Down Payment',
  ltv: 'LTV',
  loan_type: 'Loan Type',
  interest_rate: 'Interest Rate',
  loan_term: 'Loan Term',
  rate_type: 'Rate Type',
  pmi_present: 'PMI Present',
  pmi_monthly: 'PMI Monthly',
  escrow_present: 'Escrow Present',
  escrow_monthly: 'Escrow Monthly',
  first_payment_date: 'First Payment Date',
  prepayment_penalty: 'Prepayment Penalty',
};

export const POST: APIRoute = async ({ request }) => {
  const session = getPartnerSessionFromRequest(request);
  if (!session) {
    return json({ error: 'Your session has expired. Please sign in again.' }, 401);
  }

  let body: IntakePayload;
  try {
    body = await parseBody(request);
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Server-side validation of the four fields that are non-negotiable.
  const referring = (body.referring_realtor || '').trim();
  const closingDate = (body.closing_date || '').trim();
  const member1 = (body.member_1_name || '').trim();
  const propertyStreet = (body.property_street || '').trim();
  const purchaseType = (body.purchase_type || '').trim();

  if (!referring) return json({ error: 'Referring Realtor name is required.' }, 400);
  if (!closingDate) return json({ error: 'Closing date is required.' }, 400);
  if (!member1) return json({ error: 'Member 1 full name is required.' }, 400);
  if (!propertyStreet) return json({ error: 'Property street address is required.' }, 400);
  if (!purchaseType) return json({ error: 'Purchase type (Financed or Cash) is required.' }, 400);

  const env: any = { ...process.env, ...(import.meta.env as any) };
  const token =
    env.AIRTABLE_TOKEN ||
    env.AIRTABLE_API_KEY ||
    env.AIRTABLE_PAT ||
    env.AIRTABLE_ACCESS_TOKEN;
  const baseId = env.AIRTABLE_BASE_ID || env.AIRTABLE_BASE;
  const table = env.AIRTABLE_TABLE_INTAKE_TX || env.AIRTABLE_INTAKE_TX_TABLE || 'Texas Intake';

  if (!token || !baseId) {
    console.error('[intake/texas] Missing Airtable config.', {
      hasToken: Boolean(token),
      hasBaseId: Boolean(baseId),
      table,
    });
    return json(
      { error: 'The intake system is not fully configured yet. Please contact admin@equityguardians.com. (Server missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID)' },
      503,
    );
  }

  // Build the Airtable fields object. Only non-empty values are included.
  const fields: Record<string, string> = {
    'Submitted By': session.name,
    'Submitted At': new Date().toISOString(),
    'Form ID': 'EG-INTAKE-TX-v1.0',
    'State': 'Texas',
  };
  for (const [key, label] of Object.entries(FIELD_LABELS) as [keyof IntakePayload, string][]) {
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
      console.error('[intake/texas] Airtable error', res.status, errText);
      let hint = 'Please try again in a moment or email admin@equityguardians.com.';
      if (res.status === 401 || res.status === 403) {
        hint = 'Airtable rejected our credentials (401/403). Check AIRTABLE_TOKEN scope & base access.';
      } else if (res.status === 404) {
        hint = `Airtable table not found. Verify AIRTABLE_BASE_ID and AIRTABLE_TABLE_INTAKE_TX (looking for "${table}").`;
      } else if (res.status === 422) {
        hint = 'Airtable schema mismatch. Ensure the target table has fields matching the labels being sent.';
      }
      return json({ error: hint, airtableStatus: res.status }, 502);
    }

    const airtableResp = await res.json().catch(() => ({}));
    const recordId = airtableResp?.records?.[0]?.id || null;
    return json({ ok: true, recordId });
  } catch (err) {
    console.error('[intake/texas] Unexpected error', err);
    return json({ error: 'Something went wrong. Please try again shortly.' }, 500);
  }
};

export const GET: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
