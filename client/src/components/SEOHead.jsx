import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

const SEOHead = ({ title, description, url, keywords, schemaMarkup, ogImage = "https://rk-tours-travels.vercel.app/default-og-image.jpg" }) => {
  const [faviconUrl, setFaviconUrl] = useState('/RK1.png');
  const logoUrl = '/RK1.png';
  const siteNameState = 'RK TOURS & TRAVELS';

  useEffect(() => {
    // Dynamically round the favicon corners using Canvas
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      const radius = img.width * 0.25; // 25% border radius
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.arcTo(canvas.width, 0, canvas.width, radius, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.arcTo(canvas.width, canvas.height, canvas.width - radius, canvas.height, radius);
      ctx.lineTo(radius, canvas.height);
      ctx.arcTo(0, canvas.height, 0, canvas.height - radius, radius);
      ctx.lineTo(0, radius);
      ctx.arcTo(0, 0, radius, 0, radius);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      
      try {
        setFaviconUrl(canvas.toDataURL('image/png'));
      } catch {
        console.warn("CORS prevented dynamic favicon rounding");
      }
    };
    img.src = logoUrl;
  }, []);

  const siteUrl = import.meta.env.VITE_FRONTEND_URL || 'https://rk-tours-travels.vercel.app';
  const fullUrl = `${siteUrl}${url || ''}`;
  const fullTitle = title ? `${title} | ${siteNameState}` : siteNameState;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="icon" type="image/png" href={faviconUrl} />
      <link rel="shortcut icon" type="image/png" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />
      <meta name="description" content={description || "Top rated cab booking service in India."} />
      {keywords && (
        <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />
      )}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteNameState} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || "Top rated cab booking service in India."} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={logoUrl || ogImage} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || "Top rated cab booking service in India."} />
      <meta name="twitter:image" content={logoUrl || ogImage} />

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