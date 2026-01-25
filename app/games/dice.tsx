import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Dice3D } from '@/components/molecules/Dice3D';
import { DiceStats } from '@/components/molecules/DiceStats';
import { useAccelerometer } from '@/lib/modules/sensors/accelerometer/useAccelerometer';
import * as Haptics from 'expo-haptics';
import { styles } from './dice.styles'; // Importa los estilos

export default function DiceScreen() {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const { x, y, z, isShaking } = useAccelerometer();
  const [isFreeMode, setIsFreeMode] = useState(false);

  useEffect(() => {
    if (!isFreeMode && isShaking && !isRolling) {
      handleRollDice();
    }
  }, [isShaking, isRolling, isFreeMode]);

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
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* Dado 3D */}
      <View style={styles.diceContainer}>
        <Dice3D
          isRolling={isRolling}
          onRollComplete={handleRollComplete}
          accelerometerData={isFreeMode ? { x, y, z } : { x: 0, y: 0, z: 0 }}
        />
        <View style={styles.freeModeContainer}>
          <Text style={styles.freeModeText}>Modo Libre</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#4CAF50" }}
            thumbColor={isFreeMode ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsFreeMode(previousState => !previousState)}
            value={isFreeMode}
          />
        </View>
      </View>

      {/* Resultado */}
      <View style={styles.resultContainer}>
        {result !== null && !isRolling && (
          <>
            <Text style={styles.resultLabel}>Resultado:</Text>
            <Text style={styles.resultNumber}>{result}</Text>
          </>
        )}
        {isRolling && <Text style={styles.rollingText}>Lanzando...</Text>}
      </View>

      {/* Botón de lanzar */}
      <TouchableOpacity
        style={[styles.rollButton, isRolling && styles.rollButtonDisabled]}
        onPress={handleRollDice}
        disabled={isRolling}
      >
        <Text style={styles.rollButtonText}>
          {isRolling ? 'Rodando...' : 'Lanzar Dado'}
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
          {isShaking ? 'Sacudiendo' : 'Quieto'}
        </Text>
      </View>
    </ScrollView>
  );
}
