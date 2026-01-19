import * as THREE from 'three';

const FACE_COLORS = [
  0xff0000, // 1 - Rojo
  0x00ff00, // 6 - Verde
  0x0000ff, // 2 - Azul
  0xffff00, // 5 - Amarillo
  0xff00ff, // 3 - Magenta
  0x00ffff, // 4 - Cyan
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