fetch("./README.md")
  .then(response => response.text())
  .then(data => {
    console.log(data);
  });
