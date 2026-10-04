"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Plane, Ship, ShieldCheck, RefreshCw, Compass, MapPin, Radio, Sparkles } from "lucide-react";

interface WaypointInfo {
  id: string;
  name: string;
  code: string;
  coords: string;
  role: string;
  metric: string;
  transitTime: string;
  color: string;
}

const WAYPOINTS: Record<string, WaypointInfo> = {
  CAN: {
    id: "CAN",
    name: "Guangzhou Baiyun Sourcing Hub",
    code: "CAN (China)",
    coords: "23.39° N, 113.30° E",
    role: "Primary Factory Consolidation & QC Scale Hub",
    metric: "4,200+ pkgs/day",
    transitTime: "Departure: Daily 14:00",
    color: "#F59E0B"
  },
  DAC: {
    id: "DAC",
    name: "Dhaka Hazrat Shahjalal Cargo Village",
    code: "DAC (Bangladesh)",
    coords: "23.84° N, 90.40° E",
    role: "Direct Customs Clearance & Courier Handover",
    metric: "18h Customs Avg",
    transitTime: "Air Cargo 10–18 Days",
    color: "#10B981"
  },
  CTG: {
    id: "CTG",
    name: "Chittagong Deep Sea Container Terminal",
    code: "CTG (Bangladesh)",
    coords: "22.33° N, 91.83° E",
    role: "Heavy Bulk & Commercial LCL/FCL Port",
    metric: "৳220/kg Flat",
    transitTime: "Sea Freight 30–45 Days",
    color: "#38BDF8"
  }
};

