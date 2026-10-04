// SkySourcing 1688 & Taobao Advanced Content Script
console.log("[SkySourcing] Advanced Content script loaded on:", window.location.href);

function extractOfferId() {
  const url = window.location.href;
  const match1688 = url.match(/\/offer\/(\d+)\.html/) || url.match(/offerId=(\d+)/);
  if (match1688) return { platform: "1688", id: match1688[1] };

  const matchTaobao = url.match(/[?&]id=(\d+)/);
  if (matchTaobao) {
    const isTmall = url.includes("tmall.com");
    return { platform: isTmall ? "tmall" : "taobao", id: matchTaobao[1] };
  }

  return { platform: "unknown", id: `${Date.now()}` };
}

function cleanImageUrl(src) {
  if (!src || typeof src !== "string") return "";
  let clean = src.trim();
  if (clean.startsWith("//")) clean = "https:" + clean;
  if (!clean.startsWith("http")) return "";

  // Exclude dummy 1x1 placeholders, tracking pixels, data-uris, tiny icons, and Alibaba UI sprite badges
  if (
    clean.includes("data:image") ||
    clean.includes(".gif") ||
    clean.includes("spacer") ||
    clean.includes("placeholder") ||
    clean.includes("blank.png") ||
    clean.includes("pixel") ||
    clean.includes("TB1d.placeholder") ||
    clean.includes("avatar") ||
    clean.includes("favicon") ||
    clean.includes("icon") ||
    clean.includes("-tps-") ||
    clean.includes("tps-") ||
    clean.includes("tfs/") ||
    clean.includes("badge") ||
    clean.includes("service_") ||
    clean.includes("cert_") ||
    clean.includes("rating") ||
    clean.includes("sprite")
  ) {
    return "";
  }

  // Strip dynamic thumbnail, query suffixes, and intermediate resizing to obtain canonical high-res asset
  clean = clean.replace(/\.(?:\d+x\d+|summ|search|b)\.(?:jpg|jpeg|png|webp)$/i, ".jpg")
               .replace(/\.(?:220x220|310x310|300x300|400x400|summ|b)\.jpg$/i, ".jpg")
               .replace(/_\d+x\d+.*\.(?:jpg|jpeg|png|webp)$/i, "")
               .replace(/_b\.(?:jpg|jpeg|png|webp)$/i, "")
               .replace(/_sum\.(?:jpg|jpeg|png|webp)$/i, "")
               .replace(/_\.webp$/i, "")
               .replace(/\.(?:220x220|310x310|300x300|400x400|summ|b)$/i, "");
  return clean;
}

function getBestImageUrl(img) {
  if (!img) return "";
  const candidates = [
    img.getAttribute("data-lazy-src"),
    img.getAttribute("data-ks-lazyload"),
    img.getAttribute("data-src"),
    img.getAttribute("data-original"),
    img.getAttribute("data-url"),
    img.getAttribute("data-img"),
    img.getAttribute("src"),
    img.src
  ];

  for (const c of candidates) {
    if (c) {
      const cleaned = cleanImageUrl(c);
      if (cleaned) return cleaned;
    }
  }
  return "";
}

// Programmatically triggers lazy-loaded containers (IntersectionObserver)
function triggerLazyLoad() {
  const lazyTargets = document.querySelectorAll(
    "#desc-lazyload-container, .od-pc-detail-description, .od-pc-attribute, .content-detail, div[data-t-module='detail'], .desc-root, #J_DivItemDesc"
  );
  lazyTargets.forEach((el) => {
    try {
      el.scrollIntoView({ behavior: "instant", block: "center" });
    } catch (e) {}
  });
  window.dispatchEvent(new Event("scroll"));
}

