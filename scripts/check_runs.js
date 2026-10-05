async function checkCheckRuns() {
  const res = await fetch("https://api.github.com/repos/mahmudul-hasan12/SOURCE/commits/5c8ff4b/check-runs");
  const data = await res.json();
  console.log("Check runs count:", data.total_count);
  if (data.check_runs) {
    data.check_runs.forEach(cr => {
      console.log(`- Name: ${cr.name}, Status: ${cr.status}, Conclusion: ${cr.conclusion}`);
      console.log(`  Output title: ${cr.output?.title}`);
      console.log(`  Output summary: ${cr.output?.summary}`);
      console.log(`  Output text: ${cr.output?.text}`);
    });
  }
}
checkCheckRuns();
