// Partner portal. Promotional media catalog (flyers, one-pagers, etc.).
//
// This file is the single source of truth for promotional / marketing assets
// realtors download from state resource pages. It is intentionally kept
// separate from operational forms (intake, checklists, etc.) so the two can
// evolve independently and the UI can show them in labeled sections.
//
// Adding a new flyer to Texas: append an entry to `texasFlyers`. Every flyer
// needs a cover image (thumbnail) and one or more download variants.
// Standard convention: each flyer lives in its own folder under
// /public/partners/<state>/media/<slug>/ with three assets:
//   1. <slug>-DIGITAL.pdf         Screen / email / low-ink laser printing
//   2. <slug>-PRINT-CMYK-bleed.pdf Professional printer (CMYK, crop marks, bleed)
//   3. <slug>-cover.jpg           High-res original for social / email signatures
//   4. <slug>-cover-thumb.{jpg,webp}  Optimized card thumbnail (auto-generated)

export type FlyerAudience = 'Buyer' | 'Realtor' | 'Both';

export type FlyerVariantKind = 'digital' | 'print' | 'image';

export interface FlyerVariant {
  kind: FlyerVariantKind;
  label: string;          // Button label shown to the realtor
  href: string;           // Absolute path under /public/
  filename: string;       // Suggested download filename (drives the `download` attr)
  note?: string;          // Small helper text under the button
  fileSize?: string;      // Human-readable, e.g. "33 KB"
}

export interface Flyer {
  slug: string;           // e.g. 'the-gap'
  name: string;           // Display name, e.g. 'The Gap'
  audience: FlyerAudience;
  focus: string;          // One-line C2A / positioning line shown under the name
  cover: {
    thumb: string;        // Card thumbnail (small, optimized)
    thumbWebp?: string;   // Optional WebP for the <picture> element
    alt: string;
  };
  variants: FlyerVariant[];
}

export const texasFlyers: Flyer[] = [
  {
    slug: 'the-gap',
    name: 'The Gap',
    audience: 'Buyer',
    focus:
      "Their lender's protected the day they sign. They're not. Buying with you closes the gap, free to them.",
    cover: {
      thumb: '/partners/texas/media/the-gap/EG-Buyer-Flyer-The-Gap-cover-thumb.jpg',
      thumbWebp: '/partners/texas/media/the-gap/EG-Buyer-Flyer-The-Gap-cover-thumb.webp',
      alt: 'The Gap flyer preview: front page shows the headline "The moment you sign, your lender\'s interests are protected. So should yours be."',
    },
    variants: [
      {
        kind: 'digital',
        label: 'Digital PDF',
        href: '/partners/texas/media/the-gap/EG-Buyer-Flyer-The-Gap-DIGITAL.pdf',
        filename: 'EG-Buyer-Flyer-The-Gap-DIGITAL.pdf',
        note: 'Screen viewing, email, and standard laser / inkjet printing.',
        fileSize: '33 KB',
      },
      {
        kind: 'print',
        label: 'Print PDF',
        href: '/partners/texas/media/the-gap/EG-Buyer-Flyer-The-Gap-PRINT-CMYK-bleed.pdf',
        filename: 'EG-Buyer-Flyer-The-Gap-PRINT-CMYK-bleed.pdf',
        note: 'For a professional printer: CMYK color, crop marks, and bleed. Do not open in a browser preview.',
        fileSize: '37 KB',
      },
      {
        kind: 'image',
        label: 'Image (JPG)',
        href: '/partners/texas/media/the-gap/EG-Buyer-Flyer-The-Gap-cover.jpg',
        filename: 'EG-Buyer-Flyer-The-Gap-cover.jpg',
        note: 'High-resolution image for social posts and email signatures.',
        fileSize: '322 KB',
      },
    ],
  },
];
