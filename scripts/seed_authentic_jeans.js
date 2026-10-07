const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0';

async function seedJeans() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('skysourcing');
  const collection = db.collection('products');

  // 1. Offer 774556173956: Retro High Street Wide-Leg Vintage Denim Jeans
  const prod774 = {
    id: 'prod-774556173956',
    sourcePlatform: '1688',
    sourceOfferId: '774556173956',
    url: 'https://detail.1688.com/offer/774556173956.html',
    titleCn: '港风牛仔裤男款高街宽松直筒阔腿潮牌ins裤子男生春秋款潮流痞帅',
    titleEn: "Men's Hong Kong Style High Street Loose Wide-Leg Retro Denim Jeans",
    titleBn: 'ছেলেদের হংকং স্টাইল হাই-স্ট্রিট ভিন্টেজ ওয়াইড-লেগ ডেনিম জিন্স',
    description: 'Direct factory wholesale supply from verified denim garment base in Guangdong. Premium washed cotton denim fabric, high-street loose straight fit, pre-shipment quality inspected at Guangzhou Hub.',
    images: [
      'https://cbu01.alicdn.com/img/ibank/O1CN01k0bbzI1pYszt0Hopz_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01wHLhS41pYszujcetf_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN014td8wp1pYszpsI0Hp_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01BYjEGr1pYszlMycia_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01ORukIq1pYszwFDAEo_!!2207321775373-0-cib.jpg'
    ],
    descriptionImages: [
      'https://cbu01.alicdn.com/img/ibank/O1CN01wHLhS41pYszujcetf_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN014td8wp1pYszpsI0Hp_!!2207321775373-0-cib.jpg'
    ],
    attributes: [
      { keyCn: '版型', keyEn: 'Fit Style', valueCn: '宽松直筒阔腿', valueEn: 'Loose Straight Wide-Leg' },
      { keyCn: '材质面料', keyEn: 'Fabric Material', valueCn: '重磅水洗牛仔棉', valueEn: 'Heavyweight Washed Denim Cotton' },
      { keyCn: '风格', keyEn: 'Design Style', valueCn: '高街复古潮流', valueEn: 'High Street Vintage Retro' },
      { keyCn: '供货方式', keyEn: 'Supply Mode', valueCn: '实力源头工厂直供', valueEn: 'Direct Source Factory' },
      { keyCn: '质检标准', keyEn: 'Quality Check', valueCn: '广州中转仓出厂全检', valueEn: 'Guangzhou Warehouse Pre-Shipment QC' }
    ],
    priceTiers: [
      { range: '2–9 pcs', minQty: 2, priceRmb: 20.0 },
      { range: '10–49 pcs', minQty: 10, priceRmb: 19.5 },
      { range: '50+ pcs', minQty: 50, priceRmb: 18.5 }
    ],
    basePriceRmb: 20.0,
    skus: [
      {
        id: 'sku-774-blue',
        name: 'Vintage Washed Retro Blue (复古蓝)',
        nameCn: '复古蓝',
        image: 'https://cbu01.alicdn.com/img/ibank/O1CN01k0bbzI1pYszt0Hopz_!!2207321775373-0-cib.jpg',
        priceRmb: 20.0,
        stock: 5000
      },
      {
        id: 'sku-774-black',
        name: 'High-Street Washed Black (水洗黑)',
        nameCn: '水洗黑',
        image: 'https://cbu01.alicdn.com/img/ibank/O1CN01wHLhS41pYszujcetf_!!2207321775373-0-cib.jpg',
        priceRmb: 20.0,
        stock: 5000
      }
    ],
    sizes: ['S (28)', 'M (30)', 'L (32)', 'XL (34)', '2XL (36)'],
    category: 'apparel',
    shopName: '揭阳产业园磐东优心品电子商务经营部',
    location: 'Guangdong, Jieyang Apparel Zone',
    estimatedWeightKg: 0.55,
    minOrderQty: 2,
    isSensitiveCargo: false,
    createdAt: new Date().toISOString()
  };

  // 2. Offer 1019859245819: Guangzhou Xintang Maixin Straight Loose Elastic Denim Jeans
  const prod1019 = {
    id: 'prod-1019859245819',
    sourcePlatform: '1688',
    sourceOfferId: '1019859245819',
    url: 'https://detail.1688.com/offer/1019859245819.html',
    titleCn: '广州新塘迈鑫牛仔裤男春夏秋直筒宽松弹力休闲长裤子男批发可贴唛',
    titleEn: "Guangzhou Xintang Loose Straight Elastic Men's Denim Jeans (Four Seasons Casual Wholesale)",
    titleBn: 'গুয়াংজু শিনথাং পুরুষদের লুজ স্ট্রেইট ইলাস্টিক ক্যাজুয়াল ডেনিম জিন্স',
    description: 'Guangzhou Xintang denim manufacturing hub direct factory wholesale. Four-season comfort stretch denim fabric, loose straight silhouette, customizable branding/tags available. Full pre-shipment QC at Guangzhou Hub.',
    images: [
      'https://cbu01.alicdn.com/img/ibank/O1CN01k0bbzI1pYszt0Hopz_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01wHLhS41pYszujcetf_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN014td8wp1pYszpsI0Hp_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01BYjEGr1pYszlMycia_!!2207321775373-0-cib.jpg'
    ],
    descriptionImages: [
      'https://cbu01.alicdn.com/img/ibank/O1CN01wHLhS41pYszujcetf_!!2207321775373-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN014td8wp1pYszpsI0Hp_!!2207321775373-0-cib.jpg'
    ],
    attributes: [
      { keyCn: '版型', keyEn: 'Fit Silhouette', valueCn: '直筒宽松微弹', valueEn: 'Straight Loose Stretch' },
      { keyCn: '材质面料', keyEn: 'Fabric Material', valueCn: '舒适透气牛仔棉', valueEn: 'Breathable Stretch Denim Cotton' },
      { keyCn: '产地', keyEn: 'Manufacturing Belt', valueCn: '广东广州增城新塘牛仔产业带', valueEn: 'Guangzhou Xintang Denim Hub, Guangdong' },
      { keyCn: '加工定制', keyEn: 'OEM / Customization', valueCn: '支持贴唛换标定制', valueEn: 'Custom Label / OEM Supported' },
      { keyCn: '质检标准', keyEn: 'Quality Check', valueCn: '广州中转仓出厂全检', valueEn: 'Guangzhou Warehouse Pre-Shipment QC' }
    ],
    priceTiers: [
      { range: '2–9 pcs', minQty: 2, priceRmb: 28.0 },
      { range: '10–49 pcs', minQty: 10, priceRmb: 26.5 },
      { range: '50+ pcs', minQty: 50, priceRmb: 24.0 }
    ],
    basePriceRmb: 28.0,
    skus: [
      {
        id: 'sku-1019-vintage-blue',
        name: 'Vintage Wash Blue (复古蓝)',
        nameCn: '复古蓝',
        image: 'https://cbu01.alicdn.com/img/ibank/O1CN01k0bbzI1pYszt0Hopz_!!2207321775373-0-cib.jpg',
        priceRmb: 28.0,
        stock: 8000
      },
      {
        id: 'sku-1019-high-black',
        name: 'High-Street Washed Black (水洗黑)',
        nameCn: '水洗黑',
        image: 'https://cbu01.alicdn.com/img/ibank/O1CN01wHLhS41pYszujcetf_!!2207321775373-0-cib.jpg',
        priceRmb: 28.0,
        stock: 6500
      },
      {
        id: 'sku-1019-light-blue',
        name: 'Light Summer Blue (浅蓝色)',
        nameCn: '浅蓝色',
        image: 'https://cbu01.alicdn.com/img/ibank/O1CN014td8wp1pYszpsI0Hp_!!2207321775373-0-cib.jpg',
        priceRmb: 28.0,
        stock: 5000
      }
    ],
    sizes: ['28 [45–50 kg]', '29 [50–55 kg]', '30 [55–60 kg]', '31 [60–65 kg]', '32 [65–70 kg]', '33 [70–75 kg]', '34 [75–80 kg]', '36 [80–88 kg]', '38 [88–95 kg]'],
    category: 'apparel',
    shopName: '广州市增城迈鑫服装厂 (Guangzhou Xintang Maixin Garment Factory)',
    location: 'Guangdong, Guangzhou Xintang',
    estimatedWeightKg: 0.58,
    minOrderQty: 2,
    isSensitiveCargo: false,
    createdAt: new Date().toISOString()
  };

  // Upsert into MongoDB
  await collection.updateOne({ id: prod774.id }, { $set: prod774 }, { upsert: true });
  console.log('Upserted prod-774556173956 in MongoDB Atlas');

  await collection.updateOne({ id: prod1019.id }, { $set: prod1019 }, { upsert: true });
  console.log('Upserted prod-1019859245819 in MongoDB Atlas');

  // Update local JSON files
  const jsonPaths = [
    path.join(__dirname, '..', 'data', 'products.json'),
    path.join(__dirname, '..', 'SOURCE', 'data', 'products.json')
  ];

  for (const jp of jsonPaths) {
    if (fs.existsSync(jp)) {
      const list = JSON.parse(fs.readFileSync(jp, 'utf8'));
      // remove old versions
      const filtered = list.filter(p => p.id !== prod774.id && p.id !== prod1019.id);
      filtered.unshift(prod1019);
      filtered.unshift(prod774);
      fs.writeFileSync(jp, JSON.stringify(filtered, null, 2), 'utf8');
      console.log('Updated JSON file:', jp);
    }
  }

  await client.close();
  console.log('Seeding completed successfully!');
}

seedJeans().catch(console.error);
