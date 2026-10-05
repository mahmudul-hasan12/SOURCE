async function inspectVercel() {
  const dpls = [
    "dpl_GsUKGishgZiPNKXieRzMdbJFFa4U",
    "dpl_EoQRnrKhVe1D66c9FRvYjXqaHJZz",
    "dpl_3QToaVHooPLaTkiRQs6PJRfLJWhn"
  ];
  for (const id of dpls) {
    console.log(`Checking ${id}...`);
    const r = await fetch(`https://api.vercel.com/v13/deployments/${id}`);
    console.log("Status:", r.status);
    const d = await r.json();
    console.log("Response:", JSON.stringify(d, null, 2));
  }
}
inspectVercel();