export function FreightGlobe3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [selectedWaypoint, setSelectedWaypoint] = useState<WaypointInfo>(WAYPOINTS.CAN);
  const [activeMode, setActiveMode] = useState<"air" | "sea">("air");
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
        setLoading(false);
        return;
      }
    } catch (e) {
      setWebGLSupported(false);
      setLoading(false);
      return;
    }

    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 440;
    const height = container.clientHeight || 340;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 4.4);

    let renderer: THREE.WebGLRenderer;
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile, 
        alpha: true,
        powerPreference: "high-performance" 
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    } catch (err) {
      setWebGLSupported(false);
      setLoading(false);
      return;
    }

    // Safely append domElement without wiping React-managed siblings
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Root Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Focus initial view on the China - Bangladesh transit corridor
    globeGroup.rotation.y = -Math.PI / 2.15;
    globeGroup.rotation.x = 0.38;

    const sphereRadius = 1.45;

    // 2. Deep Obsidian Core Sphere (blocks backside points for realistic depth)
    const coreGeo = new THREE.SphereGeometry(sphereRadius * 0.985, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x060B19,
      transparent: true,
      opacity: 0.94,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 3. Volumetric Atmospheric Rim Glow
    const atmosGeo = new THREE.SphereGeometry(sphereRadius * 1.05, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x1E3A8A,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // Helper: Convert Lat/Lng to 3D spherical coordinates
    const latLngToVector = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // 4. Luminous Continental Point-Cloud Matrix
    // High-resolution procedural point distribution with landmass density algorithms
    const isLandmass = (lat: number, lng: number) => {
      // China & East Asia
      if (lat >= 18 && lat <= 50 && lng >= 75 && lng <= 135) return true;
      // Bangladesh & Indian Subcontinent
      if (lat >= 6 && lat <= 35 && lng >= 68 && lng <= 95) return true;
      // Southeast Asia (Vietnam, Thailand, Malaysia, Indonesia)
      if (lat >= -10 && lat <= 22 && lng >= 95 && lng <= 142) return true;
      // Middle East & Central Asia
      if (lat >= 12 && lat <= 45 && lng >= 40 && lng <= 75) return true;
      // Europe
      if (lat >= 36 && lat <= 65 && lng >= -10 && lng <= 40) return true;
      // Africa
      if (lat >= -35 && lat <= 35 && lng >= -18 && lng <= 52) return true;
      // Japan & Korea
      if (lat >= 30 && lat <= 45 && lng >= 126 && lng <= 145) return true;
      // Australia
      if (lat >= -40 && lat <= -10 && lng >= 112 && lng <= 154) return true;
      // Americas
      if (lat >= -55 && lat <= 68 && lng >= -165 && lng <= -35) return true;
      return false;
    };

    const pointCount = 2200;
    const landPositions: number[] = [];
    const landColors: number[] = [];
    const oceanPositions: number[] = [];
    const oceanColors: number[] = [];

    // Golden spiral distribution on sphere
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < pointCount; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / pointCount);
      
      const lat = 90 - (phi * 180 / Math.PI);
      let lng = (theta * 180 / Math.PI) % 360;
      if (lng > 180) lng -= 360;

      const pos = latLngToVector(lat, lng, sphereRadius);
      const isLand = isLandmass(lat, lng);

      if (isLand) {
        landPositions.push(pos.x, pos.y, pos.z);
        // Highlight China & Bangladesh trade corridor in Freight Amber / Radiant Emerald
        if (lat >= 15 && lat <= 32 && lng >= 85 && lng <= 122) {
          // Corridor focal zone
          landColors.push(0.96, 0.62, 0.07); // Freight Amber
        } else {
          landColors.push(0.22, 0.74, 0.97); // Radiant Cyan/Slate
        }
      } else if (i % 3 === 0) {
        // Sparse ocean grid dots for spatial orientation
        oceanPositions.push(pos.x, pos.y, pos.z);
        oceanColors.push(0.08, 0.14, 0.28); // Subtle Deep Indigo
      }
    }

    // Land Points Mesh
    const landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute("position", new THREE.Float32BufferAttribute(landPositions, 3));
    landGeo.setAttribute("color", new THREE.Float32BufferAttribute(landColors, 3));
    const landMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const landPoints = new THREE.Points(landGeo, landMat);
    globeGroup.add(landPoints);

    // Ocean Points Mesh
    const oceanGeo = new THREE.BufferGeometry();
    oceanGeo.setAttribute("position", new THREE.Float32BufferAttribute(oceanPositions, 3));
    oceanGeo.setAttribute("color", new THREE.Float32BufferAttribute(oceanColors, 3));
    const oceanMat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.35
    });
    const oceanPoints = new THREE.Points(oceanGeo, oceanMat);
    globeGroup.add(oceanPoints);

    // 5. Waypoints & 3D Beacons
    const gzVec = latLngToVector(23.39, 113.30, sphereRadius);
    const dacVec = latLngToVector(23.84, 90.40, sphereRadius);
    const ctgVec = latLngToVector(22.33, 91.83, sphereRadius);

    // Interactive Pulsing Beacons
    const rings: { mesh: THREE.Mesh; initialScale: number; speed: number }[] = [];

    const createBeacon = (pos: THREE.Vector3, colorHex: number) => {
      // Beacon Pin Core
      const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      globeGroup.add(pin);

      // Vertical Telemetry Pillar (pointing radially outward)
      const pillarNormal = pos.clone().normalize();
      const pillarTop = pos.clone().add(pillarNormal.clone().multiplyScalar(0.22));
      const pillarCurve = new THREE.LineCurve3(pos, pillarTop);
      const pillarGeo = new THREE.BufferGeometry().setFromPoints(pillarCurve.getPoints(10));
      const pillarMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85
      });
      const pillar = new THREE.Line(pillarGeo, pillarMat);
      globeGroup.add(pillar);

      // Expanding 3D Sonar Wave Rings
      for (let i = 0; i < 2; i++) {
        const ringGeo = new THREE.RingGeometry(0.04, 0.075, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(pos.clone().multiplyScalar(2));
        globeGroup.add(ring);
        rings.push({ mesh: ring, initialScale: 1 + i * 0.8, speed: 0.8 + i * 0.2 });
      }
    };

    createBeacon(gzVec, 0xF59E0B); // Guangzhou (Freight Amber)
    createBeacon(dacVec, 0x10B981); // Dhaka (QC Emerald)
    createBeacon(ctgVec, 0x38BDF8); // Chittagong (Ocean Cyan)

    // 6. 3D Flight Arc: Guangzhou (CAN) ✈ Dhaka (DAC)
    const midPointAir = new THREE.Vector3()
      .addVectors(gzVec, dacVec)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(sphereRadius * 1.38);

    const airCurve = new THREE.QuadraticBezierCurve3(gzVec, midPointAir, dacVec);
    const airPoints = airCurve.getPoints(70);
    const airGeo = new THREE.BufferGeometry().setFromPoints(airPoints);
    const airMat = new THREE.LineBasicMaterial({
      color: 0xF59E0B,
      transparent: true,
      opacity: 0.85
    });
    const airLine = new THREE.Line(airGeo, airMat);
    globeGroup.add(airLine);

    // Traveling Photon Cluster (Flight CZ-392 Active Consignment)
    const photonCount = 5;
    const photonGeo = new THREE.SphereGeometry(0.032, 12, 12);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const photonMesh = new THREE.Mesh(photonGeo, photonMat);
    globeGroup.add(photonMesh);

    // Trailing Embers
    const emberPositions = new Float32Array(photonCount * 3);
    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xF59E0B,
      size: 0.03,
      transparent: true,
      opacity: 0.75
    });
    const emberPoints = new THREE.Points(emberGeo, emberMat);
    globeGroup.add(emberPoints);

    // 7. Sea Freight Trajectory (CAN 🚢 CTG via Singapore Straits Waypoint)
    const midPointSea = new THREE.Vector3()
      .addVectors(gzVec, ctgVec)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(sphereRadius * 1.15);

    const seaCurve = new THREE.QuadraticBezierCurve3(gzVec, midPointSea, ctgVec);
    const seaPoints = seaCurve.getPoints(50);
    const seaGeo = new THREE.BufferGeometry().setFromPoints(seaPoints);
    const seaMat = new THREE.LineDashedMaterial({
      color: 0x38BDF8,
      dashSize: 0.06,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.65
    });
    const seaLine = new THREE.Line(seaGeo, seaMat);
    seaLine.computeLineDistances();
    globeGroup.add(seaLine);

    // 8. Cosmic Background Particle Nebula
    const starCount = 120;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 10;
      starPositions[i + 1] = (Math.random() - 0.5) * 8;
      starPositions[i + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x64748B,
      size: 0.035,
      transparent: true,
      opacity: 0.5
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    setLoading(false);

    // Mouse & Touch Interactivity (Smooth Inertia & Parallax)
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let targetRotationY = globeGroup.rotation.y;
    let targetRotationX = globeGroup.rotation.x;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      targetRotationY += dx * 0.007;
      targetRotationX += dy * 0.004;
      targetRotationX = Math.max(-0.55, Math.min(0.75, targetRotationX));
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      targetRotationY += dx * 0.01;
      targetRotationX += dy * 0.006;
      targetRotationX = Math.max(-0.55, Math.min(0.75, targetRotationX));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    // Animation Loop
    let flightProgress = 0;
    let lastTime = performance.now();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth Inertia Damping
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.1;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.1;

      // Gentle continuous ambient drift when idle
      if (!isDragging) {
        targetRotationY += delta * 0.06;
      }

      // Pulse Sonar Rings
      rings.forEach((r, idx) => {
        const scale = 1 + ((now * 0.0015 * r.speed + idx * 0.5) % 1.5);
        r.mesh.scale.set(scale, scale, scale);
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - (scale - 1) * 0.6);
      });

      // Advance Traveling Photon Packet
      flightProgress = (flightProgress + delta * 0.22) % 1.0;
      const currentPos = airCurve.getPoint(flightProgress);
      photonMesh.position.copy(currentPos);

      // Trailing embers behind the photon packet
      const emberPosAttr = emberGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < photonCount; i++) {
        const lag = Math.max(0, flightProgress - (i + 1) * 0.02);
        const trailPt = airCurve.getPoint(lag);
        emberPosAttr.setXYZ(i, trailPt.x, trailPt.y, trailPt.z);
      }
      emberPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("resize", onResize);
      if (container && dom.parentNode === container) {
        container.removeChild(dom);
      }
      coreGeo.dispose();
      coreMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      landGeo.dispose();
      landMat.dispose();
      oceanGeo.dispose();
      oceanMat.dispose();
      airGeo.dispose();
      airMat.dispose();
      seaGeo.dispose();
      seaMat.dispose();
      photonGeo.dispose();
      photonMat.dispose();
      emberGeo.dispose();
      emberMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="bg-cargo-900/60 p-6 rounded-3xl text-center text-xs text-slate-400 border border-cargo-800">
        3D Hardware Acceleration Unavailable
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-cargo-950 via-cargo-900 to-cargo-950 border border-cargo-800 shadow-2xl p-4 flex flex-col justify-between">
      {/* 3D Command Header */}
      <div className="flex items-center justify-between z-10 pb-2 border-b border-cargo-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cargo-800 rounded-xl text-freight-amber">
            <Compass className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
              <span>Holographic Trade Globe</span>
              <span className="w-2 h-2 rounded-full bg-qc-emerald animate-pulse" />
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Guangzhou ✈ Dhaka Active Transit</span>
          </div>
        </div>

        {/* Air vs Sea Toggle */}
        <div className="flex items-center gap-1 bg-cargo-900/90 border border-cargo-700/80 p-0.5 rounded-xl text-[10px] font-mono">
          <button
            onClick={() => setActiveMode("air")}
            className={`px-2.5 py-1 rounded-lg transition btn-tactile flex items-center gap-1 ${
              activeMode === "air"
                ? "bg-freight-amber text-cargo-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Plane className="w-3 h-3" />
            <span>Air Cargo</span>
          </button>
          <button
            onClick={() => setActiveMode("sea")}
            className={`px-2.5 py-1 rounded-lg transition btn-tactile flex items-center gap-1 ${
              activeMode === "sea"
                ? "bg-sky-500 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Ship className="w-3 h-3" />
            <span>Sea Freight</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport with isolated mount container */}
      <div className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing relative flex items-center justify-center my-1">
        {/* Dedicated Three.js Canvas Container - ZERO React Children */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cargo-950/70 backdrop-blur-sm pointer-events-none">
            <RefreshCw className="w-6 h-6 text-freight-amber animate-spin mb-1.5" />
            <span className="text-[11px] font-mono text-slate-400">Synthesizing Continental Matrix...</span>
          </div>
        )}

        {/* Orbit Hint */}
        <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] text-slate-400 font-mono bg-cargo-950/70 backdrop-blur-xs px-2 py-0.5 rounded-md border border-cargo-800">
          Drag to orbit • Continental Point Matrix
        </div>
      </div>

      {/* Interactive Waypoint Telemetry Dock */}
      <div className="z-10 space-y-2 pt-1 border-t border-cargo-800/80">
        {/* Waypoint Selector Chips */}
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(WAYPOINTS) as Array<keyof typeof WAYPOINTS>).map((key) => {
            const wp = WAYPOINTS[key];
            const isSelected = selectedWaypoint.id === wp.id;
            return (
              <button
                key={wp.id}
                onClick={() => setSelectedWaypoint(wp)}
                className={`p-2 rounded-xl text-left border transition btn-tactile flex flex-col justify-between ${
                  isSelected
                    ? "bg-cargo-800/90 border-freight-amber ring-1 ring-freight-amber/40 shadow-xs"
                    : "bg-cargo-900/60 border-cargo-800 hover:border-slate-600 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[11px] font-bold font-mono ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {wp.id}
                  </span>
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: wp.color }}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400 truncate block mt-0.5">
                  {wp.metric}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Telemetry Card for Selected Hub */}
        <div className="bg-cargo-900/90 border border-cargo-700/80 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs">{selectedWaypoint.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({selectedWaypoint.coords})</span>
            </div>
            <p className="text-[11px] text-slate-300">{selectedWaypoint.role}</p>
          </div>
          <div className="text-right flex-shrink-0 font-mono">
            <span className="text-xs font-bold text-freight-amber block">{selectedWaypoint.transitTime}</span>
            <span className="text-[10px] text-qc-emerald flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-qc-emerald animate-pulse" />
              Verified Route
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
