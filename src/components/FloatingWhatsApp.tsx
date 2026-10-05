"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/8801700000000?text=Hello%20SkySourcing%20BD,%20I%20want%20to%20source%20products%20from%20China"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-white/20"
      title="Chat with China Sourcing Agent on WhatsApp"
      aria-label="Chat with China Sourcing Agent on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
      <span className="hidden md:inline font-bold text-xs pr-1">
        WhatsApp সোর্সিং
      </span>
    </a>
  );
}
