export default function sitemap() {
  const base = 'https://nazeefaahmed.com';
  return [
    { url: base, lastModified: new Date().toISOString() },
  ];
}
