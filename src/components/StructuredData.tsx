import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/site';

const StructuredData = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteConfig.name,
    "image": siteConfig.logoUrl,
    "@id": siteConfig.url,
    "url": siteConfig.url,
    "telephone": siteConfig.contact.phone,
    "email": siteConfig.contact.emailOfficial,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": siteConfig.seo.geo.addressLocality,
      "addressRegion": siteConfig.seo.geo.addressRegion,
      "addressCountry": siteConfig.seo.geo.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": siteConfig.seo.geo.latitude,
      "longitude": siteConfig.seo.geo.longitude
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": siteConfig.seo.openingHours.opens,
        "closes": siteConfig.seo.openingHours.closes
      }
    ],
    "priceRange": siteConfig.seo.priceRange,
    "description": siteConfig.description,
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": siteConfig.seo.geo.latitude,
        "longitude": siteConfig.seo.geo.longitude
      },
      "geoRadius": String(siteConfig.seo.geo.serviceRadius)
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": siteConfig.seo.rating.value,
      "reviewCount": siteConfig.seo.rating.reviewCount
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "홈케어 서비스",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "에어컨 케어 및 세척",
            "description": "전문 기술로 에어컨을 깨끗하게 세척합니다."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "입주/이사 청소",
            "description": "새집 입주 전 전문 청소 서비스"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "매트리스 청소(케어)",
            "description": "진드기 제거 및 매트리스 깊은 청소"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "세탁기 케어",
            "description": "세탁기 내부 곰팡이 및 찌든때 제거"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
