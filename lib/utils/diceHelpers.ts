export const FACE_ROTATIONS: { [key: number]: { x: number; y: number; z: number } } = {
    1: { x: 0, y: 0, z: 0 },
    6: { x: Math.PI, y: 0, z: 0 },
    2: { x: 0, y: 0, z: -Math.PI / 2 },
    5: { x: 0, y: 0, z: Math.PI / 2 },
    3: { x: -Math.PI / 2, y: 0, z: 0 },
    4: { x: Math.PI / 2, y: 0, z: 0 },
  };
  
  export const generateRandomVelocity = () => ({
    x: (Math.random() - 0.5) * 0.3,
    y: (Math.random() - 0.5) * 0.3,
    z: (Math.random() - 0.5) * 0.3,
  });
  
  export const applyFriction = (
    velocity: { x: number; y: number; z: number },
    friction: number = 0.98
  ) => ({
    x: velocity.x * friction,
    y: velocity.y * friction,
    z: velocity.z * friction,
  });
  
  export const rollDice = (): number => {
    return Math.floor(Math.random() * 6) + 1;
  };
  
  export const calculateAverage = (numbers: number[]): string => {
    if (numbers.length === 0) return '0.00';
    const sum = numbers.reduce((a, b) => a + b, 0);
    return (sum / numbers.length).toFixed(2);
  };
  
  export const calculateRotationDistance = (
    current: { x: number; y: number; z: number },
    target: { x: number; y: number; z: number }
  ): number => {
    return (
      Math.abs(target.x - current.x) +
      Math.abs(target.y - current.y) +
      Math.abs(target.z - current.z)
    );
  };