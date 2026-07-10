"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";
import { X, ArrowRight, Compass, ShieldCheck } from "lucide-react";

// Showroom Stone Pillar Component
interface PillarProps {
  position: [number, number, number];
  name: string;
  textureUrl: string;
  onClick: () => void;
  hoveredId: string | null;
  setHoveredId: (name: string | null) => void;
}

function ShowroomPillar({
  position,
  name,
  textureUrl,
  onClick,
  hoveredId,
  setHoveredId,
}: PillarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const isHovered = hoveredId === name;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 2);
      setTexture(t);
    });
  }, [textureUrl]);

  // Float hotspot animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (isHovered) {
        meshRef.current.scale.set(1.05, 1.05, 1.05);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Stone slab column */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredId(name);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHoveredId(null);
          document.body.style.cursor = "auto";
        }}
        castShadow
        receiveShadow
      >
        {/* Tall slab pillar structure */}
        <boxGeometry args={[0.8, 2.4, 0.15]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.15}
            metalness={0.05}
            clearcoat={1.0}
          />
        ) : (
          <meshStandardMaterial color="#333333" />
        )}
      </mesh>

      {/* Floating Hotspot Ring above column */}
      <mesh
        position={[0, 1.5, 0]}
        onPointerOver={() => setHoveredId(name)}
        onPointerOut={() => setHoveredId(null)}
        onClick={onClick}
      >
        <torusGeometry args={[0.2, 0.02, 8, 24]} />
        <meshBasicMaterial
          color={isHovered ? "#6366f1" : "#ffffff"}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Secondary glowing core inside the ring */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={isHovered ? "#ffffff" : "#6366f1"} />
      </mesh>
    </group>
  );
}

// Floor grids and showroom details
function ShowroomStage() {
  return (
    <group>
      {/* Floor reflection mirror plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0f0f11"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Dark polished showroom columns backdrop */}
      <gridHelper args={[20, 20, "#6366f1", "#222222"]} position={[0, -1.19, 0]} />

      {/* Ceiling structure */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#08080a" />
      </mesh>
    </group>
  );
}

export default function VirtualShowroom() {
  const [activeStone, setActiveStone] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Pre-configured collection list mapped to coordinates
  const showroomStones = [
    {
      name: "Carrara Gold",
      origin: "Italy",
      category: "Marble",
      finish: "Polished",
      price: "$185 / sqft",
      texture: "/static/seed/textures/carrara_gold_diff.jpg",
      position: [-2.2, 0, -2.2] as [number, number, number],
      desc: "Warm gold veining overlaying absolute Italian white marble blocks.",
    },
    {
      name: "Nero Marquina",
      origin: "Spain",
      category: "Marble",
      finish: "Polished",
      price: "$140 / sqft",
      texture: "/static/seed/textures/nero_marquina_diff.jpg",
      position: [2.2, 0, -2.2] as [number, number, number],
      desc: "Striking white lightning calcites intersecting pitch black minerals.",
    },
    {
      name: "Emerald Onyx",
      origin: "Iran",
      category: "Onyx",
      finish: "Polished",
      price: "$320 / sqft",
      texture: "/static/seed/textures/emerald_onyx_diff.jpg",
      position: [-2.2, 0, 2.2] as [number, number, number],
      desc: "Translucent layers of mint and bronze emerald, ideal for backlight grids.",
    },
    {
      name: "Calacatta Viola",
      origin: "Italy",
      category: "Marble",
      finish: "Honed",
      price: "$245 / sqft",
      texture: "/static/seed/textures/calacatta_viola_diff.jpg",
      position: [2.2, 0, 2.2] as [number, number, number],
      desc: "Dramatic burgundy purple flowing contours sculpted across cream stone.",
    },
  ];

  const activeData = showroomStones.find((s) => s.name === activeStone);

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas Context */}
      <Canvas
        shadows
        camera={{ position: [0, 1, 6.5], fov: 50 }}
        className="w-full h-full bg-black"
      >
        <ambientLight intensity={0.2} />
        {/* Ambient spotlight overlay */}
        <spotLight
          position={[0, 8, 0]}
          angle={0.6}
          penumbra={1}
          intensity={2.5}
          castShadow
          shadow-bias={-0.0001}
        />
        
        <directionalLight position={[-5, 5, 5]} intensity={1.5} />
        <directionalLight position={[5, 5, -5]} intensity={0.5} />

        <ShowroomStage />

        {showroomStones.map((stone) => (
          <ShowroomPillar
            key={stone.name}
            name={stone.name}
            position={stone.position}
            textureUrl={stone.texture}
            onClick={() => setActiveStone(stone.name)}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />
        ))}

        <OrbitControls
          enableDamping
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
          maxDistance={9}
          minDistance={3}
        />

        {/* Ambient luxury star dots */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1} />
        
        <Environment preset="night" />
      </Canvas>

      {/* Floating Instructions Banner */}
      <div className="absolute top-6 left-6 p-4 glass-premium max-w-xs pointer-events-none">
        <div className="flex items-center space-x-2 mb-1">
          <Compass className="w-4 h-4 text-gold-500 animate-pulse" />
          <h4 className="text-[10px] tracking-widest uppercase font-bold text-white">
            Atelier Pavilion
          </h4>
        </div>
        <p className="text-[10px] text-white/50 leading-relaxed">
          Rotate screen, navigate blocks, and click hotspots to inspect exclusive lots in high detail.
        </p>
      </div>

      {/* HTML Detail Modal (Glassmorphism card absolute overlay) */}
      {activeData && (
        <div className="absolute inset-y-0 right-0 w-full sm:w-[420px] glass-premium-dark p-8 flex flex-col justify-between border-l border-gold-500/20 shadow-[0_0_60px_rgba(0,0,0,0.5)] z-20 page-fade-in text-white">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gold-500 font-semibold">
                  {activeData.category} • {activeData.origin}
                </span>
                <h3 className="font-serif text-3xl tracking-wide text-white mt-1">
                  {activeData.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveStone(null)}
                className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo preview */}
            <div
              className="w-full h-48 bg-cover bg-center border border-white/10"
              style={{ backgroundImage: `url(${activeData.texture})` }}
            ></div>

            {/* Specs */}
            <p className="text-xs text-white/70 leading-relaxed">
              {activeData.desc}
            </p>

            <div className="border-t border-b border-white/5 py-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-white/40 uppercase tracking-widest">Finish</span>
                <p className="text-xs font-semibold text-white mt-0.5">{activeData.finish}</p>
              </div>
              <div>
                <span className="text-[9px] text-white/40 uppercase tracking-widest">Base Estimate</span>
                <p className="text-xs font-semibold text-gold-500 mt-0.5">{activeData.price}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-white/50 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Full structural sealing included with lot delivery</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/quote"
              className="w-full text-center block bg-gold-500 hover:bg-white text-black text-xs font-bold uppercase tracking-widest py-4 transition-all duration-300 rounded-none shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-white/20"
            >
              Request Quote
            </Link>
            <Link
              href="/collections"
              className="w-full text-center block border border-white/10 hover:border-gold-500 text-white text-xs font-bold uppercase tracking-widest py-4 transition-all duration-300 rounded-none flex items-center justify-center space-x-2 group"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
