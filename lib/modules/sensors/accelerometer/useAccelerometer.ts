import { useState, useEffect } from 'react';
import { SensorService } from './acelerometer.sevice';
import { isShaking } from '../../../core/motion';

type AccelerometerData = {
  x: number;
  y: number;
  z: number;
};

export const useAccelerometer = () => {
  const [data, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  const [isDeviceShaking, setIsDeviceShaking] = useState(false);

  useEffect(() => {
    const subscription = SensorService.subscribe((accelerometerData: AccelerometerData) => {
      setData(accelerometerData);
      setIsDeviceShaking(isShaking(accelerometerData));
    });

    return () => {
      SensorService.unsubscribe(subscription);
    };
  }, []);

  return {
    x: data.x,
    y: data.y,
    z: data.z,
    isShaking: isDeviceShaking,
  };
};