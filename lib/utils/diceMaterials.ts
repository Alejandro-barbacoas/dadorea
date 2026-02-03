import * as THREE from 'three';

//hace que el dado siempre sea visible creando materiales de un solo color
export const createSolidColorMaterials = (): THREE.Material[] => {
  // Se devuelve un array de 6 materiales idénticos de color blanco.
  return Array(6).fill(new THREE.MeshStandardMaterial({
    color: 0xffffff, // Blanco
    roughness: 0.8,
    metalness: 0.1,
  }));
};