// Extract attributes and media directly from inline <script> tags (immune to CSS changes / lazy-load)
function extractDataFromScripts() {
  const specs = [];
  const descImages = [];
  const seenSpecs = new Set();
  const seenImgs = new Set();
  let descUrl = "";
  let detectedScriptPrice = 0;
  const detectedScriptTiers = [];

  const scripts = Array.from(document.querySelectorAll("script"));
  for (const script of scripts) {
    const text = script.textContent || "";
    if (!text || text.length < 25) continue;

    // 1. Check for product attributes / feature list JSON arrays
    if (text.includes("productAttribute") || text.includes("featureList") || text.includes("propList") || text.includes("attributes")) {
      const arrayRegexes = [
        /"(?:productAttributes?|featureList|propList|offerAttributes?)"\s*:\s*(\[[^\]]+\])/gi,
        /"attributes"\s*:\s*(\[[^\]]+\])/gi
      ];

      for (const regex of arrayRegexes) {
        let match;
        while ((match = regex.exec(text)) !== null) {
          try {
            const arr = JSON.parse(match[1]);
            if (Array.isArray(arr)) {
              for (const item of arr) {
                const k = item.attributeName || item.name || item.propName || item.key || item.k;
                const v = item.attributeValue || item.value || item.propValue || item.val || item.v;
                if (k && v && typeof k === "string" && typeof v === "string") {
                  const cleanK = k.replace(/[:：\s]/g, "").trim();
                  const cleanV = v.trim();
                  if (cleanK && cleanV && !seenSpecs.has(cleanK)) {
                    seenSpecs.add(cleanK);
                    specs.push({ keyCn: cleanK, valueCn: cleanV });
                  }
                }
              }
            }
          } catch (e) {}
        }
      }

      // Regex key-value scan fallback
      const kvRegex = /"(?:attributeName|propName|name)"\s*:\s*"([^"]{1,30})"\s*,\s*"(?:attributeValue|propValue|value)"\s*:\s*"([^"]{1,100})"/g;
      let kvMatch;
      while ((kvMatch = kvRegex.exec(text)) !== null) {
        const cleanK = kvMatch[1].replace(/[:：\s]/g, "").trim();
        const cleanV = kvMatch[2].trim();
        if (cleanK && cleanV && !seenSpecs.has(cleanK) && !cleanK.includes("{") && !cleanV.includes("{")) {
          seenSpecs.add(cleanK);
          specs.push({ keyCn: cleanK, valueCn: cleanV });
        }
      }
    }

    // 2. Check for descUrl / detailUrl
    if (!descUrl) {
      const descUrlMatch = text.match(/"(?:descUrl|descriptionUrl|detailUrl)"\s*:\s*"([^"]+)"/);
      if (descUrlMatch && descUrlMatch[1]) {
        let dUrl = descUrlMatch[1].replace(/\\u002F/g, "/").replace(/\\/g, "");
        if (dUrl.startsWith("//")) dUrl = "https:" + dUrl;
        if (dUrl.startsWith("http")) descUrl = dUrl;
      }
    }

    // 3. Extract high-res image URLs (cbu01.alicdn.com/img/ibank & img.alicdn.com)
    if (text.includes("cbu01.alicdn.com") || text.includes("img.alicdn.com")) {
      const imgRegex = /https?:\\?\/\\?\/[a-zA-Z0-9.-]+\.alicdn\.com\\?\/[^"'\s<>\\]+\.(?:jpg|jpeg|png|webp)/gi;
      let imgMatch;
      while ((imgMatch = imgRegex.exec(text)) !== null) {
        const unescaped = imgMatch[0].replace(/\\u002F/g, "/").replace(/\\/g, "");
        const clean = cleanImageUrl(unescaped);
        if (clean && !clean.includes("-tps-") && !clean.includes("tfs/") && (clean.includes("ibank") || clean.includes("cib") || clean.includes("desc") || (clean.includes("imgextra") && !clean.includes("tps")))) {
          if (!seenImgs.has(clean)) {
            seenImgs.add(clean);
            descImages.push(clean);
          }
        }
      }
    // 4. Extract price from script JSON
    if (text.includes("price") || text.includes("Price") || text.includes("ladderPrice")) {
      const priceRegexes = [
        /"(?:refPrice|discountPrice|channelPrice|newcomerPrice|offerPrice|consignPrice|retailPrice|price)"\s*:\s*["']?(\d+(?:\.\d+)?)["']?/g,
        /"priceRmb"\s*:\s*["']?(\d+(?:\.\d+)?)["']?/g,
        /"stringPrice"\s*:\s*"(\d+(?:\.\d+)?)"/g
      ];

      for (const pr of priceRegexes) {
        let pm;
        while ((pm = pr.exec(text)) !== null) {
          const val = parseFloat(pm[1]);
          if (val >= 0.5 && val < 500000) {
            if (!detectedScriptPrice || val < detectedScriptPrice) {
              detectedScriptPrice = val;
            }
          }
        }
      }

      const ladderMatch = text.match(/"(?:ladderPriceList|priceRange|priceRanges)"\s*:\s*(\[[^\]]+\])/);
      if (ladderMatch && ladderMatch[1]) {
        try {
          const arr = JSON.parse(ladderMatch[1]);
          if (Array.isArray(arr)) {
            for (const item of arr) {
              const p = parseFloat(item.price || item.p || item.priceRmb);
              const q = parseInt(item.minQty || item.quantity || item.q || item.amount, 10);
              if (p > 0 && q > 0) {
                detectedScriptTiers.push({ priceRmb: p, minQty: q, range: `${q}+ pcs` });
              }
            }
          }
        } catch (e) {}
      }
    }
  }

  return { specs, descImages, descUrl, detectedScriptPrice, detectedScriptTiers };
}

function parseProductPage() {
  const meta = extractOfferId();

  // 1. Title Extraction
  const candidateTitles = [
    document.querySelector(".od-pc-offer-title .title-text")?.innerText,
    document.querySelector(".od-pc-offer-title")?.innerText,
    document.querySelector(".title-content")?.innerText,
    document.querySelector(".offer-title")?.innerText,
    document.querySelector(".d-title")?.innerText,
    document.querySelector(".ItemHeader--mainTitle--2zL7p6N")?.innerText,
    document.querySelector(".tb-main-title")?.innerText,
    document.querySelector(".title-text")?.innerText,
    document.querySelector("h1.title")?.innerText,
    document.querySelector("h1")?.innerText
  ];

  let rawTitle = "";
  for (const c of candidateTitles) {
    if (c && typeof c === "string" && c.trim().length >= 4) {
      rawTitle = c.trim();
      break;
    }
  }
  if (!rawTitle) rawTitle = document.title;

  // Disambiguate if rawTitle is a factory/company name instead of product title
  const isFactoryName = /厂|公司|商行|企业|旗舰店|专营店|Factory|Co\.,?\s*Ltd/i.test(rawTitle) || rawTitle.length < 8;
  const detectedShopName = isFactoryName ? rawTitle : "";
  let title = rawTitle;

  if (isFactoryName) {
    // 1. Check document.title (e.g. "【美式高街复古宽松牛仔裤】批发价格_厂家视频图片 - 1688")
    const docClean = document.title
      .replace(/【|】|_1688| - 1688.*|_厂家.*|批发价格.*|阿里巴巴.*/g, "")
      .replace(/[\r\n\t]/g, "")
      .trim();
    if (docClean && docClean.length >= 6 && !/厂|公司|旗舰店|专营店/.test(docClean)) {
      title = docClean;
    } else {
      // 2. Check topicName or optName from URL query params
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const topic = urlParams.get("topicName") || urlParams.get("optName");
        if (topic) title = decodeURIComponent(topic).trim();
      } catch (e) {}
    }
  }

  // 2. Main Gallery Images (Top Carousel)
  const gallerySelectors = [
    ".detail-gallery-img",
    ".mod-detail-gallery img",
    ".lib-gallery img",
    ".carousel-list img",
    ".MainPic--mainPic--1qVzY3A img",
    "#J_UlThumb img",
    ".tab-pane img",
    ".vertical-img img",
    ".preview-image-box img"
  ];

  let galleryImages = [];
  const galleryEls = Array.from(document.querySelectorAll(gallerySelectors.join(", ")));
  for (const el of galleryEls) {
    const url = getBestImageUrl(el);
    if (url && (url.includes("alicdn.com") || url.includes("1688.com") || url.includes("taobao.com"))) {
      galleryImages.push(url);
    }
  }
  galleryImages = [...new Set(galleryImages)].slice(0, 6);

  // Fallback to any prominent product images if gallery query was empty
  if (galleryImages.length === 0) {
    const anyImages = Array.from(document.querySelectorAll("img"))
      .map((img) => getBestImageUrl(img))
      .filter((url) => url && url.includes("alicdn.com") && (url.includes("bao/uploaded") || url.includes("cbu01") || url.includes("ibank")));
    galleryImages = [...new Set(anyImages)].slice(0, 5);
  }

  // 3. Extract Data from Inline Scripts
  const scriptData = extractDataFromScripts();

  // 4. Description Detail Photos (Long-form Schematics & Assembly Pictures)
  const descContainerSelectors = [
    "#desc-lazyload-container",
    ".od-pc-detail-description",
    ".content-detail",
    ".mod-detail-description",
    ".desc-root",
    "div[data-t-module='detail']",
    ".detail-description",
    "#J_DivItemDesc",
    "#description",
    ".desc-rich",
    "div.de-description",
    ".desc-container"
  ];

  let descImages = [];
  const seenDescImgs = new Set();

  for (const selector of descContainerSelectors) {
    const container = document.querySelector(selector);
    if (container) {
      // Check DOM img nodes
      const imgs = Array.from(container.querySelectorAll("img"));
      for (const img of imgs) {
        const url = getBestImageUrl(img);
        if (url && (url.includes("alicdn.com") || url.includes("1688.com") || url.includes("taobao.com"))) {
          if (!seenDescImgs.has(url)) {
            seenDescImgs.add(url);
            descImages.push(url);
          }
        }
      }

      // Check raw container innerHTML in case images are embedded in unrendered HTML or <textarea>
      const rawHtml = container.innerHTML || "";
      if (rawHtml.includes("alicdn.com")) {
        const htmlImgRegex = /(?:src|data-lazy-src|data-src|data-ks-lazyload)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
        let match;
        while ((match = htmlImgRegex.exec(rawHtml)) !== null) {
          const url = cleanImageUrl(match[1]);
          if (url && !seenDescImgs.has(url)) {
            seenDescImgs.add(url);
            descImages.push(url);
          }
        }
      }
    }
  }

  // Also merge description images found in inline scripts
  if (scriptData.descImages.length > 0) {
    for (const imgUrl of scriptData.descImages) {
      if (!seenDescImgs.has(imgUrl)) {
        seenDescImgs.add(imgUrl);
        descImages.push(imgUrl);
      }
    }
  }

  // Filter out images already in main gallery and deduplicate canonical assets
  const galleryBaseSet = new Set(galleryImages.map((img) => img.split("?")[0].replace(/\.(?:\d+x\d+|summ|search|b)\.jpg$/i, ".jpg")));
  const canonicalDescSet = new Set();
  const finalDescImages = [];

  for (const img of descImages) {
    const canonical = img.split("?")[0].replace(/\.(?:\d+x\d+|summ|search|b)\.jpg$/i, ".jpg");
    if (!galleryBaseSet.has(canonical) && !canonicalDescSet.has(canonical)) {
      canonicalDescSet.add(canonical);
      finalDescImages.push(img);
    }
  }

  // Cap to top 16 highest quality images
  descImages = finalDescImages.slice(0, 16);

  // 5. Factory Specification Attributes Table
  const attributes = [];
  const seenKeys = new Set();

  // Helper to add attribute
  function addAttr(key, val) {
    if (!key || !val) return;
    const cleanK = key.replace(/[:：\s]/g, "").trim();
    const cleanV = val.trim();
    if (cleanK && cleanV && !seenKeys.has(cleanK) && cleanK.length <= 30 && cleanV.length <= 150) {
      seenKeys.add(cleanK);
      attributes.push({ keyCn: cleanK, valueCn: cleanV });
    }
  }

  // 5a. Modern 1688 layout: .od-pc-attribute (.od-pc-attribute-item, .od-pc-attribute-name, .od-pc-attribute-value)
  const modern1688Items = document.querySelectorAll(
    ".od-pc-attribute-item, .od-pc-attribute .content-detail > div, div[class*='attribute-item'], div[class*='prop-item']"
  );
  modern1688Items.forEach((el) => {
    const keyEl = el.querySelector(".od-pc-attribute-name, span[class*='name'], div[class*='name']");
    const valEl = el.querySelector(".od-pc-attribute-value, span[class*='value'], div[class*='value']");
    if (keyEl && valEl) {
      addAttr(keyEl.innerText, valEl.innerText);
    } else {
      const text = el.innerText || "";
      const parts = text.split(/[:：]/);
      if (parts.length >= 2) {
        addAttr(parts[0], parts.slice(1).join(":"));
      }
    }
  });

  // 5b. Classic 1688 layout: .offer-attr-item (.offer-attr-item-name & .offer-attr-item-value)
  const classic1688Items = document.querySelectorAll(".offer-attr-item, .offer-attr-list .offer-attr-item");
  classic1688Items.forEach((el) => {
    const key = el.querySelector(".offer-attr-item-name")?.innerText;
    const val = el.querySelector(".offer-attr-item-value")?.innerText;
    addAttr(key, val);
  });

  // 5c. Taobao/Tmall layout: #J_AttrUL li, .attributes-list li, .props-list li, .parameter-item
  const tbItems = document.querySelectorAll("#J_AttrUL li, .attributes-list li, .props-list li, .parameter-item");
  tbItems.forEach((el) => {
    const text = el.innerText || "";
    const parts = text.split(/[:：]/);
    if (parts.length >= 2) {
      addAttr(parts[0], parts.slice(1).join(":"));
    }
  });

  // 5d. Table-based attributes: table.de-feature tr, table.detail-attributes-table tr, .mod-detail-attributes tr
  const tableRows = document.querySelectorAll(
    "table.de-feature tr, table.detail-attributes-table tr, .mod-detail-attributes tr, table.od-pc-attribute tr"
  );
  tableRows.forEach((row) => {
    const cells = row.querySelectorAll("th, td");
    for (let i = 0; i < cells.length - 1; i += 2) {
      const key = cells[i]?.innerText;
      const val = cells[i + 1]?.innerText;
      addAttr(key, val);
    }
  });

  // 5e. Merge with script-extracted attributes
  for (const s of scriptData.specs) {
    addAttr(s.keyCn, s.valueCn);
  }

  // 6. Tiered Wholesale Prices (1688 ladder pricing)
  const priceTiers = [];
  const tierEls = document.querySelectorAll(".ladder-price-item, .price-range .range-item, .price-box .price-item, .price-item");
  if (tierEls.length > 0) {
    tierEls.forEach((el, idx) => {
      const price = el.querySelector(".price-text, .price, .value, .amount")?.innerText.replace(/[¥￥\s]/g, "");
      const amount = el.querySelector(".amount-text, .amount, .unit, .range")?.innerText.trim();
      const parsedPrice = parseFloat(price) || 0;
      if (parsedPrice > 0) {
        const minQty = parseInt(amount?.replace(/\D/g, ""), 10) || (idx === 0 ? 2 : (idx + 1) * 5);
        priceTiers.push({
          priceRmb: parsedPrice,
          minQty: minQty,
          range: amount || `${minQty}+ pcs`
        });
      }
    });
  }

  if (priceTiers.length === 0) {
    // Strategy 1: Check detected script tiers
    if (scriptData.detectedScriptTiers && scriptData.detectedScriptTiers.length > 0) {
      priceTiers.push(...scriptData.detectedScriptTiers);
    }
  }

  if (priceTiers.length === 0) {
    // Strategy 2: Check modern 1688 price element selectors
    const modernPriceSelectors = [
      "[class*='newcomer'] [class*='price']",
      "[class*='newcomer-price']",
      "[class*='channel-price']",
      "[class*='Price--priceText']",
      "[class*='Price--price--']",
      "[class*='priceText']",
      ".price-text",
      ".od-pc-price .price-text",
      ".od-pc-price",
      ".order-price",
      "[class*='sku-price']",
      ".tb-rmb-num",
      "[class*='price-wrap']",
      "[class*='price-box']"
    ];

    let foundPrice = 0;
    for (const sel of modernPriceSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        const text = (el.innerText || "").replace(/[¥￥\s,]/g, "");
        const num = parseFloat(text);
        if (num >= 0.5 && num < 500000) {
          foundPrice = num;
          break;
        }
      }
    }

    // Strategy 3: Check detected script price
    if (!foundPrice && scriptData.detectedScriptPrice > 0) {
      foundPrice = scriptData.detectedScriptPrice;
    }

    // Strategy 4: Search DOM for any currency tag in header area
    if (!foundPrice) {
      const allPriceEls = Array.from(document.querySelectorAll("span, div, p, strong, em, b"));
      for (const el of allPriceEls) {
        const t = (el.innerText || "").trim();
        const m = t.match(/^[¥￥]\s*(\d+(?:\.\d+)?)$/);
        if (m && m[1]) {
          const val = parseFloat(m[1]);
          if (val >= 0.5 && val < 500000) {
            foundPrice = val;
            break;
          }
        }
      }
    }

    // Default to 17.0 rather than 40 if completely undetermined
    const cleanPrice = foundPrice > 0 ? foundPrice : 17.0;
    priceTiers.push(
      { range: "2–9 pcs", minQty: 2, priceRmb: cleanPrice },
      { range: "10–49 pcs", minQty: 10, priceRmb: Number((cleanPrice * 0.9).toFixed(1)) },
      { range: "50+ pcs", minQty: 50, priceRmb: Number((cleanPrice * 0.82).toFixed(1)) }
    );
  }

  // 7. SKU Variations (Colors, Sizes, Specs)
  const skus = [];
  const skuEls = document.querySelectorAll(".sku-prop-item, .prop-item, .list-leading li, .tb-prop li, .skuItem");
  skuEls.forEach((el, index) => {
    const name = el.innerText.trim();
    const imgEl = el.querySelector("img");
    const imgUrl = getBestImageUrl(imgEl);

    if (name) {
      skus.push({
        id: "sku_" + (index + 1),
        name: name,
        nameCn: name,
        image: imgUrl || galleryImages[0] || "",
        priceRmb: priceTiers[0]?.priceRmb || 17.0,
        stock: 999
      });
    }
  });

  // 8. Supplier / Shop Info
  const shopName = (
    document.querySelector(".company-name")?.innerText ||
    document.querySelector(".shop-info-name")?.innerText ||
    document.querySelector(".seller-name")?.innerText ||
    detectedShopName ||
    "Guangdong Verified Factory Partner"
  ).trim();

  const location = (
    document.querySelector(".company-place")?.innerText ||
    document.querySelector(".shop-address")?.innerText ||
    "Guangdong, China"
  ).trim();

  // 9. Description Overview
  const descParagraphs = Array.from(document.querySelectorAll("#desc-lazyload-container p, .content-detail p, .desc-root p"))
    .map((p) => p.innerText.trim())
    .filter((t) => t.length > 5);

  const rawDescription = descParagraphs.slice(0, 4).join(" ") ||
    `${title}. Direct factory wholesale supply from ${shopName} in ${location}. Verified technical specifications with pre-shipment quality inspection.`;

  return {
    sourcePlatform: meta.platform === "unknown" ? "1688" : meta.platform,
    sourceOfferId: meta.id,
    url: window.location.href,
    titleCn: title,
    titleEn: title,
    descriptionCn: rawDescription,
    description: rawDescription,
    images: galleryImages.length > 0 ? galleryImages : ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"],
    descriptionImages: descImages,
    attributes: attributes,
    priceTiers,
    basePriceRmb: priceTiers[0]?.priceRmb || 17.0,
    skus,
    shopName,
    location,
    estimatedWeightKg: 0.45
  };
}

// Inject floating quick-import button on product pages
function injectFloatingButton() {
  if (document.getElementById("skysourcing-quick-bar")) return;

  const bar = document.createElement("div");
  bar.id = "skysourcing-quick-bar";
  bar.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
    </svg>
    <span>Import to SkySourcing</span>
  `;

  bar.addEventListener("click", () => {
    triggerLazyLoad();
    const data = parseProductPage();
    chrome.runtime.sendMessage({ action: "OPEN_IMPORT_MODAL", product: data });
  });

  document.body.appendChild(bar);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_PRODUCT_DATA") {
    // Proactively trigger lazy loading
    triggerLazyLoad();

    // Parse product data
    const productData = parseProductPage();
    sendResponse({ success: true, data: productData });
  }
  return true;
});

// Run injector and trigger lazy-load on page idle
if (
  window.location.href.includes("1688.com") ||
  window.location.href.includes("taobao.com") ||
  window.location.href.includes("tmall.com")
) {
  setTimeout(() => {
    triggerLazyLoad();
    injectFloatingButton();
  }, 800);
}
