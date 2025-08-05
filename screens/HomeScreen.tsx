import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, NavigationProp, useTheme } from '@react-navigation/native';
import { getStats } from '../utils/storage';

type RootStackParamList = {
  Home: undefined;
  Game: undefined;
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [stats, setStats] = useState({ wins: 0, losses: 0 });

  const { width } = Dimensions.get('window');
  const chartSize = width * 0.5;
  const chartCenterSize = chartSize * 0.7;
  const borderRadius = chartSize / 2;

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: 20,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      marginBottom: 30,
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
    },
    chartContainer: {
      width: chartSize,
      height: chartSize,
      marginBottom: 30,
      position: 'relative' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    chartBackground: {
      width: '100%' as const,
      height: '100%' as const,
      borderRadius,
      borderWidth: 10,
      borderColor: colors.notification || '#ff3b30',
      position: 'absolute' as const,
    },
    chartProgress: {
      width: '100%' as const,
      height: '100%' as const,
      borderRadius,
      borderWidth: 10,
      borderLeftColor: colors.primary || '#538d4e',
      borderTopColor: colors.primary || '#538d4e',
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      position: 'absolute' as const,
      transform: [{ rotate: '0deg' }],
    },
    chartCenter: {
      width: chartCenterSize,
      height: chartCenterSize,
      borderRadius: chartCenterSize / 2,
      backgroundColor: colors.background,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    percentageText: {
      color: colors.text,
      fontSize: 32,
      fontWeight: 'bold' as const,
    },
    percentageSubText: {
      color: colors.border || '#aaa',
      fontSize: 16,
    },
    statsContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'space-around' as const,
      width: '100%' as const,
      marginBottom: 40,
    },
    statItem: {
      alignItems: 'center' as const,
    },
    statNumber: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold' as const,
      marginBottom: 5,
    },
    statLabel: {
      color: colors.border || '#aaa',
      fontSize: 16,
    },
    winText: {
      color: colors.primary || '#538d4e',
    },
    lossText: {
      color: colors.notification || '#ff3b30',
    },
    button: {
      backgroundColor: colors.primary || '#538d4e',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 8,
    },
    buttonText: {
      color: colors.card || 'white',
      fontSize: 20,
      fontWeight: 'bold' as const,
    },
  };

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
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>¡Bienvenido al Wordle!</Text>

      {/* Gráfico circular manual */}
      {totalGames > 0 && (
        <View style={dynamicStyles.chartContainer}>
          <View style={dynamicStyles.chartBackground} />
          <View
            style={[
              dynamicStyles.chartProgress,
              {
                transform: [{ rotate: `${(winPercentage / 100) * 360}deg` }],
              },
            ]}
          />
          <View style={dynamicStyles.chartCenter}>
            <Text style={dynamicStyles.percentageText}>{winPercentage}%</Text>
            <Text style={dynamicStyles.percentageSubText}>Victorias</Text>
          </View>
        </View>
      )}

      <View style={dynamicStyles.statsContainer}>
        <View style={dynamicStyles.statItem}>
          <Text style={dynamicStyles.statNumber}>{totalGames}</Text>
          <Text style={dynamicStyles.statLabel}>Total</Text>
        </View>
        <View style={dynamicStyles.statItem}>
          <Text style={[dynamicStyles.statNumber, dynamicStyles.winText]}>{stats.wins}</Text>
          <Text style={dynamicStyles.statLabel}>Ganadas</Text>
        </View>
        <View style={dynamicStyles.statItem}>
          <Text style={[dynamicStyles.statNumber, dynamicStyles.lossText]}>{stats.losses}</Text>
          <Text style={dynamicStyles.statLabel}>Perdidas</Text>
        </View>
      </View>

      <TouchableOpacity
        style={dynamicStyles.button}
        onPress={() => navigation.navigate('Game')}
      >
        <Text style={dynamicStyles.buttonText}>Jugar</Text>
      </TouchableOpacity>
    </View>
  );
}
