async function check() {
  const urls = [
    'https://skylinebd.vercel.app',
    'https://skylinebd-6awkn8vjb-opuuu.vercel.app'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`[${url}] Status:`, res.status, res.statusText);
      const text = await res.text();
      console.log(`Content length:`, text.length, 'Preview:', text.substring(0, 150).replace(/\n/g, ' '));
    } catch (err) {
      console.error(`Error fetching ${url}:`, err.message);
    }
  }
}
check();
