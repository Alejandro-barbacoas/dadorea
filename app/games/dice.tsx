import React, { useEffect, useRef, useState } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

type Dice3DProps = {
  isRolling: boolean;
  onRollComplete?: (result: number) => void;
  accelerometerData: { x: number; y: number; z: number };
};

export const Dice3D: React.FC<Dice3DProps> = ({ 
  isRolling, 
  onRollComplete,
  accelerometerData 
}) => {
  const [result, setResult] = useState<number | null>(null);
  const requestIdRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<Renderer>();
  const diceRef = useRef<THREE.Mesh>();
  const rotationVelocityRef = useRef({ x: 0, y: 0, z: 0 });
  const isRollingRef = useRef(false);

  const createDiceGeometry = () => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Crear materiales con números para cada cara
    const materials = [
      createFaceMaterial('1'), // cara 1
      createFaceMaterial('6'), // cara 6 (opuesta a 1)
      createFaceMaterial('2'), // cara 2
      createFaceMaterial('5'), // cara 5 (opuesta a 2)
      createFaceMaterial('3'), // cara 3
      createFaceMaterial('4'), // cara 4 (opuesta a 3)
    ];

    return { geometry, materials };
  };

  const createFaceMaterial = (number: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    // Fondo blanco
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 256, 256);

    // Borde negro
    context.strokeStyle = '#000000';
    context.lineWidth = 4;
    context.strokeRect(0, 0, 256, 256);

    // Número negro
    context.fillStyle = '#000000';
    context.font = 'bold 120px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ map: texture });
  };

  const startRolling = () => {
    if (!diceRef.current) return;
    
    isRollingRef.current = true;
    setResult(null);

    // Velocidad de rotación aleatoria
    rotationVelocityRef.current = {
      x: (Math.random() - 0.5) * 0.3,
      y: (Math.random() - 0.5) * 0.3,
      z: (Math.random() - 0.5) * 0.3,
    };

    // Detener después de 2 segundos
    setTimeout(() => {
      stopRolling();
    }, 2000);
  };

  const stopRolling = () => {
    isRollingRef.current = false;
    
    // Calcular el resultado basado en la rotación final
    const finalResult = Math.floor(Math.random() * 6) + 1;
    setResult(finalResult);
    
    if (onRollComplete) {
      onRollComplete(finalResult);
    }

    // Animar hacia la posición final
    animateToFinalPosition(finalResult);
  };

  const animateToFinalPosition = (faceNumber: number) => {
    if (!diceRef.current) return;

    // Rotaciones para mostrar cada cara hacia arriba
    const faceRotations: { [key: number]: { x: number; y: number; z: number } } = {
      1: { x: 0, y: 0, z: 0 },
      6: { x: Math.PI, y: 0, z: 0 },
      2: { x: 0, y: 0, z: -Math.PI / 2 },
      5: { x: 0, y: 0, z: Math.PI / 2 },
      3: { x: -Math.PI / 2, y: 0, z: 0 },
      4: { x: Math.PI / 2, y: 0, z: 0 },
    };

    const targetRotation = faceRotations[faceNumber];
    
    // Smooth transition to final rotation
    const smoothRotate = () => {
      if (!diceRef.current) return;

      diceRef.current.rotation.x += (targetRotation.x - diceRef.current.rotation.x) * 0.1;
      diceRef.current.rotation.y += (targetRotation.y - diceRef.current.rotation.y) * 0.1;
      diceRef.current.rotation.z += (targetRotation.z - diceRef.current.rotation.z) * 0.1;

      const distance = Math.abs(targetRotation.x - diceRef.current.rotation.x) +
                       Math.abs(targetRotation.y - diceRef.current.rotation.y) +
                       Math.abs(targetRotation.z - diceRef.current.rotation.z);

      if (distance > 0.01) {
        requestAnimationFrame(smoothRotate);
      }
    };

    smoothRotate();
  };

  useEffect(() => {
    if (isRolling && !isRollingRef.current) {
      startRolling();
    }
  }, [isRolling]);

  const onContextCreate = async (gl: any) => {
    // Configurar renderer
    const renderer = new Renderer({ gl });
    rendererRef.current = renderer;
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Crear escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x1a1a1a);

    // Crear cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    // Crear dado
    const { geometry, materials } = createDiceGeometry();
    const dice = new THREE.Mesh(geometry, materials);
    diceRef.current = dice;
    scene.add(dice);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Loop de animación
    const animate = () => {
      requestIdRef.current = requestAnimationFrame(animate);

      if (diceRef.current && isRollingRef.current) {
        // Aplicar velocidad de rotación
        diceRef.current.rotation.x += rotationVelocityRef.current.x;
        diceRef.current.rotation.y += rotationVelocityRef.current.y;
        diceRef.current.rotation.z += rotationVelocityRef.current.z;

        // Fricción (desaceleración gradual)
        rotationVelocityRef.current.x *= 0.98;
        rotationVelocityRef.current.y *= 0.98;
        rotationVelocityRef.current.z *= 0.98;
      } else if (diceRef.current) {
        // Rotación suave por el acelerómetro cuando no está rodando
        diceRef.current.rotation.x += accelerometerData.y * 0.01;
        diceRef.current.rotation.y += accelerometerData.x * 0.01;
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