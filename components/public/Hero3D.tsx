"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, []);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random() * 2 + 0.5;
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometryRef.current.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  }, [positions, sizes]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.05}
        color="#C0A66A"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingRings() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = state.clock.elapsedTime * 0.05;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <group ref={group}>
      {[1, 1.5, 2].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
          <ringGeometry args={[radius, radius + 0.02, 64]} />
          <meshBasicMaterial color="#C0A66A" transparent opacity={0.15 - i * 0.03} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#C0A66A" />
        <Particles />
        <FloatingRings />
      </Canvas>
    </div>
  );
}
