import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { LayoutRectangle, findNodeHandle, UIManager } from 'react-native';

type Props = {
  onKeyPress: (key: string) => void;
  disabledKeys?: string[];
};

const VARIANTS_MAP: Record<string, string[]> = {
  A: ['Á'],
  E: ['É'],
  I: ['Í'],
  O: ['Ó'],
  U: ['Ú'],
};

const KEYS_ROW_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O' , 'P'];
const KEYS_ROW_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L' ,'Ñ'];
const KEYS_ROW_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

export function Keyboard({ onKeyPress, disabledKeys = [] }: Props) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupKeys, setPopupKeys] = useState<string[]>([]);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const handleLongPress = (key: string, ref: any) => {
    if (disabledKeys.includes(key)) return;
    
    if (VARIANTS_MAP[key]) {
      const handle = findNodeHandle(ref.current);
      if (handle) {
        UIManager.measure(handle, (_x, _y, _w, _h, pageX, pageY) => {
          setPopupPosition({ x: pageX, y: pageY });
          setPopupKeys(VARIANTS_MAP[key]);
          setPopupVisible(true);
        });
      }
    } else {
      onKeyPress(key);
    }
  };

  const handlePress = (key: string) => {
    if (popupVisible || disabledKeys.includes(key)) return;
    onKeyPress(key);
  };

  const renderKey = (key: string) => {
    const keyRef = React.createRef<any>();
    const isDisabled = disabledKeys.includes(key);

    return (
      <TouchableOpacity
        key={key}
        ref={keyRef}
        onPress={() => handlePress(key)}
        onLongPress={() => !isDisabled && handleLongPress(key, keyRef)}
        delayLongPress={300}
        style={[styles.key, isDisabled && styles.disabledKey]}
        activeOpacity={0.7}
        disabled={isDisabled}
      >
        <Text style={[styles.keyText, isDisabled && styles.disabledKeyText]}>{key}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>{KEYS_ROW_1.map(renderKey)}</View>
        <View style={styles.row}>{KEYS_ROW_2.map(renderKey)}</View>
        <View style={styles.row}>{KEYS_ROW_3.map(renderKey)}</View>
        <View style={styles.rowSpecial}>
          <TouchableOpacity
            onPress={() => onKeyPress('DELETE')}
            style={[styles.key, styles.specialKey, { marginRight: 20 }]}
          >
            <Text style={styles.keyText}>⌫</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onKeyPress('ENTER')}
            style={[styles.key, styles.specialKey, { marginLeft: 20 }]}
          >
            <Text style={styles.keyText}>⏎</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={popupVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setPopupVisible(false)}>
          <View style={StyleSheet.absoluteFillObject}>
            {popupPosition && (
              <View
                style={[
                  styles.popupContainer,
                  {
                    position: 'absolute',
                    top: popupPosition.y - 110,
                    left: popupPosition.x - 15,
                  },
                ]}
              >
                {popupKeys.map((k) => (
                  <TouchableOpacity
                    key={k}
                    onPress={() => {
                      onKeyPress(k);
                      setPopupVisible(false);
                    }}
                    style={[styles.popupKey, disabledKeys.includes(k) && styles.disabledKey]}
                    activeOpacity={0.7}
                    disabled={disabledKeys.includes(k)}
                  >
                    <Text style={[styles.keyText, disabledKeys.includes(k) && styles.disabledKeyText]}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
  },
  rowSpecial: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 24,
    gap: 40
  },
  key: {
    width: 35,
    height: 55,
    marginHorizontal: 2,
    marginVertical: 2,
    backgroundColor: '#818384',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    // Efecto 3D con bordes
    borderBottomWidth: 4,
    borderBottomColor: '#5a5a5a',
    borderRightWidth: 2,
    borderRightColor: '#6a6a6a',
    borderLeftWidth: 1,
    borderLeftColor: '#a0a0a0',
    borderTopWidth: 0.5,
    borderTopColor: '#b0b0b0',
},
  specialKey: {
    width: 60,
    backgroundColor: '#565758',
  },
  keyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledKey: {
    backgroundColor: '#555555ff',
    opacity: 0.5,
  },
  disabledKeyText: {
    color: '#f7f7f7ff',
  },
  popupContainer: {
    flexDirection: 'row',
    backgroundColor: '#121213',
    borderRadius: 8,
    padding: 10,
  },
  popupKey: {
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#818384',
    borderRadius: 6,
  },
});