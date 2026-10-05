async function checkFailedDeployment() {
  const res = await fetch("https://skylinebd-4203y86f1-opuuu.vercel.app");
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response text:", text.substring(0, 500));
}
checkFailedDeployment();
