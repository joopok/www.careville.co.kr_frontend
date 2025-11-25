import { Helmet } from 'react-helmet-async';

const StructuredData = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "케어빌",
    "image": "https://www.careville.co.kr/logo.png",
    "@id": "https://www.careville.co.kr",
    "url": "https://www.careville.co.kr",
    "telephone": "1600-9762",
    "email": "info@careville.co.kr",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "강남구",
      "addressRegion": "서울특별시",
      "addressCountry": "KR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.5172,
      "longitude": 127.0473
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
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "priceRange": "₩₩",
    "description": "에어컨 청소, 입주 청소, 매트리스 케어 등 전문적인 홈케어 서비스를 제공합니다.",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 37.5172,
        "longitude": 127.0473
      },
      "geoRadius": "50000"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "250"
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
