async function check() {
  const res = await fetch("https://api.github.com/repos/mahmudul-hasan12/SOURCE/deployments/6853501858/statuses");
  const data = await res.json();
  if (Array.isArray(data) && data[0]) {
    console.log("Status:", data[0].state, "URL:", data[0].environment_url || data[0].target_url);
    console.log("Description:", data[0].description);
  } else {
    console.log("Statuses:", data);
  }
}
check();
