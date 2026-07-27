import { DataStore } from '../../lib/dataStoreFirebase';

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const articles = await DataStore.getArticles();

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Nazeefa Ahmed</title>
      <link>https://nazeefaahmed.com</link>
      <description>Reporter. Researcher. Photographer.</description>
      ${articles
        .map(
          (a) => `
      <item>
        <title>${escapeXml(a.title)}</title>
        <link>${escapeXml(a.href)}</link>
        <source>${escapeXml(a.outlet)}</source>
      </item>`
        )
        .join('')}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
