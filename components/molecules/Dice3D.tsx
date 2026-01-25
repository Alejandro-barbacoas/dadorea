// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { createDiceMaterials } from '@/lib/utils/diceMaterials';
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
  const rendererRef = useRef<Renderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  
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

  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl });
    rendererRef.current = renderer;
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);
    const materials = createDiceMaterials();
    const dice = new THREE.Mesh(geometry, materials);
    diceRef.current = dice;
    scene.add(dice);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const animate = () => {
      requestIdRef.current = requestAnimationFrame(animate);

      // Animación de lanzamiento
      updateRotation();

      // Movimiento libre (solo si no se está lanzando y hay datos)
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
