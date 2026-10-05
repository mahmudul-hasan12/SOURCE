async function checkLatestStatus() {
  const res = await fetch("https://api.github.com/repos/mahmudul-hasan12/SOURCE/deployments/6853557750/statuses");
  const data = await res.json();
  console.log("Full data:", JSON.stringify(data, null, 2));
}
checkLatestStatus();
