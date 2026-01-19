import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Dice3D } from '@/components/molecules/Dice3D';
import { DiceStats } from '@/components/molecules/DiceStats';
import { useAccelerometer } from '@/lib/modules/sensors/accelerometer/useAccelerometer';
import * as Haptics from 'expo-haptics';

export default function DiceScreen() {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const { x, y, z, isShaking } = useAccelerometer();

  useEffect(() => {
    if (isShaking && !isRolling) {
      handleRollDice();
    }
  }, [isShaking, isRolling]);

  const handleRollDice = () => {
    setIsRolling(true);
    setResult(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleRollComplete = (diceResult: number) => {
    setIsRolling(false);
    setResult(diceResult);
    setHistory(prev => [diceResult, ...prev.slice(0, 9)]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      {/* Dado 3D */}
      <View style={styles.diceContainer}>
        <Dice3D
          isRolling={isRolling}
          onRollComplete={handleRollComplete}
          accelerometerData={{ x, y, z }}
        />
      </View>

      {/* Resultado */}
      <View style={styles.resultContainer}>
        {result !== null && !isRolling && (
          <>
            <Text style={styles.resultLabel}>Resultado:</Text>
            <Text style={styles.resultNumber}>{result}</Text>
          </>
        )}
        {isRolling && (
          <Text style={styles.rollingText}>Lanzando...</Text>
        )}
      </View>

      {/* Botón de lanzar */}
      <TouchableOpacity
        style={[styles.rollButton, isRolling && styles.rollButtonDisabled]}
        onPress={handleRollDice}
        disabled={isRolling}
      >
        <Text style={styles.rollButtonText}>
          {isRolling ? '🎲 Rodando...' : '🎲 Lanzar Dado'}
        </Text>
      </TouchableOpacity>

      {/* Instrucciones */}
      <Text style={styles.instructions}>
        💡 Sacude el teléfono para lanzar
      </Text>

      {/* Estadísticas */}
      <DiceStats history={history} />

      {/* Debug info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Acelerómetro: X:{x.toFixed(2)} Y:{y.toFixed(2)} Z:{z.toFixed(2)}
        </Text>
        <Text style={styles.debugText}>
          {isShaking ? '🔴 Sacudiendo' : '🟢 Quieto'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  diceContainer: {
    flex: 1,
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 20,
    minHeight: 80,
    justifyContent: 'center',
  },
  resultLabel: {
    fontSize: 24,
    color: '#888',
    marginBottom: 8,
  },
  resultNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
  },
  rollingText: {
    fontSize: 28,
    color: '#4CAF50',
    fontWeight: '600',
  },
  rollButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 10,
  },
  rollButtonDisabled: {
    backgroundColor: '#666',
  },
  rollButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 10,
    fontStyle: 'italic',
  },
  debugContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  debugText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});