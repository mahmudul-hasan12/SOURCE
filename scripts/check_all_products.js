const fs = require("fs");
const products = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
let errCount = 0;
products.forEach((p, i) => {
  if (!Array.isArray(p.images)) {
    console.error("Product", i, p.id, "images is not array");
    errCount++;
  } else {
    p.images.forEach((img, j) => {
      if (typeof img !== "string") {
        console.error("Product", p.id, "image", j, "is not string:", img);
        errCount++;
      }
    });
  }
});
console.log("Total errors:", errCount, "Checked", products.length, "products in products.json");
