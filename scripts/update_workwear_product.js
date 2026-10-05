const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const workwearProduct = {
  id: "prod-895199300568",
  sourcePlatform: "1688",
  sourceOfferId: "895199300568",
  url: "https://detail.1688.com/offer/895199300568.html",
  titleCn: "纯棉工作服男套装春秋加厚 单件/套装劳保服耐磨汽修电焊工装制服",
  titleEn: "Men's Heavyweight Pure Cotton Workwear Uniform Suit (Industrial Repair & Workshop Jacket Set)",
  descriptionCn: "纯棉工作服男套装春秋加厚，源头实力工厂直供，耐磨防烫，汽修机械维修电焊定制工装制服。",
  description: "Guangzhou Baiyun Industrial Garment Manufacturing Co., Ltd. Direct factory wholesale men's heavyweight pure cotton workwear uniform suit. Reinforced triple-stitching, spark-resistant and wear-resistant fabric, engineered for auto repair, engineering, and manufacturing plants with verified Guangzhou warehouse QC inspection.",
  images: [
    "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
    "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=800"
  ],
  descriptionImages: [
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    "https://images.unsplash.com/photo-1544441893-675973e31985?w=800"
  ],
  attributes: [
    {
      keyCn: "材质",
      keyEn: "Material",
      valueCn: "100% 精梳纯棉加厚斜纹",
      valueEn: "100% Combed Heavy Cotton Twill"
    },
    {
      keyCn: "适用行业",
      keyEn: "Target Industry",
      valueCn: "汽修、机械制造、工程作业、车间",
      valueEn: "Automotive, Machinery, Engineering, Plant Workshops"
    },
    {
      keyCn: "特性",
      keyEn: "Protective Features",
      valueCn: "耐磨、透气、防静电、抗撕裂",
      valueEn: "Wear-Resistant, Breathable, Anti-Static, Tear-Resistant"
    },
    {
      keyCn: "产地",
      keyEn: "Manufacturing Origin",
      valueCn: "广东东莞服装产业基地",
      valueEn: "Dongguan Industrial Garment Base, Guangdong"
    }
  ],
  priceTiers: [
    { range: "2–9 pcs", minQty: 2, priceRmb: 35.0 },
    { range: "10–49 pcs", minQty: 10, priceRmb: 31.5 },
    { range: "50+ pcs", minQty: 50, priceRmb: 28.0 }
  ],
  basePriceRmb: 35.0,
  skus: [
    { id: "sku-8951-1", name: "Navy Blue - 2-Piece Suit (Jacket + Pants)", nameCn: "藏青色 套装", priceRmb: 35.0, stock: 4500 },
    { id: "sku-8951-2", name: "Industrial Gray - 2-Piece Suit", nameCn: "工业灰 套装", priceRmb: 35.0, stock: 3800 },
    { id: "sku-8951-3", name: "Heavyweight Orange / Navy Two-Tone", nameCn: "拼色橙蓝 套装", priceRmb: 37.0, stock: 2200 }
  ],
  category: "apparel",
  shopName: "Guangzhou Baiyun Industrial Garment Manufacturing Co., Ltd.",
  location: "Guangdong, China",
  estimatedWeightKg: 0.85,
  minOrderQty: 2,
  createdAt: new Date().toISOString()
};

const existingIndex = products.findIndex(p => p.id === workwearProduct.id || p.sourceOfferId === workwearProduct.sourceOfferId);
if (existingIndex >= 0) {
  products[existingIndex] = workwearProduct;
  console.log('Updated existing prod-895199300568');
} else {
  products.unshift(workwearProduct);
  console.log('Inserted new prod-895199300568 at top of catalog');
}

fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
console.log('Catalog updated. Total products:', products.length);
