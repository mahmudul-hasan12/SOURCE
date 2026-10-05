async function countDeployments() {
  const res = await fetch("https://api.github.com/repos/mahmudul-hasan12/SOURCE/deployments?per_page=100");
  const data = await res.json();
  console.log("Total deployments returned:", data.length);
  const today = new Date().toISOString().substring(0, 10);
  const todayDeploys = data.filter(d => d.created_at && d.created_at.startsWith(today));
  console.log(`Deployments created today (${today}):`, todayDeploys.length);
}
countDeployments();
