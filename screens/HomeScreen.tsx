import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStats } from '../utils/storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [stats, setStats] = useState({ wins: 0, losses: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const savedStats = await getStats();
      setStats(savedStats);
    };
    const unsubscribe = navigation.addListener('focus', fetchStats);
    return unsubscribe;
  }, [navigation]);

  const totalGames = stats.wins + stats.losses;
  const winPercentage = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido al Wordle!</Text>

      {/* Gráfico circular manual */}
      {totalGames > 0 && (
        <View style={styles.chartContainer}>
          <View style={styles.chartBackground} />
          <View
            style={[
              styles.chartProgress,
              {
                transform: [
                  {
                    rotate: `${(winPercentage / 100) * 360}deg`,
                  },
                ],
              },
            ]}
          />
          <View style={styles.chartCenter}>
            <Text style={styles.percentageText}>{winPercentage}%</Text>
            <Text style={styles.percentageSubText}>Victorias</Text>
          </View>
        </View>
      )}

      {/* Estadísticas detalladas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalGames}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.winText]}>{stats.wins}</Text>
          <Text style={styles.statLabel}>Ganadas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.lossText]}>{stats.losses}</Text>
          <Text style={styles.statLabel}>Perdidas</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Game')}
      >
        <Text style={styles.buttonText}>Jugar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121213',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  // Estilos para el gráfico circular manual
  chartContainer: {
    width: 200,
    height: 200,
    marginBottom: 30,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 10,
    borderColor: '#ff3b30', // Rojo (derrotas) - Cambiado de gris a rojo
    position: 'absolute',
  },
  chartProgress: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 10,
    borderLeftColor: '#538d4e', // Verde (victorias)
    borderTopColor: '#538d4e',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    position: 'absolute',
    transform: [{ rotate: '0deg' }],
  },
  chartCenter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#121213',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  percentageSubText: {
    color: '#aaa',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  winText: {
    color: '#538d4e', // Verde (victorias)
  },
  lossText: {
    color: '#ff3b30', // Rojo (derrotas) - Cambiado de gris a rojo
  },
  button: {
    backgroundColor: '#538d4e',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});