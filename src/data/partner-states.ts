// Partner portal. Per-state resource catalogs.
//
// Only Texas is live for now. Adding a new state = flipping `status`
// to 'active', giving it a `slug`, and listing its resources.

export type ResourceKind = 'form' | 'document' | 'video' | 'link';

export interface PartnerResource {
  title: string;
  kind: ResourceKind;
  // Short one-line description shown on the card and detail page.
  description: string;
  // Optional href for external/downloadable resources; internal ones
  // are linked via their own subpage.
  href?: string;
}

export interface PartnerState {
  name: string;
  slug: string;                 // e.g. 'texas'. The URL segment under /partners/
  status: 'active' | 'coming-soon';
  tagline?: string;             // Short one-line pitch shown on the hub card.
  resources: PartnerResource[]; // Empty when status is 'coming-soon'.
}

export const partnerStates: PartnerState[] = [
  {
    name: 'Texas',
    slug: 'texas',
    status: 'active',
    tagline: 'Enrollment, member intake, and closing paperwork.',
    resources: [
      {
        title: 'Texas Member Intake Form',
        kind: 'form',
        description: 'Fill out once per closing, working only from the paperwork already in hand. Auto-attributed to your name.',
      },
      {
        title: 'Partner Realtor Enrollment Form',
        kind: 'form',
        description: 'One-time enrollment for affiliated Buyer\'s Realtors. Company-wide, surfaced here while Texas is the first live state.',
      },
      {
        title: 'Sponsoring Broker Acknowledgment (DRAFT)',
        kind: 'document',
        description: 'Broker-signed acknowledgment covering supervision, disclosure, and compensation terms for affiliated Buyer\'s Realtors. Download, sign, and return outside the portal.',
        href: '/partners/texas/forms/EG-Texas-Sponsoring-Broker-Acknowledgment-v1.0-DRAFT.pdf',
      },
    ],
  },

  // All others are coming-soon placeholders in alphabetical order.
  { name: 'Alabama', slug: 'alabama', status: 'coming-soon', resources: [] },
  { name: 'Alaska', slug: 'alaska', status: 'coming-soon', resources: [] },
  { name: 'Arizona', slug: 'arizona', status: 'coming-soon', resources: [] },
  { name: 'Arkansas', slug: 'arkansas', status: 'coming-soon', resources: [] },
  { name: 'California', slug: 'california', status: 'coming-soon', resources: [] },
  { name: 'Colorado', slug: 'colorado', status: 'coming-soon', resources: [] },
  { name: 'Connecticut', slug: 'connecticut', status: 'coming-soon', resources: [] },
  { name: 'Delaware', slug: 'delaware', status: 'coming-soon', resources: [] },
  { name: 'Florida', slug: 'florida', status: 'coming-soon', resources: [] },
  { name: 'Georgia', slug: 'georgia', status: 'coming-soon', resources: [] },
  { name: 'Hawaii', slug: 'hawaii', status: 'coming-soon', resources: [] },
  { name: 'Idaho', slug: 'idaho', status: 'coming-soon', resources: [] },
  { name: 'Illinois', slug: 'illinois', status: 'coming-soon', resources: [] },
  { name: 'Indiana', slug: 'indiana', status: 'coming-soon', resources: [] },
  { name: 'Iowa', slug: 'iowa', status: 'coming-soon', resources: [] },
  { name: 'Kansas', slug: 'kansas', status: 'coming-soon', resources: [] },
  { name: 'Kentucky', slug: 'kentucky', status: 'coming-soon', resources: [] },
  { name: 'Louisiana', slug: 'louisiana', status: 'coming-soon', resources: [] },
  { name: 'Maine', slug: 'maine', status: 'coming-soon', resources: [] },
  { name: 'Maryland', slug: 'maryland', status: 'coming-soon', resources: [] },
  { name: 'Massachusetts', slug: 'massachusetts', status: 'coming-soon', resources: [] },
  { name: 'Michigan', slug: 'michigan', status: 'coming-soon', resources: [] },
  { name: 'Minnesota', slug: 'minnesota', status: 'coming-soon', resources: [] },
  { name: 'Mississippi', slug: 'mississippi', status: 'coming-soon', resources: [] },
  { name: 'Missouri', slug: 'missouri', status: 'coming-soon', resources: [] },
  { name: 'Montana', slug: 'montana', status: 'coming-soon', resources: [] },
  { name: 'Nebraska', slug: 'nebraska', status: 'coming-soon', resources: [] },
  { name: 'Nevada', slug: 'nevada', status: 'coming-soon', resources: [] },
  { name: 'New Hampshire', slug: 'new-hampshire', status: 'coming-soon', resources: [] },
  { name: 'New Jersey', slug: 'new-jersey', status: 'coming-soon', resources: [] },
  { name: 'New Mexico', slug: 'new-mexico', status: 'coming-soon', resources: [] },
  { name: 'New York', slug: 'new-york', status: 'coming-soon', resources: [] },
  { name: 'North Carolina', slug: 'north-carolina', status: 'coming-soon', resources: [] },
  { name: 'North Dakota', slug: 'north-dakota', status: 'coming-soon', resources: [] },
  { name: 'Ohio', slug: 'ohio', status: 'coming-soon', resources: [] },
  { name: 'Oklahoma', slug: 'oklahoma', status: 'coming-soon', resources: [] },
  { name: 'Oregon', slug: 'oregon', status: 'coming-soon', resources: [] },
  { name: 'Pennsylvania', slug: 'pennsylvania', status: 'coming-soon', resources: [] },
  { name: 'Rhode Island', slug: 'rhode-island', status: 'coming-soon', resources: [] },
  { name: 'South Carolina', slug: 'south-carolina', status: 'coming-soon', resources: [] },
  { name: 'South Dakota', slug: 'south-dakota', status: 'coming-soon', resources: [] },
  { name: 'Tennessee', slug: 'tennessee', status: 'coming-soon', resources: [] },
  { name: 'Utah', slug: 'utah', status: 'coming-soon', resources: [] },
  { name: 'Vermont', slug: 'vermont', status: 'coming-soon', resources: [] },
  { name: 'Virginia', slug: 'virginia', status: 'coming-soon', resources: [] },
  { name: 'Washington', slug: 'washington', status: 'coming-soon', resources: [] },
  { name: 'West Virginia', slug: 'west-virginia', status: 'coming-soon', resources: [] },
  { name: 'Wisconsin', slug: 'wisconsin', status: 'coming-soon', resources: [] },
  { name: 'Wyoming', slug: 'wyoming', status: 'coming-soon', resources: [] },
];

// Sorted alphabetically with Texas floated to the front so it reads first.
export function sortedStates(): PartnerState[] {
  const tx = partnerStates.find((s) => s.slug === 'texas');
  const rest = partnerStates.filter((s) => s.slug !== 'texas').sort((a, b) => a.name.localeCompare(b.name));
  return tx ? [tx, ...rest] : rest;
}

export function findStateBySlug(slug: string): PartnerState | undefined {
  return partnerStates.find((s) => s.slug === slug);
}
