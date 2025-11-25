import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO = ({ 
  title = "케어빌 - 프리미엄 홈케어 서비스", 
  description = "에어컨 청소, 입주 청소, 매트리스 케어 등 전문적인 홈케어 서비스를 제공합니다. 케어빌과 함께 깨끗하고 건강한 공간을 만들어보세요.", 
  keywords = "케어빌, 에어컨청소, 입주청소, 매트리스청소, 세탁기청소, 홈케어, 청소업체",
  image = "/og-image.png",
  url = "https://www.careville.co.kr"
}: SEOProps) => {
  const siteTitle = title === "케어빌 - 프리미엄 홈케어 서비스" ? title : `${title} | 케어빌`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="CareVille" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="케어빌" />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
