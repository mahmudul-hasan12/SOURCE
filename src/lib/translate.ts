// Chinese-to-English Manufacturing & Cross-Border Wholesale Translation Service
import https from "https";
import { ProductAttribute } from "@/types";

// In-memory LRU cache to prevent redundant external translation requests
const translationCache = new Map<string, string>();

// Industrial & Wholesale Trade Lexicon Dictionary (Fast offline fallback & direct key mapping)
const TRADE_DICTIONARY: Record<string, string> = {
  // Common Specification Keys
  "材质": "Material",
  "产地": "Manufacturing Origin",
  "品牌": "Brand",
  "型号": "Model Number",
  "规格": "Specifications / Dimensions",
  "颜色": "Color",
  "重量": "Unit Weight",
  "包装": "Packaging",
  "包装方式": "Packaging Method",
  "加工定制": "OEM / Customization",
  "适用场景": "Application / Usage",
  "适用机床": "Applicable Machinery",
  "功能": "Function / Features",
  "产品类别": "Product Category",
  "货号": "Item / Catalog Number",
  "发货地": "Dispatch Location",
  "起订量": "Minimum Order Quantity (MOQ)",
  "表面处理": "Surface Finishing",
  "硬度": "Hardness Rating",
  "精度": "Repeatability Precision",
  "尺寸": "Physical Dimensions",
  "功率": "Rated Power",
  "电压": "Operating Voltage",
  "容量": "Capacity",
  "电池容量": "Battery Capacity",
  "接口": "Interface / Port",
  "蓝牙版本": "Bluetooth Version",
  "防水等级": "Waterproof Rating",
  "传输距离": "Transmission Range",
  "适用对象": "Target Application",
  "是否跨境出口专供货源": "Cross-Border Export Dedicated",
  "质保期": "Warranty Period",
  "证书编号": "Certification Number",
  "执行标准": "Executive Standard",
  "装箱数": "Master Carton Quantity",

  // Common Parameter Values
  "是": "Yes",
  "否": "No",
  "有": "Included",
  "无": "None",
  "优质": "Premium Grade",
  "铸铁": "Cast Iron",
  "球墨铸铁": "High-Grade Ductile Iron",
  "铝合金": "Aluminum Alloy",
  "不锈钢": "Stainless Steel",
  "碳钢": "High Carbon Steel",
  "黄铜": "Solid Brass",
  "塑料": "Industrial Polymer",
  "硅胶": "Food-Grade Silicone",
  "黑色": "Matte Black",
  "白色": "Ceramic White",
  "灰色": "Industrial Grey",
  "蓝色": "Deep Blue",
  "红色": "Vibrant Red",
  "银色": "Anodized Silver",
  "透明": "Transparent",
  "广东": "Guangdong Province",
  "深圳": "Shenzhen",
  "东莞": "Dongguan",
  "佛山": "Foshan",
  "广州": "Guangzhou",
  "浙江": "Zhejiang Province",
  "义乌": "Yiwu",
  "宁波": "Ningbo",
  "标准": "Standard Specification",
  "现货": "In Stock / Ready to Ship",
  "通用": "Universal Compatibility",
  "纸箱包装": "Reinforced Export Carton",
  "木箱包装": "Reinforced Wooden Crate",
  "袋装": "Polybag Packaging"
};

/**
 * Checks if a string contains Chinese characters
 */
export function hasChineseCharacters(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

/**
 * Translates a single text from Chinese to English.
 * Uses cache -> dictionary exact match -> Google Translate API -> dictionary phrase fallback.
 */
export async function translateText(text: string, from = "zh-CN", to = "en"): Promise<string> {
  if (!text || typeof text !== "string") return "";
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (!hasChineseCharacters(trimmed)) return trimmed;

  // 1. In-memory Cache check
  if (translationCache.has(trimmed)) {
    return translationCache.get(trimmed)!;
  }

  // 2. Exact Dictionary match
  if (TRADE_DICTIONARY[trimmed]) {
    const directTranslation = TRADE_DICTIONARY[trimmed];
    translationCache.set(trimmed, directTranslation);
    return directTranslation;
  }

  // 3. Online Google Translate HTTP service with timeout
  try {
    const translated = await fetchGoogleTranslate(trimmed, from, to);
    if (translated && translated.trim().length > 0) {
      translationCache.set(trimmed, translated);
      return translated;
    }
  } catch (error) {
    console.warn(`[Translate] Online translation failed for "${trimmed.slice(0, 30)}...", using fallback:`, error);
  }

  // 4. Offline Dictionary fallback (tokenized replacement)
  let fallback = trimmed;
  for (const [zh, en] of Object.entries(TRADE_DICTIONARY)) {
    if (fallback.includes(zh)) {
      fallback = fallback.split(zh).join(en + " ");
    }
  }
  const cleanFallback = fallback.replace(/\s+/g, " ").trim();
  translationCache.set(trimmed, cleanFallback);
  return cleanFallback;
}

/**
 * Calls the Google Translate free endpoint
 */
function fetchGoogleTranslate(text: string, from: string, to: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodedText}`;

    const req = https.get(url, { timeout: 4000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && Array.isArray(parsed[0])) {
            const result = parsed[0]
              .map((item: any) => (Array.isArray(item) ? item[0] : ""))
              .filter(Boolean)
              .join("")
              .trim();
            resolve(result || text);
          } else {
            resolve(text);
          }
        } catch (e) {
          resolve(text);
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Translation request timed out"));
    });
  });
}

/**
 * Translates an array of texts in parallel with batching
 */
export async function translateBatch(texts: string[]): Promise<string[]> {
  if (!Array.isArray(texts) || texts.length === 0) return [];
  const results = await Promise.all(texts.map((t) => translateText(t)));
  return results;
}

/**
 * Translates Chinese specification attributes into standardized ProductAttribute objects
 */
export async function translateProductAttributes(
  rawAttrs: Array<{ key?: string; keyCn?: string; value?: string; valueCn?: string }>
): Promise<ProductAttribute[]> {
  if (!Array.isArray(rawAttrs) || rawAttrs.length === 0) return [];

  const sanitized = rawAttrs
    .map((attr) => ({
      keyCn: (attr.keyCn || attr.key || "").trim(),
      valueCn: (attr.valueCn || attr.value || "").trim()
    }))
    .filter((a) => a.keyCn && a.valueCn);

  const results: ProductAttribute[] = [];
  for (const item of sanitized) {
    const [keyEn, valueEn] = await Promise.all([
      translateText(item.keyCn),
      translateText(item.valueCn)
    ]);

    results.push({
      keyCn: item.keyCn,
      keyEn: keyEn || item.keyCn,
      valueCn: item.valueCn,
      valueEn: valueEn || item.valueCn
    });
  }

  return results;
}
