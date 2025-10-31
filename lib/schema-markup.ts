
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kreative Web Agency',
    url: 'https://creative-web-agency-zlgi4u.abacusai.app',
    logo: 'https://i.pinimg.com/736x/b1/ed/c1/b1edc133615164ccebf76d9e5906f346.jpg',
    description: 'Professional web design and development agency specializing in custom websites, web applications, and digital solutions for businesses.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-984-400-9443',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    sameAs: [
      // Add your social media profiles here
      // 'https://facebook.com/kreativewebagency',
      // 'https://twitter.com/kreativeweb',
      // 'https://linkedin.com/company/kreativewebagency',
    ],
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kreative Web Agency',
    image: 'https://i.pinimg.com/564x/ba/d0/3b/bad03b46227739d5faa5b84db4b9c810.jpg',
    '@id': 'https://creative-web-agency-zlgi4u.abacusai.app',
    url: 'https://creative-web-agency-zlgi4u.abacusai.app',
    telephone: '+1-984-400-9443',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      opens: '09:00',
      closes: '17:00'
    },
  };
}

export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    provider: {
      '@type': 'Organization',
      name: 'Kreative Web Agency',
    },
    description: service.description,
    url: service.url,
    ...(service.priceRange && { priceRange: service.priceRange }),
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
