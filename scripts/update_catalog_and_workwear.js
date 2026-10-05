const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'data', 'products.json');
let products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const workwearUpdated = {
  id: "prod-895199300568",
  sourcePlatform: "1688",
  sourceOfferId: "895199300568",
  url: "https://detail.1688.com/offer/895199300568.html",
  titleCn: "工厂直营 纯棉防烫 耐磨抗撕裂 工作服套装 (春夏纯棉工作服套装男透气吸汗耐磨机修电焊劳保服工厂车间工程服定)",
  titleEn: "Men's Pure Cotton Heavyweight Workwear Uniform Suit (Anti-Scald & Tear-Resistant Workshop Jacket & Pants Set)",
  descriptionCn: "纯棉防烫耐磨抗撕裂，工厂直营源头现货，支持单套起批，河北石家庄工装劳保产业带源头实力出货。",
  description: "Direct factory wholesale heavy-duty pure cotton workwear uniform suit. High-density pure cotton drill fabric (280 GSM), certified spark & scald resistant for electric welding, machinery maintenance, and industrial workshops. Featuring stand collar, chest cargo flap pockets, and reinforced wear-resistant pants. Direct from Shijiazhuang Hebei manufacturing belt with 1-set sample MOQ.",
  images: [
    "/products/workwear-green-main.jpg",
    "/products/workwear-studio-hd.jpg",
    "/products/workwear-blue-581.jpg",
    "/products/workwear-green-pants.jpg"
  ],
  descriptionImages: [
    "/products/workwear-studio-hd.jpg"
  ],
  attributes: [
    {
      keyCn: "材质",
      keyEn: "Material",
      valueCn: "100% 纯棉加厚高密斜纹 (防烫耐磨)",
      valueEn: "100% Pure Heavyweight Cotton Twill (Scald & Wear Resistant)"
    },
    {
      keyCn: "适用行业",
      keyEn: "Target Industry",
      valueCn: "电焊劳保、机修汽修、车间流水线、工程作业",
      valueEn: "Welding, Automotive/Machinery Repair, Factory Workshops, Construction"
    },
    {
      keyCn: "特性",
      keyEn: "Key Features",
      valueCn: "防烫抗撕裂、透气吸汗、立体剪裁、不起球不褪色",
      valueEn: "Scald & Tear Resistant, Breathable, Anti-Pilling, Fade-Resistant"
    },
    {
      keyCn: "产地",
      keyEn: "Manufacturing Belt",
      valueCn: "河北石家庄工装劳保产业带",
      valueEn: "Shijiazhuang Industrial Workwear Hub, Hebei"
    }
  ],
  priceTiers: [
    {
      range: "1–49 sets",
      minQty: 1,
      priceRmb: 31.06
    },
    {
      range: "50–199 sets",
      minQty: 50,
      priceRmb: 28.50
    },
    {
      range: "200+ sets",
      minQty: 200,
      priceRmb: 25.80
    }
  ],
  basePriceRmb: 31.06,
  skus: [
    {
      id: "sku-581-grn",
      name: "[Military Green] Exquisite 581 Set",
      nameCn: "军绿精美581套装",
      image: "/products/workwear-green-581.jpg",
      priceRmb: 31.06,
      stock: 9676
    },
    {
      id: "sku-420-grn",
      name: "[Military Green] Exquisite 420 Set",
      nameCn: "军绿精美420套装",
      image: "/products/workwear-green-420.jpg",
      priceRmb: 31.06,
      stock: 9977
    },
    {
      id: "sku-581-blu",
      name: "[Dark Blue] Exquisite 581 Set",
      nameCn: "深蓝精美581套装",
      image: "/products/workwear-blue-581.jpg",
      priceRmb: 31.06,
      stock: 9827
    },
    {
      id: "sku-pants-grn",
      name: "Military Green Industrial Pants",
      nameCn: "军绿单裤",
      image: "/products/workwear-green-pants.jpg",
      priceRmb: 18.50,
      stock: 9786
    }
  ],
  sizes: [
    "165 [90–100 jin / 45–50 kg]",
    "170 [100–110 jin / 50–55 kg]",
    "175 [110–130 jin / 55–65 kg]",
    "180 [130–150 jin / 65–75 kg]",
    "185 [150–170 jin / 75–85 kg]",
    "190 [170–190 jin / 85–95 kg]"
  ],
  factoryBadges: [
    "⭐ 4.4 AI Yanxuan Index",
    "🏭 Samsung Supply Chain Partner",
    "🛡️ Late Delivery Guarantee",
    "⚡ Ships within 48 Hours"
  ],
  category: "apparel",
  shopName: "Hebei Juxian Industrial Workwear Manufacturing Co., Ltd.",
  location: "Shijiazhuang, Hebei",
  estimatedWeightKg: 0.85,
  minOrderQty: 1,
  createdAt: "2026-10-05T05:56:35.900Z"
};

// Update workwear item
const idx = products.findIndex(p => p.id === 'prod-895199300568');
if (idx >= 0) {
  products[idx] = workwearUpdated;
} else {
  products.unshift(workwearUpdated);
}

// Clean up broken dummy URLs across catalog
products.forEach(p => {
  if (p.id === 'prod-998877665544') {
    p.images = ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"];
    p.descriptionImages = [];
  }
  if (p.id === 'prod-946712326591_v2') {
    p.images = ["https://images.unsplash.com/photo-1542272604-780c96856592?w=800"];
  }
  if (p.id === 'prod-891230491823' && (!p.images || !p.images.length)) {
    p.images = ["https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800"];
  }
});

fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf8');
console.log('✓ Successfully updated products.json with 1:1 1688 Workwear suit and cleaned image URLs');
