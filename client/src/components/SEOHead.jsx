import { Helmet } from 'react-helmet-async';

const SEOHead = ({ title, description, url, keywords, schemaMarkup, ogImage }) => {
  const siteUrl = import.meta.env.VITE_FRONTEND_URL || 'https://yourbrand.com';
  const fullUrl = `${siteUrl}${url}`;

  return (
    <Helmet>
      <title>{title} | YourBrand</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Schema Markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {schemaMarkup}
        </script>
      )}
    </Helmet>
  );
};
export default SEOHead;