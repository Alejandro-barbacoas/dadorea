import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateAverage } from '@/lib/utils/diceHelpers';

type DiceStatsProps = {
  history: number[];
};

export const DiceStats: React.FC<DiceStatsProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Estadísticas</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Último:</Text>
          <Text style={styles.statValue}>{history[0]}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Promedio:</Text>
          <Text style={styles.statValue}>{calculateAverage(history)}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total:</Text>
          <Text style={styles.statValue}>{history.length}</Text>
        </View>
      </View>
      
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Historial:</Text>
        <View style={styles.historyList}>
          {history.map((value, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyNumber}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyContainer: {
    marginTop: 12,
  },
  historyTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  historyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyItem: {
    width: 40,
    height: 40,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  historyNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});