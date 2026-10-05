async function inspectTarget() {
  const url = "https://skylinebd-r0fom8gaz-opuuu.vercel.app";
  const r = await fetch(url);
  console.log("Status:", r.status, r.statusText);
  console.log("x-vercel-error:", r.headers.get("x-vercel-error"));
  console.log("x-vercel-id:", r.headers.get("x-vercel-id"));
  const t = await r.text();
  console.log("Body preview:", t.substring(0, 400));
}
inspectTarget();
