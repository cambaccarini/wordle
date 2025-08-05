import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

export const GAME_COLORS = {
  correct: '#6aaa64',   // Verde (acierto)
  present: '#c9b458',   // Amarillo (letra correcta, posición incorrecta)
  absent: '#787c7e',    // Gris (incorrecto)
};

export const LightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: '#ffffff',          // Fondo general
    text: '#000000',                // Texto
    popupBackground: '#f2f2f2',     // Modales o popups
    emptyTile: '#d3d6da',           // Casilla vacía clara
    // Colores específicos para HomeScreen
    homePrimary: '#538d4e',        // Verde para victorias (más oscuro que GAME_COLORS.correct)
    homeSecondary: '#ff3b30',       // Rojo para derrotas
    homeBorder: '#d8d8d8',         // Borde claro
    homeTextSecondary: '#666666',   // Texto secundario
    homeButtonText: '#ffffff',      // Texto del botón
  },
};

export const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: '#121213',          // Fondo general
    text: '#ffffff',                // Texto
    popupBackground: '#2c2c2c',     // Modales o popups
    emptyTile: '#3a3a3c',           // Casilla vacía oscura
    // Colores específicos para HomeScreen
    homePrimary: '#6aaa64',         // Verde para victorias (igual a GAME_COLORS.correct)
    homeSecondary: '#ff3b30',       // Rojo para derrotas
    homeBorder: '#444444',          // Borde oscuro
    homeTextSecondary: '#aaaaaa',    // Texto secundario
    homeButtonText: '#ffffff',       // Texto del botón
  },
};