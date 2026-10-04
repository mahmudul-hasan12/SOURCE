"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  RotateCw, 
  Layers, 
  Check, 
  RefreshCw,
  Info
} from "lucide-react";

interface ProductViewer3DProps {
  productTitle: string;
  initialColor?: string;
  variants?: { name: string; hex: string }[];
}

export function ProductViewer3D({ 
  productTitle, 
  initialColor = "#1C2541",
  variants = [
    { name: "Cargo Navy", hex: "#0B132B" },
    { name: "Industrial Slate", hex: "#334155" },
    { name: "Freight Amber", hex: "#F59E0B" },
    { name: "Onyx Black", hex: "#0f172a" },
  ]
}: ProductViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [activeColor, setActiveColor] = useState(variants[0].hex);
  const [activeView, setActiveView] = useState<"front" | "top" | "side">("front");
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

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
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);
    cameraRef.current = camera;

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
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;
    } catch (err) {
      setWebGLSupported(false);
      setLoading(false);
      return;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainKeyLight.position.set(4, 5, 4);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const amberFillLight = new THREE.DirectionalLight(0xf59e0b, 0.8);
    amberFillLight.position.set(-4, -2, -3);
    scene.add(amberFillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.2, 10);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // Build Product Mesh Group
    const group = new THREE.Group();
    meshGroupRef.current = group;
    materialsRef.current = [];

    const bodyGeometry = new THREE.CylinderGeometry(0.85, 0.8, 0.7, 32, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeColor),
      metalness: 0.6,
      roughness: 0.25,
      wireframe: wireframeMode
    });
    materialsRef.current.push(bodyMaterial);
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    const trimGeometry = new THREE.TorusGeometry(0.86, 0.04, 16, 64);
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
    });
    const trimMesh = new THREE.Mesh(trimGeometry, trimMaterial);
    trimMesh.rotation.x = Math.PI / 2;
    trimMesh.position.y = 0.35;
    group.add(trimMesh);

    const lidGeometry = new THREE.SphereGeometry(0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const lidMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeColor),
      metalness: 0.5,
      roughness: 0.3,
      wireframe: wireframeMode
    });
    materialsRef.current.push(lidMaterial);
    const lidMesh = new THREE.Mesh(lidGeometry, lidMaterial);
    lidMesh.position.y = 0.35;
    group.add(lidMesh);

    const qcRingGeo = new THREE.RingGeometry(0.95, 1.02, 64);
    const qcRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const qcRing = new THREE.Mesh(qcRingGeo, qcRingMat);
    qcRing.rotation.x = Math.PI / 2;
    qcRing.position.y = -0.38;
    group.add(qcRing);

    const coreGeo = new THREE.BoxGeometry(0.5, 0.4, 0.5);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    const shadowGeo = new THREE.PlaneGeometry(3, 3);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.55;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    scene.add(group);
    setLoading(false);

    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (group) {
        group.position.y = Math.sin(currentTime * 0.002) * 0.04;
        
        if (isRotating && !isDraggingRef.current) {
          group.rotation.y += delta * 0.6;
        }

        if (qcRing) {
          qcRing.rotation.z += delta * 0.8;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !meshGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      meshGroupRef.current.rotation.y += deltaX * 0.01;
      meshGroupRef.current.rotation.x += deltaY * 0.01;
      meshGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, meshGroupRef.current.rotation.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !meshGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      meshGroupRef.current.rotation.y += deltaX * 0.015;
      meshGroupRef.current.rotation.x += deltaY * 0.01;
      meshGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, meshGroupRef.current.rotation.x));

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    domEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      domEl.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      domEl.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      if (container && domEl.parentNode === container) {
        container.removeChild(domEl);
      }
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      trimGeometry.dispose();
      trimMaterial.dispose();
      lidGeometry.dispose();
      lidMaterial.dispose();
      qcRingGeo.dispose();
      qcRingMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [webGLSupported]);

  const handleColorChange = (hex: string) => {
    setActiveColor(hex);
    materialsRef.current.forEach(mat => {
      mat.color.set(new THREE.Color(hex));
    });
  };

  const toggleWireframe = () => {
    const nextState = !wireframeMode;
    setWireframeMode(nextState);
    materialsRef.current.forEach(mat => {
      mat.wireframe = nextState;
    });
  };

  const setCameraView = (view: "front" | "top" | "side") => {
    setActiveView(view);
    if (!meshGroupRef.current) return;
    setIsRotating(false);

    if (view === "front") {
      meshGroupRef.current.rotation.set(0, 0, 0);
    } else if (view === "top") {
      meshGroupRef.current.rotation.set(Math.PI / 2.3, 0, 0);
    } else if (view === "side") {
      meshGroupRef.current.rotation.set(0, Math.PI / 2, 0);
    }
  };

  if (!webGLSupported) {
    return (
      <div className="bg-cargo-900 border border-cargo-800 rounded-3xl p-8 text-center text-white flex flex-col items-center justify-center min-h-[360px]">
        <Info className="w-10 h-10 text-freight-amber mb-3" />
        <h4 className="font-bold text-base mb-1">WebGL Hardware Acceleration Disabled</h4>
        <p className="text-slate-400 text-xs max-w-sm">
          Your browser is currently displaying standard high-resolution 2D photography.
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-cargo-950 to-cargo-900 border border-cargo-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* 3D Viewer Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-cargo-900/90 backdrop-blur-md border border-cargo-700/80 px-3 py-1.5 rounded-full pointer-events-auto shadow-md">
          <span className="w-2 h-2 rounded-full bg-qc-emerald animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-slate-200">
            3D Factory CAD Inspector
          </span>
        </div>

        {/* View Angles & Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-xl border text-xs transition btn-tactile ${
              isRotating 
                ? "bg-freight-amber text-cargo-950 border-freight-amber font-bold" 
                : "bg-cargo-900/90 text-slate-300 border-cargo-700 hover:text-white"
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={toggleWireframe}
            className={`p-2 rounded-xl border text-xs transition btn-tactile ${
              wireframeMode 
                ? "bg-qc-emerald text-white border-qc-emerald font-bold" 
                : "bg-cargo-900/90 text-slate-300 border-cargo-700 hover:text-white"
            }`}
            title="Toggle Internal QC Wireframe"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport with isolated DOM mount */}
      <div className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing relative flex items-center justify-center">
        {/* Dedicated mount - NO REACT CHILDREN */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cargo-950/80 backdrop-blur-sm z-10 text-white pointer-events-none">
            <RefreshCw className="w-8 h-8 text-freight-amber animate-spin mb-2" />
            <span className="text-xs font-mono text-slate-400">Loading 3D Meshes & Shaders...</span>
          </div>
        )}

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] text-slate-400 font-mono flex items-center gap-1.5 bg-cargo-950/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-cargo-800 z-10">
          <span>Drag to rotate 360°</span>
          <span>•</span>
          <span className="text-freight-amber">6-Point Factory QC Pass</span>
        </div>
      </div>

      {/* Bottom Color Variants & Angles Bar */}
      <div className="bg-cargo-900/95 border-t border-cargo-800 p-4 flex flex-wrap items-center justify-between gap-4 z-10">
        {/* Color Palette Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono mr-1">Finish:</span>
          {variants.map((v) => (
            <button
              key={v.hex}
              onClick={() => handleColorChange(v.hex)}
              className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center btn-tactile ${
                activeColor === v.hex 
                  ? "border-freight-amber scale-110 shadow-lg" 
                  : "border-cargo-700 hover:border-slate-400"
              }`}
              style={{ backgroundColor: v.hex }}
              title={v.name}
            >
              {activeColor === v.hex && (
                <Check className={`w-3.5 h-3.5 ${v.hex === '#F59E0B' ? 'text-cargo-950' : 'text-white'}`} />
              )}
            </button>
          ))}
        </div>

        {/* Angle Presets */}
        <div className="flex items-center gap-1.5 bg-cargo-950 p-1 rounded-xl border border-cargo-800">
          {(["front", "top", "side"] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCameraView(view)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition ${
                activeView === view
                  ? "bg-freight-amber text-cargo-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
