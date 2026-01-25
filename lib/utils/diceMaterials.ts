// @ts-nocheck
import * as THREE from 'three';

const FACE_COLORS = [
  0xff0000, 
  0x00ff00,
  0x0000ff, 
  0xffff00, 
  0xff00ff, 
  0x00ffff, 
];

export const createDiceMaterials = () => {
  const materials = [];
  
  for (let i = 0; i < FACE_COLORS.length; i++) {
    const material = new (THREE as any).MeshBasicMaterial({ 
      color: FACE_COLORS[i] 
    });
    materials.push(material);
  }
  
  return materials;
};