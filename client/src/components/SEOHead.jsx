import { Helmet } from 'react-helmet-async';

const SEOHead = ({ title, description, url, keywords, schemaMarkup, ogImage = "https://rk-tours-travels.vercel.app/default-og-image.jpg" }) => {
  const siteUrl = import.meta.env.VITE_FRONTEND_URL || 'https://rk-tours-travels.vercel.app';
  const fullUrl = `${siteUrl}${url || ''}`;
  const siteName = "RK Tours & Travels";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || "Top rated cab booking service in India."} />
      {keywords && (
        <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />
      )}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || "Top rated cab booking service in India."} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || "Top rated cab booking service in India."} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema Markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {typeof schemaMarkup === 'string' ? schemaMarkup : JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};
export default SEOHead;