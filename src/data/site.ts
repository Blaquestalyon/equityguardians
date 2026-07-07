export const site = {
  name: 'Equity Guardians',
  tagline: 'Protecting Your Most Precious Asset, Today and Tomorrow',
  motto: 'SAVE · EARN · PROTECT',
  description:
    'Mortgage-based foreclosure protection, curated savings, and equity recovery: free to the buyer when represented by an affiliated Buyer’s Realtor, for the life of the deed of trust.',
  url: 'https://equityguardians.com',
  contact: {
    email: 'admin@equityguardians.com',
    phone: '+1 (888) 954-0999',
    phoneHref: 'tel:+18889540999',
    address: {
      line1: '1 World Trade Center, 85th Floor',
      line2: 'New York, NY 10007',
      country: 'United States',
    },
    hours: 'Monday to Friday, 9:00 AM to 5:00 PM (EST)',
  },
  social: {
    linkedin: '#',
    facebook: '#',
    x: '#',
  },
  pricing: {
    display: 'Free to the buyer',
    subDisplay: 'when represented by an affiliated Buyer’s Realtor',
    coverageDuration: 'For the life of the deed of trust',
  },
} as const;

export const nav = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Attorneys', href: '/attorneys' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
] as const;
