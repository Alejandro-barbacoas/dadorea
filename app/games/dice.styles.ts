import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Color de fondo principal
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  infoIconContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, 
  },
  infoIconText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  infoContainer: {
    position: 'absolute',
    top: 90,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    zIndex: 9,
  },
  // Estilos del contenedor del dado con recuadro
  diceContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    // El recuadro que pediste:
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)', // Un fondo muy sutil para el área
    padding: 10, // Un poco de espacio interno
  },
  freeModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5, // Reducido un poco para ajustar al nuevo padding
  },
  freeModeText: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  resultContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultLabel: {
    fontSize: 20,
    color: '#555',
  },
  resultNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  rollingText: {
    fontSize: 24,
    color: '#888',
  },
  rollButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 20,
  },
  rollButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  rollButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'left',
  },
});
