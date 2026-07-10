"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Center, Environment } from "@react-three/drei";
import * as THREE from "three";

// Dynamic texture loading subcomponent
function SlabMesh({
  textureUrl,
  roughness,
  metalness,
}: {
  textureUrl: string;
  roughness: number;
  metalness: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture using Three.js TextureLoader
  // Fall back to a solid grey if load fails
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      textureUrl,
      (loadedTex) => {
        loadedTex.wrapS = THREE.RepeatWrapping;
        loadedTex.wrapT = THREE.RepeatWrapping;
        loadedTex.repeat.set(1, 1);
        setTexture(loadedTex);
      },
      undefined,
      (err) => {
        console.error("Error loading texture, falling back:", err);
      }
    );
  }, [textureUrl]);

  // Subtle auto-rotation when no interaction is occurring
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* Slab Dimensions: 3m Width x 1.8m Height x 0.03m (3cm) Thickness */}
      <boxGeometry args={[3, 1.8, 0.03]} />
      {texture ? (
        <meshStandardMaterial
          map={texture}
          roughness={roughness}
          metalness={metalness}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      ) : (
        <meshStandardMaterial
          color="#cccccc"
          roughness={roughness}
          metalness={metalness}
        />
      )}
    </mesh>
  );
}

interface MarbleSlab3DProps {
  textureUrl: string;
  roughness?: number;
  metalness?: number;
  lightIntensity?: number;
  ambientIntensity?: number;
}

export default function MarbleSlab3D({
  textureUrl,
  roughness = 0.2,
  metalness = 0.1,
  lightIntensity = 1.5,
  ambientIntensity = 0.6,
}: MarbleSlab3DProps) {
  return (
    <div className="w-full h-full relative group">
      {/* Three.js Canvas Container */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true }}
        className="w-full h-full bg-[#fafafa] dark:bg-[#0b0b0c]"
      >
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={lightIntensity}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, 5]} intensity={0.5} />

        <Center>
          <SlabMesh
            textureUrl={textureUrl}
            roughness={roughness}
            metalness={metalness}
          />
        </Center>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          minDistance={1.5}
          maxDistance={6}
        />

        {/* Soft HDRI lighting emulation */}
        <Environment preset="studio" />
      </Canvas>

      {/* Interactive Helper Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-[9px] uppercase tracking-[0.2em] font-semibold text-white pointer-events-none rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Drag to Rotate • Scroll to Zoom
      </div>
    </div>
  );
}
