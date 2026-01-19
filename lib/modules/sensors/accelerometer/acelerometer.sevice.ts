import { Accelerometer } from 'expo-sensors';

export const SensorService = {
  subscribe: (callback: (data: any) => void) => {
    Accelerometer.setUpdateInterval(100); // 100ms = 10fps (suficiente para UI)
    return Accelerometer.addListener(callback);
  },

  unsubscribe: (subscription: any) => {
    if (subscription) subscription.remove();
  }
};