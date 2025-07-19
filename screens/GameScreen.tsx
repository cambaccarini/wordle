import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { validWords } from '../words/validWords';
import { Keyboard } from '../components/Keyboard';

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;
type LetterColor = 'correct' | 'present' | 'absent';
function getLetterColors(guess: string, wordToGuess: string): LetterColor[] {
  const colors: LetterColor[] = Array(guess.length).fill('absent');
  const wordLetterCount: Record<string, number> = {};

  // Contar letras de la palabra secreta
  for (const letter of wordToGuess) {
    wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
  }

  // Marcar verdes
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === wordToGuess[i]) {
      colors[i] = 'correct';
      wordLetterCount[guess[i]]!--;
    }
  }

  // Marcar amarillas 
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
  const [wordToGuess, setWordToGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState(''); 
  const resetGame = () => {
  const randomIndex = Math.floor(Math.random() * validWords.length);
  setWordToGuess(validWords[randomIndex].toLowerCase());
  setGuesses([]);
  setCurrentGuess('');
};

  // Elegir palabra aleatoria al iniciar
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setWordToGuess(validWords[randomIndex].toLowerCase());
  }, []);

  const handleKeyPress = (key: string) => {
    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) return;

      const nextGuesses = [...guesses, currentGuess];
      setGuesses(nextGuesses);
      setCurrentGuess('');

      if (currentGuess === wordToGuess) {
        Alert.alert('¡Ganaste!', `La palabra era "${wordToGuess.toUpperCase()}"`, [
    { text: 'Jugar de nuevo', onPress: resetGame }
  ]);
      } else if (nextGuesses.length === MAX_ATTEMPTS) {
        Alert.alert('Perdiste :(', `La palabra era "${wordToGuess.toUpperCase()}"`, [
    { text: 'Intentar otra vez', onPress: resetGame }
  ]);
      }

      return;
    }

    if (key === 'DELETE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

if (
  currentGuess.length < WORD_LENGTH &&
  /^[A-ZÑÁÉÍÓÚ]$/.test(key)
) {
    setCurrentGuess(prev => prev + key.toLowerCase());
    }
  };

const renderCell = (letter: string, color: LetterColor, index: number) => {
  let backgroundColor = '#121213'; 

  if (color === 'correct') backgroundColor = '#538d4e';
  else if (color === 'present') backgroundColor = '#b59f3b'; 
  else if (color === 'absent') backgroundColor = '#3a3a3c'; 

  return (
    <View key={index} style={[styles.cell, { backgroundColor }]}>
      <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
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
    <View style={styles.container}>
      {[...Array(MAX_ATTEMPTS)].map((_, i) =>
        renderRow(guesses[i] ?? (i === guesses.length ? currentGuess : ''), i)
      )}
      <Keyboard onKeyPress={handleKeyPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#121213',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#3a3a3c',
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121213',
  },
  cellText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
