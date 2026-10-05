async function checkHeaders() {
  const res = await fetch("https://skylinebd.vercel.app");
  console.log("x-vercel-id:", res.headers.get("x-vercel-id"));
  console.log("x-matched-path:", res.headers.get("x-matched-path"));
  console.log("age:", res.headers.get("age"));
}
checkHeaders();
