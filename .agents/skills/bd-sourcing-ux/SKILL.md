---
name: bd-sourcing-ux
description: Specialized guidelines and best practices for China-to-Bangladesh cross-border B2B sourcing and logistics proxy interfaces (1688 / Taobao / Tmall to BD).
---

# Bangladesh China-Sourcing UX & Cross-Border Logistics Principles

## 1. Core Persona & Business Model
- **User Base**: Bangladeshi business owners, shopkeepers in Elephant Road / New Market / Islampur / Chawkbazar, Facebook F-commerce entrepreneurs, hardware retailers, and wholesale resellers.
- **The Value Proposition**: Customers do not browse pre-stocked warehouses; they want to paste any Chinese manufacturer link (1688.com, Taobao.com, Tmall.com) and get:
  1. Live converted BDT factory cost at authentic RMB exchange rates.
  2. Clear, transparent freight estimation (Air Cargo 10–18 days vs. Sea Freight 30–45 days).
  3. Pre-shipment Quality Control (QC) at a Guangzhou warehouse.
  4. Escrow financial security: 50% advance to lock production; remaining 50% + weight freight upon arrival in Dhaka.
  5. 100% customs clearance handled end-to-end with door delivery across Bangladesh.

## 2. Minimalist Portal Aesthetics (Anti-Slop)
- **Eliminate Fake Marketplaces**: Do not show a bloated 20-item fake marketplace grid on the homepage. Users get confused whether items are in stock in Bangladesh or in China.
- **Hero-First Omnibar**: The search bar is the central machine. It must accept:
  - 1688 URLs (`detail.1688.com/offer/...`, `m.1688.com/...`)
  - Taobao / Tmall URLs (`item.taobao.com/item.htm?id=...`)
  - Search keywords in English or Bengali
  - One-tap clipboard paste (`navigator.clipboard.readText()`)
- **No Heavy 3D Lag**: Remove WebGL/Three.js canvases from landing screens. Importers are often on mobile 4G in busy markets; page load time must be sub-second with 0ms visual freeze.

## 3. Bilingual Copywriting Standards (Bengali + English)
- **Primary Bengali Value Props**:
  - *"চীন থেকে সরাসরি ফ্যাক্টরি মূল্যে আমদানি করুন"* (Import directly from China at factory prices)
  - *"১৬৮৮ বা তাওবাও-এর যেকোনো লিংক পেস্ট করুন"* (Paste any 1688 or Taobao link)
  - *"৫০% অগ্রিম পেমেন্টে অর্ডার বুকিং — বাকি টাকা বাংলাদেশে ডেলিভারির সময়"* (50% advance booking — balance upon BD delivery)
  - *"গুয়াংজু নিজস্ব ওয়্যারহাউসে প্রাক-শিপমেন্ট কোয়ালিটি চেক (QC)"* (Pre-shipment QC in our Guangzhou warehouse)
  - *"কাস্টমস ক্লিয়ারড এয়ার কার্গো ও সি ফ্রেইট"* (Customs-cleared air cargo and sea freight)

## 4. Trust Engineering for Bangladesh
- **WhatsApp Integration**: In Bangladesh, 90%+ of B2B trade discussions happen on WhatsApp. Every screen must offer a direct line to a sourcing consultant.
- **Local Mobile Payments**: Clearly state support for bKash, Nagad, and local Bangladeshi bank transfers.
- **Two-Stage Payment Transparency**: Never hide shipping costs or surprise the buyer at customs. Always break down:
  - Stage 1: 50% Factory Advance (পণ্য প্রস্তুত করতে)
  - Stage 2: 50% Balance + Actual International Weight Freight + Local Courier (পণ্য ঢাকায় পৌঁছালে)
