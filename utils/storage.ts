import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = 'wordle_stats';

type Stats = {
  wins: number;
  losses: number;
};

export const getStats = async (): Promise<Stats> => {
  const json = await AsyncStorage.getItem(STATS_KEY);
  if (json) return JSON.parse(json);
  return { wins: 0, losses: 0 };
};

export const updateStats = async (won: boolean) => {
  const stats = await getStats();
  const updatedStats = {
    wins: stats.wins + (won ? 1 : 0),
    losses: stats.losses + (won ? 0 : 1),
  };
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
};
