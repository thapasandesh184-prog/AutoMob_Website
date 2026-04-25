import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'SKay Auto Group';
const SITE_URL = 'https://skayautogroup.ca';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Luxury & Exotic Car Dealership`;
  const fullDescription = description || 'Discover the finest collection of luxury and exotic vehicles at SKay Auto Group. Premium pre-owned cars, SUVs, and supercars with world-class service.';
  const fullImage = image || DEFAULT_IMAGE;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="SKay Auto Group" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_CA" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

// Predefined JSON-LD schemas
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'SKay Auto Group',
  image: 'https://skayautogroup.ca/logo.png',
  '@id': 'https://skayautogroup.ca',
  url: 'https://skayautogroup.ca',
  telephone: '+1-778-990-7468',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '21320 Westminster Hwy #2128',
    addressLocality: 'Richmond',
    addressRegion: 'BC',
    postalCode: 'V5W 3A3',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.1983,
    longitude: -123.1364,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  priceRange: '$$$$',
  areaServed: {
    '@type': 'City',
    name: 'Richmond',
  },
};

export const vehicleSchema = (vehicle) => ({
  '@context': 'https://schema.org',
  '@type': 'Vehicle',
  name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
  image: vehicle.images?.[0] || '',
  description: vehicle.description || '',
  brand: {
    '@type': 'Brand',
    name: vehicle.make,
  },
  model: vehicle.model,
  vehicleModelDate: vehicle.year,
  mileageFromOdometer: {
    '@type': 'QuantitativeValue',
    value: vehicle.mileage,
    unitCode: 'KMT',
  },
  offers: {
    '@type': 'Offer',
    price: vehicle.price,
    priceCurrency: 'CAD',
    availability: vehicle.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'AutoDealer',
      name: 'SKay Auto Group',
    },
  },
  color: vehicle.exteriorColor,
  vehicleInteriorColor: vehicle.interiorColor,
  vehicleTransmission: vehicle.transmission,
  fuelType: vehicle.fuelType,
  bodyType: vehicle.bodyStyle,
});

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SKay Auto Group',
  url: 'https://skayautogroup.ca',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://skayautogroup.ca/inventory?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};
