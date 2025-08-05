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
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      marginBottom: 30,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    chartContainer: {
      width: chartSize,
      height: chartSize,
      marginBottom: 30,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    chartBackground: {
      width: '100%',
      height: '100%',
      borderRadius,
      borderWidth: 10,
      borderColor: colors.homeSecondary,
      position: 'absolute',
    },
    chartProgress: {
      width: '100%',
      height: '100%',
      borderRadius,
      borderWidth: 10,
      borderLeftColor: colors.homePrimary,
      borderTopColor: colors.homePrimary,
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      position: 'absolute',
      transform: [{ rotate: '0deg' }],
    },
    chartCenter: {
      width: chartCenterSize,
      height: chartCenterSize,
      borderRadius: chartCenterSize / 2,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    percentageText: {
      color: colors.text,
      fontSize: 32,
      fontWeight: 'bold',
    },
    percentageSubText: {
      color: colors.homeTextSecondary,
      fontSize: 16,
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 40,
      paddingHorizontal: 20,
    },
    statItem: {
      alignItems: 'center',
      minWidth: '30%',
    },
    statNumber: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    statLabel: {
      color: colors.homeTextSecondary,
      fontSize: 16,
      textAlign: 'center',
    },
    winText: {
      color: colors.homePrimary,
    },
    lossText: {
      color: colors.homeSecondary,
    },
    button: {
      backgroundColor: colors.homePrimary,
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 8,
      alignSelf: 'center',
    },
    buttonText: {
      color: colors.homeButtonText,
      fontSize: 20,
      fontWeight: 'bold',
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