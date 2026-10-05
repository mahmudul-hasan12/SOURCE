const rawTitle = "美式复古牛仔裤";
const combined = "https://detail.1688.com/offer/999911110099.html " + rawTitle;
console.log("combined:", combined);
console.log("denim regex:", /牛仔裤|牛仔|阔腿|微喇|高街|复古|denim|jeans/i.test(combined));
console.log("earbuds regex:", /耳机|蓝牙|降噪|anc|tws|earbuds|headphone|audio/i.test("蓝牙降噪耳机"));
