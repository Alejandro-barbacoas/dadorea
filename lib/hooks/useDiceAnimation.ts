// @ts-nocheck
import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { 
  FACE_ROTATIONS,
  calculateRotationDistance,
  rollDice
} from '../utils/diceHelpers';
import { DICE_ROLL_DURATION } from '../core/logic/constants';

export const useDiceAnimation = (
  diceRef: React.RefObject<THREE.Mesh>,
  onRollComplete?: (result: number) => void
) => {
  const rotationVelocityRef = useRef({ x: 0, y: 0, z: 0 });
  const isRollingRef = useRef(false);
  const rollResultRef = useRef<number | null>(null);

  const animateToFinalPosition = useCallback((faceNumber: number) => {
    if (!diceRef.current) return;

    const targetRotation = FACE_ROTATIONS[faceNumber];
    let progress = 0;
    
    const smoothRotate = () => {
      if (!diceRef.current) return;

      progress += 0.05;
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      
      diceRef.current.rotation.x = targetRotation.x * easeOut;
      diceRef.current.rotation.y = targetRotation.y * easeOut;
      diceRef.current.rotation.z = targetRotation.z * easeOut;

      if (progress < 1) {
        requestAnimationFrame(smoothRotate);
      }
    };

    smoothRotate();
  }, [diceRef]);

  const startRolling = useCallback(() => {
    if (!diceRef.current) return;
    
    isRollingRef.current = true;
    rollResultRef.current = rollDice();
    
    //velocidad inicial más fuerte para giros mas brusco
    rotationVelocityRef.current = {
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5,
    };

    setTimeout(() => {
      isRollingRef.current = false;
      
      if (onRollComplete && rollResultRef.current) {
        onRollComplete(rollResultRef.current);
      }
      
      if (rollResultRef.current) {
        animateToFinalPosition(rollResultRef.current);
      }
    }, DICE_ROLL_DURATION);
  }, [diceRef, onRollComplete, animateToFinalPosition]);

  const updateRotation = useCallback(() => {
    if (!diceRef.current) return;

    if (isRollingRef.current) {
      //aplicarle la rotacion
      diceRef.current.rotation.x += rotationVelocityRef.current.x;
      diceRef.current.rotation.y += rotationVelocityRef.current.y;
      diceRef.current.rotation.z += rotationVelocityRef.current.z;

      //desaceleracion progresiva
      const friction = 0.97;
      rotationVelocityRef.current.x *= friction;
      rotationVelocityRef.current.y *= friction;
      rotationVelocityRef.current.z *= friction;
    }
  }, [diceRef]);

  return {
    startRolling,
    updateRotation,
    isRolling: isRollingRef,
  };
};