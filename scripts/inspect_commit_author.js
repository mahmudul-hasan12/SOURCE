async function checkAuthor() {
  const res = await fetch("https://api.github.com/repos/mahmudul-hasan12/SOURCE/commits/adb2a65");
  const data = await res.json();
  console.log("Author:", data.commit?.author);
  console.log("Committer:", data.commit?.committer);
}
checkAuthor();
