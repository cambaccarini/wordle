import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { validWords } from '../words/validWords';
import { Keyboard } from '../components/Keyboard';
import { updateStats } from '../utils/storage';
import { useTheme } from '@react-navigation/native';

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

type LetterColor = 'correct' | 'present' | 'absent';

function getLetterColors(guess: string, wordToGuess: string): LetterColor[] {
  const colors: LetterColor[] = Array(guess.length).fill('absent');
  const wordLetterCount: Record<string, number> = {};

  for (const letter of wordToGuess) {
    wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === wordToGuess[i]) {
      colors[i] = 'correct';
      wordLetterCount[guess[i]]!--;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (colors[i] === 'correct') continue;
    if (wordLetterCount[guess[i]] > 0) {
      colors[i] = 'present';
      wordLetterCount[guess[i]]!--;
    }
  }

  return colors;
}

export default function GameScreen() {
  const { colors } = useTheme();
  const [wordToGuess, setWordToGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [disabledKeys, setDisabledKeys] = useState<string[]>([]);

  const dynamicStyles = {
    container: {
      paddingTop: 50,
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center' as const,
      justifyContent: 'flex-start' as const,
    },
    cell: {
      width: 50,
      height: 50,
      borderWidth: 2,
      borderColor: colors.border || '#3a3a3c',
      margin: 4,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: colors.background,
    },
    cellText: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold' as const,
    },
  };

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setWordToGuess(validWords[randomIndex].toLowerCase());
    setGuesses([]);
    setCurrentGuess('');
    setDisabledKeys([]);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const updateDisabledKeys = (guess: string, colors: LetterColor[]) => {
    const newDisabledKeys = new Set(disabledKeys);
    
    guess.split('').forEach((letter, i) => {
      const upperLetter = letter.toUpperCase();
      
      // Solo considerar letras marcadas como ausentes
      if (colors[i] === 'absent') {
        // Para vocales, verificar si existe versión acentuada en la palabra
        if (['A', 'E', 'I', 'O', 'U'].includes(upperLetter)) {
          // Verificar si la palabra contiene alguna versión acentuada de esta vocal
          const hasAccentedVariant = wordToGuess.split('').some(l => {
            const normalizedLetter = l.normalize("NFD")[0].toUpperCase();
            return normalizedLetter === upperLetter && l !== letter;
          });
          
          // Solo bloquear si no hay variante acentuada
          if (!hasAccentedVariant) {
            newDisabledKeys.add(upperLetter);
          }
        } else {
          // Para no vocales, bloquear directamente
          newDisabledKeys.add(upperLetter);
        }
      }
    });

    setDisabledKeys(Array.from(newDisabledKeys));
  };

  const handleKeyPress = async (key: string) => {
    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) return;

      const nextGuesses = [...guesses, currentGuess];
      const colors = getLetterColors(currentGuess, wordToGuess);

      updateDisabledKeys(currentGuess, colors);

      setGuesses(nextGuesses);
      setCurrentGuess('');

      if (currentGuess === wordToGuess) {
        await updateStats(true);
        Alert.alert('¡Ganaste!', `La palabra era "${wordToGuess.toUpperCase()}"`, [
          { text: 'Jugar de nuevo', onPress: resetGame },
        ]);
      } else if (nextGuesses.length === MAX_ATTEMPTS) {
        await updateStats(false);
        Alert.alert('Perdiste :(', `La palabra era "${wordToGuess.toUpperCase()}"`, [
          { text: 'Intentar otra vez', onPress: resetGame },
        ]);
      }

      return;
    }

    if (key === 'DELETE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (currentGuess.length < WORD_LENGTH && /^[A-ZÑÁÉÍÓÚ]$/.test(key)) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  };

  const renderCell = (letter: string, color: LetterColor, index: number) => {
    let backgroundColor = colors.background;
    if (color === 'correct') backgroundColor = '#538d4e';
    else if (color === 'present') backgroundColor = '#b59f3b';
    else if (color === 'absent') backgroundColor = colors.card || '#3a3a3c';

    return (
      <View key={index} style={[dynamicStyles.cell, { backgroundColor }]}>
        <Text style={dynamicStyles.cellText}>{letter.toUpperCase()}</Text>
      </View>
    );
  };

  const renderRow = (word: string, index: number) => {
    const colors =
      index < guesses.length
        ? getLetterColors(word, wordToGuess)
        : Array(word.length).fill('absent');

    return (
      <View key={index} style={styles.row}>
        {[...Array(WORD_LENGTH)].map((_, i) =>
          renderCell(word[i] ?? '', colors[i], i)
        )}
      </View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      {[...Array(MAX_ATTEMPTS)].map((_, i) =>
        renderRow(guesses[i] ?? (i === guesses.length ? currentGuess : ''), i)
      )}
      <Keyboard onKeyPress={handleKeyPress} disabledKeys={disabledKeys} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
});
