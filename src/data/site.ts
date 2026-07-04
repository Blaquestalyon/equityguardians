export const site = {
  name: 'Equity Guardians',
  tagline: 'Protecting Your Most Precious Asset — Today and Tomorrow',
  motto: 'SAVE — EARN — PROTECT',
  description:
    'Mortgage-based foreclosure protection, curated savings, and equity recovery. The only service of its kind in the United States.',
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
    hours: 'Monday – Friday · 9:00 AM – 5:00 PM (EST)',
  },
  social: {
    linkedin: '#',
    facebook: '#',
    x: '#',
  },
  pricing: {
    monthly: 28,
    monthlyDisplay: '$28 / month',
  },
} as const;

export const nav = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Attorneys', href: '/attorneys' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
] as const;
