// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { createSolidColorMaterials } from '@/lib/utils/diceMaterials';
import { useDiceAnimation } from '@/lib/hooks/useDiceAnimation';
import { DICE_SIZE } from '@/lib/core/logic/constants';

type Dice3DProps = {
  isRolling: boolean;
  onRollComplete?: (result: number) => void;
  accelerometerData: { x: number; y: number; z: number } | null;
};

export const Dice3D: React.FC<Dice3DProps> = ({ 
  isRolling, 
  onRollComplete,
  accelerometerData 
}) => {
  const requestIdRef = useRef<number>();
  const diceRef = useRef<THREE.Mesh>(null!);

  const accelerometerDataRef = useRef(accelerometerData);
  useEffect(() => {
    accelerometerDataRef.current = accelerometerData;
  }, [accelerometerData]);

  const { startRolling, updateRotation, isRolling: isRollingRef } = useDiceAnimation(
    diceRef,
    onRollComplete
  );

  useEffect(() => {
    if (isRolling && !isRollingRef.current) {
      startRolling();
    }
  }, [isRolling, startRolling, isRollingRef]);

  // onContextCreate vuelve a ser una funcion sincrona y simple.
  const onContextCreate = (gl: any) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;
    const renderer = new Renderer({ gl });
    renderer.setSize(drawingBufferWidth, drawingBufferHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5F5DC);

    const camera = new THREE.PerspectiveCamera(75, drawingBufferWidth / drawingBufferHeight, 0.1, 1000);
    camera.position.z = 5;

    //se usan directamente los materiales de color intentadndo evitar erroes
    const materials = createSolidColorMaterials();

    const geometry = new THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);
    const dice = new THREE.Mesh(geometry, materials);
    diceRef.current = dice;
    scene.add(dice);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const animate = () => {
      requestIdRef.current = requestAnimationFrame(animate);
      updateRotation();
      if (diceRef.current && !isRollingRef.current && accelerometerDataRef.current) {
        diceRef.current.rotation.x += accelerometerDataRef.current.y * 0.01;
        diceRef.current.rotation.y += accelerometerDataRef.current.x * 0.01;
      }
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  useEffect(() => {
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
};
