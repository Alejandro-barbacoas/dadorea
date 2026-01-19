import { SHAKE_THRESHOLD } from './logic/constants';

type Vector3 = { x: number; y: number; z: number; };

export const isShaking = (data: Vector3) => {
  const magnitude = Math.sqrt(
    data.x**2 + data.y**2 + data.z**2
  );
  return magnitude > SHAKE_THRESHOLD;
};