// SkySourcing Chrome Extension Popup Logic with Auto-Translation & Rich Media
let currentProduct = null;
let translatedAttributes = [];

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const is1688 = tab?.url?.includes("1688.com");
  const isTaobao = tab?.url?.includes("taobao.com") || tab?.url?.includes("tmall.com");

  const badgeEl = document.getElementById("platform-badge");
  const noProductEl = document.getElementById("no-product");
  const productCardEl = document.getElementById("product-card");
  const formEl = document.getElementById("import-form");

  if (!is1688 && !isTaobao) {
    badgeEl.innerText = "Inactive";
    noProductEl.style.display = "block";
    return;
  }

  badgeEl.innerText = is1688 ? "1688 Factory Detected" : "Taobao Active";
  badgeEl.style.color = "#f59e0b";

  // Load saved settings
  chrome.storage.local.get(["exchangeRate", "profitMargin", "apiUrl"], (result) => {
    if (result.exchangeRate) document.getElementById("cfg-exchange").value = result.exchangeRate;
    if (result.profitMargin) document.getElementById("cfg-margin").value = result.profitMargin;
    if (result.apiUrl) document.getElementById("cfg-api-url").value = result.apiUrl;
    recalculatePrices();
  });

  // Request parsed product data from active tab
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: "GET_PRODUCT_DATA" });
    if (response && response.success && response.data) {
      currentProduct = response.data;
      displayProduct(currentProduct);
      productCardEl.style.display = "block";
      formEl.style.display = "block";

      // Trigger automatic Chinese-to-English translation in background
      translateProductContent(currentProduct);
    } else {
      noProductEl.style.display = "block";
      noProductEl.innerHTML = `<p style="color:#f59e0b; text-align:center;">Could not parse product data. Please ensure the page is fully loaded and refresh.</p>`;
    }
  } catch (err) {
    console.error("Content script connection error:", err);
    noProductEl.style.display = "block";
    noProductEl.innerHTML = `<p style="color:#94a3b8; text-align:center;">Please refresh the 1688/Taobao page to initialize the importer.</p>`;
  }

  document.getElementById("cfg-price-rmb").addEventListener("input", recalculatePrices);
  document.getElementById("cfg-exchange").addEventListener("input", recalculatePrices);
  document.getElementById("cfg-margin").addEventListener("input", recalculatePrices);
  document.getElementById("btn-import").addEventListener("click", handleImport);

  // Safely open external links in browser tabs
  document.querySelectorAll("a[href^='http']").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: link.href });
    });
  });
});

function displayProduct(product) {
  document.getElementById("p-img").src = product.images[0] || "";
  document.getElementById("p-title-cn").innerText = product.titleCn || "Unknown Title";
  document.getElementById("p-title-en").innerText = "Translating title to English...";
  document.getElementById("cfg-title-en").value = product.titleEn || "";
  
  const baseRmb = product.basePriceRmb || 17.0;
  document.getElementById("cfg-price-rmb").value = baseRmb.toFixed(2);
  document.getElementById("p-rmb").innerText = `¥${baseRmb.toFixed(2)}`;

  // Display badges
  const galleryCount = (product.images || []).length;
  const descCount = (product.descriptionImages || []).length;
  const specsCount = (product.attributes || []).length;

  document.getElementById("badge-gallery").innerText = `📸 ${galleryCount} Gallery Photos`;
  document.getElementById("badge-desc").innerText = `📐 ${descCount} Detail Photos`;
  document.getElementById("badge-specs").innerText = `⚙️ ${specsCount} Specs`;

  // Specs preview
  const specsBox = document.getElementById("specs-box");
  if (specsCount > 0) {
    specsBox.style.display = "block";
    specsBox.innerHTML = product.attributes
      .slice(0, 5)
      .map(
        (a) => `
        <div class="spec-item">
          <span class="spec-k">${a.keyCn}</span>
          <span class="spec-v">${a.valueCn}</span>
        </div>`
      )
      .join("");
  } else {
    specsBox.style.display = "none";
  }

  recalculatePrices();
}

function recalculatePrices() {
  if (!currentProduct) return;
  const exchangeRate = parseFloat(document.getElementById("cfg-exchange").value) || 17.5;
  const marginPercent = parseFloat(document.getElementById("cfg-margin").value) || 12;
  const customRmb = parseFloat(document.getElementById("cfg-price-rmb")?.value);
  const baseRmb = !isNaN(customRmb) && customRmb > 0 ? customRmb : (currentProduct.basePriceRmb || 17.0);

  currentProduct.basePriceRmb = baseRmb;
  document.getElementById("p-rmb").innerText = `¥${baseRmb.toFixed(2)}`;

  const baseBdt = baseRmb * exchangeRate;
  const finalBdt = Math.round(baseBdt * (1 + marginPercent / 100));

  document.getElementById("p-bdt").innerText = `৳${finalBdt} BDT`;
}

