import { SitemapStream, streamToPromise } from 'sitemap';
export const generateSitemap = async (req, res) => {
  try {
    const smStream = new SitemapStream({ hostname: process.env.FRONTEND_URL });
    const seoPages = await SEO.find({});
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    seoPages.forEach(page => {
      smStream.write({ url: page.pageUrl, changefreq: 'weekly', priority: 0.8 });
    });
    smStream.end();
    const sitemapOutput = (await streamToPromise(smStream)).toString();
    res.header('Content-Type', 'application/xml');
    res.send(sitemapOutput);
  } catch (error) {
    res.status(500).end();
  }
};