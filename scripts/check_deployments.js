async function checkDeployments() {
  const res = await fetch("https://api.github.com/repos/mahmudul-hasan12/SOURCE/deployments");
  const data = await res.json();
  console.log("Deployments:", JSON.stringify(data.slice(0, 3), null, 2));
}
checkDeployments();