async function translateProductContent(product) {
  const apiUrl = document.getElementById("cfg-api-url").value.trim();
  const baseUrl = apiUrl.replace(/\/api\/extension\/import\/?$/, "");
  const translateEndpoint = `${baseUrl}/api/translate`;

  try {
    const res = await fetch(translateEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: {
          titleCn: product.titleCn,
          attributes: (product.attributes || []).slice(0, 15)
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.titleEn) {
        document.getElementById("p-title-en").innerText = data.titleEn;
        document.getElementById("cfg-title-en").value = data.titleEn;
        currentProduct.titleEn = data.titleEn;
      }
      if (data.attributes && data.attributes.length > 0) {
        translatedAttributes = data.attributes;
        const specsBox = document.getElementById("specs-box");
        specsBox.style.display = "block";
        specsBox.innerHTML = data.attributes
          .slice(0, 6)
          .map(
            (a) => `
            <div class="spec-item">
              <span class="spec-k">${a.keyEn || a.keyCn}</span>
              <span class="spec-v">${a.valueEn || a.valueCn}</span>
            </div>`
          )
          .join("");
      }
    }
  } catch (err) {
    console.warn("Could not pre-translate in popup:", err);
    // Backend import will translate upon receipt
    document.getElementById("p-title-en").innerText = product.titleCn;
    document.getElementById("cfg-title-en").value = product.titleCn;
  }
}

async function handleImport() {
  if (!currentProduct) return;

  const btn = document.getElementById("btn-import");
  const statusBox = document.getElementById("status-box");

  const exchangeRate = parseFloat(document.getElementById("cfg-exchange").value) || 17.5;
  const marginPercent = parseFloat(document.getElementById("cfg-margin").value) || 12;
  const category = document.getElementById("cfg-category").value;
  const weight = parseFloat(document.getElementById("cfg-weight").value) || 0.45;
  const apiUrl = document.getElementById("cfg-api-url").value.trim();
  const customTitleEn = document.getElementById("cfg-title-en").value.trim();

  // Save settings
  chrome.storage.local.set({ exchangeRate, profitMargin: marginPercent, apiUrl });

  btn.disabled = true;
  btn.innerHTML = `<span>⏳ Translating & Importing...</span>`;
  statusBox.className = "status-msg status-loading";
  statusBox.innerHTML = "Processing high-res description photos & translating technical specs...";
  statusBox.style.display = "block";

  const customRmb = parseFloat(document.getElementById("cfg-price-rmb")?.value);
  const baseRmb = !isNaN(customRmb) && customRmb > 0 ? customRmb : (currentProduct.basePriceRmb || 17.0);

  const calculatedTiers = [
    { range: "2–9 pcs", minQty: 2, priceRmb: baseRmb },
    { range: "10–49 pcs", minQty: 10, priceRmb: Number((baseRmb * 0.9).toFixed(1)) },
    { range: "50+ pcs", minQty: 50, priceRmb: Number((baseRmb * 0.82).toFixed(1)) }
  ];

  const payload = {
    ...currentProduct,
    basePriceRmb: baseRmb,
    priceTiers: calculatedTiers,
    titleEn: customTitleEn || currentProduct.titleEn || currentProduct.titleCn,
    attributes: translatedAttributes.length > 0 ? translatedAttributes : currentProduct.attributes,
    exchangeRateUsed: exchangeRate,
    marginPercentUsed: marginPercent,
    category,
    estimatedWeightKg: weight,
    importedAt: new Date().toISOString()
  };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && data.success) {
      const descCount = data.product?.descriptionImages?.length || (currentProduct.descriptionImages || []).length || 0;
      const specsCount = data.product?.attributes?.length || (currentProduct.attributes || []).length || 0;

      // Ensure targetUrl is strictly an absolute HTTP URL
      let targetUrl = data.productUrl;
      if (!targetUrl || !targetUrl.startsWith("http")) {
        const baseStoreUrl = apiUrl.replace(/\/api\/extension\/import\/?$/, "");
        const prodId = data.productId || data.product?.id || `prod-${currentProduct.sourceOfferId}`;
        targetUrl = `${baseStoreUrl}/product/${prodId}`;
      }

      statusBox.className = "status-msg status-success";
      statusBox.innerHTML = `
        <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px;">✅ Imported with Full Photos & Specs!</div>
        <div style="font-size: 11px; color: #a7f3d0; margin-bottom: 8px;">
          ${descCount} detail photos & ${specsCount} specs saved
        </div>
        <button id="btn-view-store" type="button" style="background: #10b981; color: #070c18; border: none; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          <span>View in Store</span>
          <span>↗</span>
        </button>
      `;
      statusBox.style.display = "block";

      const viewBtn = document.getElementById("btn-view-store");
      if (viewBtn) {
        viewBtn.addEventListener("click", () => {
          chrome.tabs.create({ url: targetUrl });
        });
      }
    } else {
      throw new Error(data.message || "Failed to import");
    }
  } catch (err) {
    console.error("Import error:", err);
    statusBox.className = "status-msg status-error";
    statusBox.innerHTML = `❌ Error: ${err.message}. Make sure your store server is running at ${apiUrl}`;
    statusBox.style.display = "block";
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>⚡ Import with Description Photos & Specs</span>`;
  }
}
