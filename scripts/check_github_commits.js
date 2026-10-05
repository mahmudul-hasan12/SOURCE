async function checkGithubCommits() {
  const res = await fetch("https://api.github.com/repos/mahmudul-hasan12/SOURCE/commits");
  const data = await res.json();
  if (Array.isArray(data)) {
    console.log("Recent commits on GitHub:");
    data.slice(0, 4).forEach(c => {
      console.log(`- ${c.sha.substring(0, 7)}: ${c.commit.message.split('\n')[0]} (${c.commit.committer.date})`);
    });
  } else {
    console.log("GitHub API response:", data);
  }
}
checkGithubCommits();
