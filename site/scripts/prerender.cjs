const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const root = path.resolve(__dirname, '..');
const escape = value =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
(async () => {
  const {routes, render} = await import(
    pathToFileURL(path.join(root, '.ssr/prerender.mjs'))
  );
  const dist = path.join(root, 'dist');
  const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  for (const page of routes) {
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root" data-route="${page.route}">${render(page.route)}</div>`,
    );
    html = html
      .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
      .replace(
        /(<meta name="description" content=")[^"]*("\s*\/>)/,
        `$1${escape(page.description)}$2`,
      )
      .replace(
        /(<meta property="og:title" content=")[^"]*("\s*\/>)/,
        `$1${escape(page.title)}$2`,
      )
      .replace(
        /(<meta property="og:description" content=")[^"]*("\s*\/>)/,
        `$1${escape(page.description)}$2`,
      )
      .replace(
        /(<meta property="og:url" content=")[^"]*("\s*\/>)/,
        `$1${page.canonical}$2`,
      )
      .replace(
        /(<link rel="canonical" href=")[^"]*("\s*\/>)/,
        `$1${page.canonical}$2`,
      );
    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      url: page.canonical,
      isPartOf: {
        '@type': 'WebSite',
        name: 'WooSign',
        url: 'https://woo-bottle.com/woosign/',
      },
    };
    html = html.replace(
      '</head>',
      `<script type="application/ld+json">${JSON.stringify(data).replaceAll(
        '<',
        '\\u003c',
      )}</script></head>`,
    );
    const directory = path.join(dist, page.route.replace(/^\//, ''));
    fs.mkdirSync(directory, {recursive: true});
    fs.writeFileSync(path.join(directory, 'index.html'), html);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(p => `  <url><loc>${escape(p.canonical)}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
  fs.writeFileSync(
    path.join(dist, 'robots.txt'),
    'User-agent: *\nAllow: /woosign/\nSitemap: https://woo-bottle.com/woosign/sitemap.xml\n',
  );
  console.log(`Prerendered ${routes.length} searchable pages and sitemap.xml`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
