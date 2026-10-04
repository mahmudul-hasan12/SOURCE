// Client-safe Seed Data for SkySourcing BD
import { Product, Order } from "@/types";

export const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-whl-001",
    sourcePlatform: "1688",
    sourceOfferId: "782910481920",
    url: "https://detail.1688.com/offer/782910481920.html",
    titleCn: "2026新款真无线蓝牙耳机ANC主动降噪长续航私模外贸爆款",
    titleEn: "2026 ANC Active Noise Cancelling TWS Bluetooth Wireless Earbuds",
    titleBn: "২০২৬ এএনসি অ্যাক্টিভ নয়েজ ক্যানসেলিং টিডব্লিউএস ব্লুটুথ ওয়্যারলেস ইয়ারবাড",
    description: "Factory direct supply from Shenzhen Huaqiangbei. Bluetooth 5.4, 45dB hybrid ANC, 40 hours battery life with charging case, IPX5 waterproof rating.",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionImages: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    attributes: [
      { keyCn: "蓝牙芯片", keyEn: "Bluetooth Chipset", valueCn: "杰理 7003D4 双核低功耗", valueEn: "Jerry 7003D4 Dual-Core Low Power" },
      { keyCn: "降噪深度", keyEn: "Noise Reduction Depth", valueCn: "45dB 混合双馈主动降噪", valueEn: "45dB Hybrid Dual-Feed Active Noise Cancellation" },
      { keyCn: "发声单元", keyEn: "Driver Unit", valueCn: "13mm 钛金振膜动圈单元", valueEn: "13mm Titanium Diaphragm Dynamic Driver" },
      { keyCn: "防水等级", keyEn: "Waterproof Rating", valueCn: "IPX5 级防水抗汗", valueEn: "IPX5 Sweat & Splash Resistance" },
      { keyCn: "电池容量", keyEn: "Battery Capacity", valueCn: "耳机 40mAh / 充电盒 400mAh", valueEn: "Earbud 40mAh / Charging Case 400mAh" },
      { keyCn: "综合续航", keyEn: "Total Battery Life", valueCn: "单次 8小时 / 配合充电盒 42小时", valueEn: "8 Hours Single / 42 Hours with Case" },
      { keyCn: "产地", keyEn: "Manufacturing Origin", valueCn: "广东深圳华强北高新园区", valueEn: "Shenzhen High-Tech Industrial Zone, Guangdong" }
    ],
    priceTiers: [
      { range: "2–9 pcs", minQty: 2, priceRmb: 38.0 },
      { range: "10–49 pcs", minQty: 10, priceRmb: 33.5 },
      { range: "50+ pcs", minQty: 50, priceRmb: 29.0 }
    ],
    basePriceRmb: 38.0,
    skus: [
      { id: "sku-earbud-blk", name: "Matte Black (黑色)", nameCn: "黑色", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200", priceRmb: 38.0, stock: 2400 },
      { id: "sku-earbud-wht", name: "Ceramic White (白色)", nameCn: "白色", image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=200", priceRmb: 38.0, stock: 1850 },
      { id: "sku-earbud-blu", name: "Midnight Blue (深蓝)", nameCn: "深蓝色", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200", priceRmb: 38.0, stock: 920 }
    ],
    category: "electronics",
    shopName: "Shenzhen Yirun Acoustic Technology Co., Ltd. (深圳翼润声学)",
    location: "Guangdong, Shenzhen (Huaqiangbei)",
    estimatedWeightKg: 0.18,
    minOrderQty: 2,
    isSensitiveCargo: true
  },
  {
    id: "prod-whl-002",
    sourcePlatform: "1688",
    sourceOfferId: "651982736192",
    url: "https://detail.1688.com/offer/651982736192.html",
    titleCn: "跨境大容量防泼水商务男士双肩包USB充电电脑背包旅行书包",
    titleEn: "Large Capacity Waterproof Business Laptop Backpack with USB Charging Port",
    titleBn: "ল্যাপটপ ও বিজনেস ট্রাভেল ওয়াটারপ্রুফ ব্যাকপ্যাক (ইউএসবি চার্জিং পোর্ট সহ)",
    description: "Guangzhou Shiling wholesale leather & luggage base. Fits up to 17.3 inch laptops, anti-theft zipper, breathable ergonomic honeycomb back panel.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { range: "3–9 pcs", minQty: 3, priceRmb: 48.0 },
      { range: "10–99 pcs", minQty: 10, priceRmb: 42.0 },
      { range: "100+ pcs", minQty: 100, priceRmb: 36.5 }
    ],
    basePriceRmb: 48.0,
    skus: [
      { id: "sku-bag-blk", name: "Executive Black (沉稳黑)", nameCn: "沉稳黑", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200", priceRmb: 48.0, stock: 5000 },
      { id: "sku-bag-gry", name: "Oxford Grey (商务灰)", nameCn: "商务灰", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=200", priceRmb: 48.0, stock: 3200 }
    ],
    category: "bags",
    shopName: "Guangzhou Senmai Luggage & Leather Goods Co., Ltd.",
    location: "Guangdong, Guangzhou (Huadu Shiling)",
    estimatedWeightKg: 0.85,
    minOrderQty: 3,
    isSensitiveCargo: false
  },
  {
    id: "prod-whl-003",
    sourcePlatform: "1688",
    sourceOfferId: "738192049182",
    url: "https://detail.1688.com/offer/738192049182.html",
    titleCn: "夏季透气飞织运动鞋男鞋轻便减震休闲慢跑鞋跨境货源",
    titleEn: "Men's Ultra-Light Breathable Cushion Running Sneakers",
    titleBn: "পুরুষদের আল্ট্রা-লাইট রানিং স্নিকার্স জুতো",
    description: "Jinjiang footwear industrial zone. Flying-knit breathable upper, soft rebound EVA outsole, wear-resistant grip.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { range: "2–19 pairs", minQty: 2, priceRmb: 35.0 },
      { range: "20–99 pairs", minQty: 20, priceRmb: 29.5 },
      { range: "100+ pairs", minQty: 100, priceRmb: 25.0 }
    ],
    basePriceRmb: 35.0,
    skus: [
      { id: "sku-shoe-red-41", name: "Crimson Red / Size 41 (红色 41码)", nameCn: "红色 41码", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", priceRmb: 35.0, stock: 800 },
      { id: "sku-shoe-red-42", name: "Crimson Red / Size 42 (红色 42码)", nameCn: "红色 42码", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", priceRmb: 35.0, stock: 1200 },
      { id: "sku-shoe-blk-42", name: "Shadow Black / Size 42 (黑色 42码)", nameCn: "黑色 42码", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200", priceRmb: 35.0, stock: 1500 }
    ],
    category: "shoes",
    shopName: "Fujian Jinjiang Baolong Footwear Manufacturing Factory",
    location: "Fujian, Jinjiang",
    estimatedWeightKg: 0.65,
    minOrderQty: 2,
    isSensitiveCargo: false
  },
  {
    id: "prod-whl-004",
    sourcePlatform: "1688",
    sourceOfferId: "691048291049",
    url: "https://detail.1688.com/offer/691048291049.html",
    titleCn: "智能手表多功能蓝牙通话心率血压监测大屏运动手环工厂批发",
    titleEn: "Smart Watch with Bluetooth Calling, Heart Rate & Blood Oxygen Monitor",
    titleBn: "স্মার্ট ওয়াচ ব্লুটুথ কলিং এবং হেলথ ট্র্যাকার সহ",
    description: "2.01-inch HD bezel-less curved screen, 100+ sports modes, wireless magnetic charging, multi-language support (English, Bangla, Arabic, Chinese).",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
    ],
    priceTiers: [
      { range: "2–9 pcs", minQty: 2, priceRmb: 55.0 },
      { range: "10–49 pcs", minQty: 10, priceRmb: 48.0 },
      { range: "50+ pcs", minQty: 50, priceRmb: 42.0 }
    ],
    basePriceRmb: 55.0,
    skus: [
      { id: "sku-watch-blk", name: "Titanium Black (钛黑硅胶带)", nameCn: "钛黑色", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200", priceRmb: 55.0, stock: 3500 },
      { id: "sku-watch-slv", name: "Silver Milanese (银色钢带)", nameCn: "银色钢带", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200", priceRmb: 58.0, stock: 2100 }
    ],
    category: "electronics",
    shopName: "Shenzhen Topwell Intelligent Wearable Device Co., Ltd.",
    location: "Guangdong, Shenzhen",
    estimatedWeightKg: 0.22,
    minOrderQty: 2,
    isSensitiveCargo: true
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: "ord-8910",
    orderNumber: "SKB-2026-8910",
    createdAt: "2026-10-02T10:30:00Z",
    status: "QC_VERIFIED",
    shippingMethod: "AIR",
    cargoType: "GENERAL",
    customer: {
      name: "Tanvir Ahmed",
      phone: "+880 1712-345678",
      district: "Dhaka",
      thana: "Mirpur 10",
      fullAddress: "House 24, Road 5, Block B, Mirpur-10, Dhaka",
      notes: "Please pack with extra bubble wrap"
    },
    items: [
      {
        id: "item-1",
        productId: "prod-whl-002",
        productTitle: "Large Capacity Waterproof Business Laptop Backpack with USB Port",
        productImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        sourcePlatform: "1688",
        sourceOfferId: "651982736192",
        skuId: "sku-bag-blk",
        skuName: "Executive Black (沉稳黑)",
        skuNameCn: "沉稳黑",
        unitPriceRmb: 42.0,
        unitPriceBdt: 825,
        quantity: 5,
        chinaOrderNumber: "FAC-ORD-92817482910",
        chinaDomesticCourier: "顺丰速运 (SF Express)",
        chinaTrackingNumber: "SF14829104819"
      }
    ],
    pricing: {
      exchangeRateUsed: 17.50,
      productTotalRmb: 210.0,
      productTotalBdt: 4125,
      advancePercentage: 50,
      advanceAmountBdt: 2063,
      stage2ProductBalanceBdt: 2062,
      estimatedWeightKg: 4.25,
      actualWeightKg: 4.10,
      intlShippingRatePerKg: 750,
      intlShippingCostBdt: 3075,
      localCourierFeeBdt: 70,
      totalOrderBdt: 7270,
      stage2TotalPayableBdt: 5207
    },
    tracking: {
      chinaDomesticCourier: "顺丰速运 (SF Express)",
      chinaTrackingNumber: "SF14829104819",
      chinaReceivedAt: "2026-10-03T14:20:00Z",
      qcPhotos: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
      ],
      qcNotes: "Quality inspection passed. All 5 pcs black backpacks verified in original factory polybags. No tears or zipper defects.",
      weightGrossKg: 4.10,
      dimensionsCm: { length: 48, width: 36, height: 28 },
      batchId: "AIR-CAN-DAC-0842",
      airFlightOrVesselNumber: "CZ-392 (Guangzhou -> Dhaka)",
      shippedFromChinaAt: "2026-10-04T08:00:00Z"
    }
  },
  {
    id: "ord-8911",
    orderNumber: "SKB-2026-8911",
    createdAt: "2026-10-04T12:00:00Z",
    status: "STAGE1_PAID",
    shippingMethod: "AIR",
    cargoType: "SENSITIVE",
    customer: {
      name: "Rahim Chowdhury",
      phone: "+880 1819-876543",
      district: "Chittagong",
      thana: "Panchlaish",
      fullAddress: "Flat 4A, Green Garden Heights, Nasirabad, Chittagong"
    },
    items: [
      {
        id: "item-2",
        productId: "prod-whl-001",
        productTitle: "2026 ANC Active Noise Cancelling TWS Bluetooth Wireless Earbuds",
        productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
        sourcePlatform: "1688",
        sourceOfferId: "782910481920",
        skuId: "sku-earbud-blk",
        skuName: "Matte Black (黑色)",
        skuNameCn: "黑色",
        unitPriceRmb: 33.5,
        unitPriceBdt: 658,
        quantity: 10
      }
    ],
    pricing: {
      exchangeRateUsed: 17.50,
      productTotalRmb: 335.0,
      productTotalBdt: 6580,
      advancePercentage: 50,
      advanceAmountBdt: 3290,
      stage2ProductBalanceBdt: 3290,
      estimatedWeightKg: 1.8,
      intlShippingRatePerKg: 950,
      intlShippingCostBdt: 1710,
      localCourierFeeBdt: 130,
      totalOrderBdt: 8420,
      stage2TotalPayableBdt: 5130
    },
    tracking: {
      qcPhotos: []
    }
  }
];

export function getClientProducts(): Product[] {
  return SEED_PRODUCTS;
}

export function getClientProductById(id: string): Product | null {
  return SEED_PRODUCTS.find((p) => p.id === id || p.sourceOfferId === id) || null;
}

export function getClientOrders(): Order[] {
  return SEED_ORDERS;
}

export function getClientOrderById(id: string): Order | null {
  return SEED_ORDERS.find((o) => o.id === id || o.orderNumber === id) || null;
}
