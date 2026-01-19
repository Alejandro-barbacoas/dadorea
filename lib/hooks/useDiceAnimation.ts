// @ts-nocheck
import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { 
  generateRandomVelocity, 
  applyFriction, 
  rollDice,
  FACE_ROTATIONS,
  calculateRotationDistance 
} from '../utils/diceHelpers';
import { DICE_ROLL_DURATION } from '../core/logic/constants';

export const useDiceAnimation = (
  diceRef: React.RefObject<THREE.Mesh>,
  onRollComplete?: (result: number) => void
) => {
  const rotationVelocityRef = useRef({ x: 0, y: 0, z: 0 });
  const isRollingRef = useRef(false);

  const animateToFinalPosition = useCallback((faceNumber: number) => {
    if (!diceRef.current) return;

    const targetRotation = FACE_ROTATIONS[faceNumber];
    
    const smoothRotate = () => {
      if (!diceRef.current) return;

      diceRef.current.rotation.x += (targetRotation.x - diceRef.current.rotation.x) * 0.1;
      diceRef.current.rotation.y += (targetRotation.y - diceRef.current.rotation.y) * 0.1;
      diceRef.current.rotation.z += (targetRotation.z - diceRef.current.rotation.z) * 0.1;

      const distance = calculateRotationDistance(diceRef.current.rotation, targetRotation);

      if (distance > 0.01) {
        requestAnimationFrame(smoothRotate);
      }
    };

    smoothRotate();
  }, [diceRef]);

  const startRolling = useCallback(() => {
    if (!diceRef.current) return;
    
    isRollingRef.current = true;
    rotationVelocityRef.current = generateRandomVelocity();

    setTimeout(() => {
      isRollingRef.current = false;
      const result = rollDice();
      
      if (onRollComplete) {
        onRollComplete(result);
      }
      
      animateToFinalPosition(result);
    }, DICE_ROLL_DURATION);
  }, [diceRef, onRollComplete, animateToFinalPosition]);

  const updateRotation = useCallback(() => {
    if (!diceRef.current) return;

    if (isRollingRef.current) {
      diceRef.current.rotation.x += rotationVelocityRef.current.x;
      diceRef.current.rotation.y += rotationVelocityRef.current.y;
      diceRef.current.rotation.z += rotationVelocityRef.current.z;

      rotationVelocityRef.current = applyFriction(rotationVelocityRef.current);
    }
  }, [diceRef]);

  return {
    startRolling,
    updateRotation,
    isRolling: isRollingRef,
  };
};