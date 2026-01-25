import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  diceContainer: {
    height: 300,
    marginTop: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
  },
  freeModeContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  freeModeText: {
    color: '#fff',
    marginRight: 5,
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
