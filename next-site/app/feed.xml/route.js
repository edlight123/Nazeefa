export async function GET() {
  const items = [
    {
      title: "Genome-wide study makes 'quantum leap' in understanding stuttering",
      link: 'https://www.science.org/content/article/genome-wide-study-makes-quantum-leap-understanding-stuttering',
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Nazeefa Ahmed</title>
      <link>https://nazeefaahmed.com</link>
      <description>Reporter. Researcher. Photographer.</description>
      ${items
        .map(
          (i) => `
      <item>
        <title>${i.title}</title>
        <link>${i.link}</link>
      </item>`
        )
        .join('')}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
