async function check() {
  const res = await fetch('https://skylinebd-6awkn8vjb-opuuu.vercel.app');
  const text = await res.text();
  console.log('Title in HTML:', text.match(/<title>([^<]+)<\/title>/)?.[1]);
  console.log('Contains SkySourcing:', text.includes('SkySourcing') || text.includes('skysourcing'));
  console.log('Snippet:', text.substring(0, 500));
}
check();
