// Core Type Definitions for SkySourcing BD

export type PlatformType = "1688" | "taobao" | "tmall" | "manual" | "FACTORY_DIRECT";

export interface PriceTier {
  range: string;
  minQty: number;
  priceRmb: number;
}

export interface ProductSku {
  id: string;
  name: string;
  nameCn?: string;
  image?: string;
  priceRmb: number;
  stock: number;
}

export interface ProductAttribute {
  keyCn: string;
  keyEn: string;
  valueCn: string;
  valueEn: string;
}

export interface Product {
  id: string;
  sourcePlatform: PlatformType;
  sourceOfferId: string;
  url: string;
  titleCn: string;
  titleEn: string;
  titleBn?: string;
  description?: string;
  descriptionCn?: string;
  images: string[]; // Main carousel / studio photos
  descriptionImages?: string[]; // Detailed schematics & workshop photos
  attributes?: ProductAttribute[]; // Factory specifications matrix
  priceTiers: PriceTier[];
  basePriceRmb: number;
  skus: ProductSku[];
  category: string;
  shopName: string;
  location: string;
  estimatedWeightKg: number;
  minOrderQty: number;
  isSensitiveCargo?: boolean; // battery, liquid, powder, magnet
  createdAt?: string;
}

export type OrderStatus =
  | "STAGE1_PENDING"
  | "STAGE1_PAID"
  | "PURCHASING_IN_CHINA"
  | "CHINA_WAREHOUSE_RECEIVED"
  | "QC_VERIFIED"
  | "DISPATCHED_TO_BD"
  | "CUSTOMS_CLEARED"
  | "ARRIVED_DHAKA_HUB"
  | "STAGE2_PAID"
  | "LOCAL_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sourcePlatform: PlatformType;
  sourceOfferId: string;
  skuId?: string;
  skuName?: string;
  skuNameCn?: string;
  unitPriceRmb: number;
  unitPriceBdt: number;
  quantity: number;
  chinaOrderNumber?: string;
  chinaDomesticCourier?: string;
  chinaTrackingNumber?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  alternativePhone?: string;
  district: string;
  thana: string;
  fullAddress: string;
  notes?: string;
}

export interface OrderPricing {
  exchangeRateUsed: number;
  productTotalRmb: number;
  productTotalBdt: number;
  advancePercentage: number; // e.g. 100%
  advanceAmountBdt: number; // paid in stage 1
  stage2ProductBalanceBdt: number; // 0 when 100% product payment
  estimatedWeightKg: number;
  actualWeightKg?: number;
  intlShippingRatePerKg: number;
  intlShippingCostBdt: number;
  localCourierFeeBdt: number;
  totalOrderBdt: number;
  stage2TotalPayableBdt: number; // balance + shipping
}

export interface OrderTrackingInfo {
  chinaDomesticCourier?: string; // 顺丰 SF Express, 中通 ZTO, etc.
  chinaTrackingNumber?: string;
  chinaReceivedAt?: string;
  qcPhotos: string[];
  qcNotes?: string;
  weightGrossKg?: number;
  dimensionsCm?: { length: number; width: number; height: number };
  cbm?: number;
  batchId?: string; // Master carton or Air AWB number
  airFlightOrVesselNumber?: string;
  shippedFromChinaAt?: string;
  bdCustomsClearedAt?: string;
  arrivedDhakaAt?: string;
  localCourier?: "STEADFAST" | "PATHAO" | "REDX" | "HUB_PICKUP";
  localTrackingCode?: string;
  dispatchedLocalAt?: string;
  deliveredAt?: string;
}

export interface OrderPaymentInfo {
  method: "BKASH" | "NAGAD";
  accountType?: string;
  senderNumber: string;
  transactionId: string;
  amount: number;
  submittedAt: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  shippingMethod: "AIR" | "SEA";
  cargoType: "GENERAL" | "SENSITIVE";
  customer: CustomerInfo;
  items: OrderItem[];
  pricing: OrderPricing;
  tracking: OrderTrackingInfo;
  payment?: OrderPaymentInfo;
}

export interface GlobalSettings {
  exchangeRateRmbToBdt: number; // e.g. 18.50
  defaultProfitMarginPercent: number; // e.g. 12%
  advancePaymentPercent: number; // e.g. 100%
  airRatePerKgGeneral: number; // e.g. 750 BDT
  airRatePerKgSensitive: number; // e.g. 950 BDT
  seaRatePerKg: number; // e.g. 220 BDT
  seaRatePerCbm: number; // e.g. 25000 BDT
  localCourierDhaka: number; // e.g. 70 BDT
  localCourierOutsideDhaka: number; // e.g. 130 BDT
  chinaWarehouseAddressCn: string;
  chinaWarehouseContact: string;
  bkashNumber: string; // e.g. 01712-345678
  bkashAccountType: "PERSONAL" | "MERCHANT" | "AGENT";
  nagadNumber: string; // e.g. 01812-345678
  nagadAccountType: "PERSONAL" | "MERCHANT";
  whatsappNumber: string; // e.g. +8801700000000
  announcementNotice?: string;
}

export interface RfqRequest {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  district?: string;
  productTitle: string;
  description?: string;
  targetQuantity: number;
  targetPriceBdt?: number;
  imageUrl?: string;
  referenceLink?: string;
  preferredShipping: "AIR" | "SEA";
  status: "PENDING" | "QUOTED" | "ACCEPTED" | "CANCELLED";
  adminNotes?: string;
  quotedPriceBdt?: number;
}

