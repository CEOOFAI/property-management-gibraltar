export const DOMAIN = 'https://propertymanagementgibraltar.com';
export function getCanonical(path: string): string {
  return `${DOMAIN}${path === '/' ? '' : path}`;
}
export function generateWebsiteLD(): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Property Management Gibraltar', url: DOMAIN,
    description: 'Professional property management services in Gibraltar for landlords and investors.' });
}
export function generateLocalBusinessLD(): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Property Management Gibraltar',
    url: DOMAIN, description: 'Professional property management services in Gibraltar.',
    address: { '@type': 'PostalAddress', addressLocality: 'Gibraltar', addressCountry: 'GI' },
    areaServed: { '@type': 'Place', name: 'Gibraltar' },
    serviceType: ['Property Management', 'Tenant Finding', 'Rent Collection', 'Property Maintenance'] });
}
export function generateServiceLD(service: { name: string; description: string; url: string }): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'Service', name: service.name,
    description: service.description, url: service.url,
    provider: { '@type': 'LocalBusiness', name: 'Property Management Gibraltar', url: DOMAIN },
    areaServed: { '@type': 'Place', name: 'Gibraltar' } });
}
export function generateBreadcrumbLD(items: { name: string; url: string }[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })) });
}
export function generateFAQLD(faqs: { q: string; a: string }[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
}
export function generateArticleLD(a: { title: string; description: string; url: string; image?: string; datePublished: string; author?: string }): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description,
    url: a.url, ...(a.image && { image: a.image }), datePublished: a.datePublished,
    author: { '@type': 'Person', name: a.author || 'Property Management Gibraltar' },
    publisher: { '@type': 'Organization', name: 'Property Management Gibraltar', url: DOMAIN } });
}
