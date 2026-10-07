// SkySourcing Pricing & Logistics Calculation Engine
import { GlobalSettings, PriceTier } from "@/types";

export const DEFAULT_SETTINGS: GlobalSettings = {
  exchangeRateRmbToBdt: 18.50, // 1 CNY = 18.50 BDT
  defaultProfitMarginPercent: 12, // 12% agent service commission
  advancePaymentPercent: 100, // 100% full product payment up front
  airRatePerKgGeneral: 750, // 750 BDT / kg for general goods by air (10-18 days)
  airRatePerKgSensitive: 950, // 950 BDT / kg for battery/liquid/magnet by air
  seaRatePerKg: 220, // 220 BDT / kg by sea (30-45 days)
  seaRatePerCbm: 25000, // 25,000 BDT / CBM by sea
  localCourierDhaka: 70, // 70 BDT inside Dhaka
  localCourierOutsideDhaka: 130, // 130 BDT outside Dhaka
  chinaWarehouseAddressCn: "广东省广州市白云区石门街道石沙路 SkySourcing China Hub (仓储部)",
  chinaWarehouseContact: "+86 138-0000-8888 (WeChat / Phone)",
  bkashNumber: "01755-123456",
  bkashAccountType: "MERCHANT",
  nagadNumber: "01855-123456",
  nagadAccountType: "PERSONAL",
  whatsappNumber: "+8801755123456",
  announcementNotice: "আন্তর্জাতিক সরাসরি পাইকারি সোর্সিং | ১০০% পণ্যের নিরাপদ পেমেন্ট | ডেলিভারি চার্জ শুধু প্রতি কেজিতে | ভেরিফায়েড QC",
};

/**
 * Calculates BDT unit price for a given quantity based on 1688 tiered wholesale pricing
 */
export function calculateTierPriceBdt(
  priceTiers: PriceTier[],
  quantity: number,
  exchangeRate: number = DEFAULT_SETTINGS.exchangeRateRmbToBdt,
  marginPercent: number = DEFAULT_SETTINGS.defaultProfitMarginPercent
): { unitPriceRmb: number; unitPriceBdt: number; totalPriceBdt: number } {
  if (!priceTiers || priceTiers.length === 0) {
    return { unitPriceRmb: 0, unitPriceBdt: 0, totalPriceBdt: 0 };
  }

  // Find matching tier based on quantity
  let selectedTier = priceTiers[0];
  for (let i = priceTiers.length - 1; i >= 0; i--) {
    if (quantity >= priceTiers[i].minQty) {
      selectedTier = priceTiers[i];
      break;
    }
  }

  const unitPriceRmb = selectedTier.priceRmb;
  const costBdt = unitPriceRmb * exchangeRate;
  const unitPriceBdt = Math.round(costBdt * (1 + marginPercent / 100));
  const totalPriceBdt = unitPriceBdt * quantity;

  return { unitPriceRmb, unitPriceBdt, totalPriceBdt };
}

/**
 * Calculates International Shipping Fee (Air vs Sea, General vs Sensitive)
 */
export function calculateShippingFee(
  weightKg: number,
  shippingMethod: "AIR" | "SEA",
  isSensitive: boolean = false,
  dimensionsCm?: { length: number; width: number; height: number },
  settings: GlobalSettings = DEFAULT_SETTINGS
): { chargeableWeightKg: number; ratePerKg: number; shippingCostBdt: number } {
  // Volumetric weight calculation for air: (L * W * H) / 5000
  let volumetricWeightKg = 0;
  if (dimensionsCm && dimensionsCm.length && dimensionsCm.width && dimensionsCm.height) {
    volumetricWeightKg = (dimensionsCm.length * dimensionsCm.width * dimensionsCm.height) / 5000;
  }

  // Chargeable weight is higher of gross or volumetric weight
  const chargeableWeightKg = Math.max(weightKg, volumetricWeightKg);
  // Round up to nearest 0.1 kg, minimum 0.5 kg
  const billedWeightKg = Math.max(0.5, Math.ceil(chargeableWeightKg * 10) / 10);

  let ratePerKg = settings.airRatePerKgGeneral;
  if (shippingMethod === "AIR") {
    ratePerKg = isSensitive ? settings.airRatePerKgSensitive : settings.airRatePerKgGeneral;
  } else {
    ratePerKg = settings.seaRatePerKg;
  }

  const shippingCostBdt = Math.round(billedWeightKg * ratePerKg);
  return { chargeableWeightKg: billedWeightKg, ratePerKg, shippingCostBdt };
}

/**
 * Calculates the Payment Structure
 * Stage 1: 100% full product cost to initiate order
 * Stage 2: Actual international freight weight fee (per kg) + local BD courier fee payable on arrival
 */
export function calculateTwoStagePayment(
  productTotalBdt: number,
  intlShippingCostBdt: number,
  localCourierFeeBdt: number,
  advancePercent: number = DEFAULT_SETTINGS.advancePaymentPercent
) {
  const advanceAmountBdt = Math.round((productTotalBdt * advancePercent) / 100);
  const stage2ProductBalanceBdt = productTotalBdt - advanceAmountBdt;
  const stage2TotalPayableBdt = stage2ProductBalanceBdt + intlShippingCostBdt + localCourierFeeBdt;
  const grandTotalBdt = advanceAmountBdt + stage2TotalPayableBdt;

  return {
    advancePercentage: advancePercent,
    advanceAmountBdt, // Paid NOW (Stage 1)
    stage2ProductBalanceBdt,
    intlShippingCostBdt,
    localCourierFeeBdt,
    stage2TotalPayableBdt, // Paid on BD Arrival (Stage 2)
    grandTotalBdt,
  };
}
