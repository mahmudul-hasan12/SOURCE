async function testFresh() {
  const tests = [
    {
      name: "Fresh 1688 Denim Cargo Link with Chinese query",
      url: "https://detail.1688.com/offer/999911110099.html?topicName=%E7%BE%8E%E5%BC%8F%E5%A4%8D%E5%8F%A4%E7%89%9B%E4%BB%94%E8%A3%A4"
    },
    {
      name: "Fresh Taobao ANC Earbuds Link",
      url: "https://item.taobao.com/item.htm?id=999922220099&title=%E8%93%9D%E7%89%99%E9%99%8D%E5%99%AA%E8%80%B3%E6%9C%BA"
    }
  ];

  for (const t of tests) {
    console.log(`\n========================================`);
    console.log(`TEST: ${t.name}`);
    console.log(`URL: ${t.url}`);
    const apiUrl = `https://skylinebd.vercel.app/api/products/resolve?url=${encodeURIComponent(t.url)}`;
    
    try {
      const res = await fetch(apiUrl);
      console.log(`API Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log(`Success:`, data.success);
      console.log(`Redirect URL:`, data.redirectUrl);
      if (data.product) {
        console.log(`Product ID:`, data.product.id);
        console.log(`Title:`, data.product.titleEn);
        console.log(`Category:`, data.product.category);
        console.log(`Base Price RMB: ¥${data.product.basePriceRmb}`);
        console.log(`First Image:`, data.product.images?.[0]);
      }
    } catch (err) {
      console.error(`Test failed:`, err.message);
    }
  }
}

testFresh();
