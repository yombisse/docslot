import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import C_button from './C_button';
import C_inputfields from './C_inputfields';
type Detail = { label: string; value: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  title?: string;
  details?: Detail[];
  confirmText?: string;
  cancelText?: string;
  showInput?: boolean;          // si on veut un champ motif à remplir
  inputPlaceholder?: string;
};

const ModalGeneric = ({
  visible,
  onClose,
  onConfirm,
  title = 'Confirmer ?',
  details = [],
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  showInput = false,
  inputPlaceholder = '',
}: Props) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>

          {details.map((d, idx) => (
            <Text key={idx} style={styles.text}>
              {d.label}: {d.value}
            </Text>
          ))}

          {showInput && (
            <C_inputfields
              placeholder={inputPlaceholder}
              value={inputValue}
              onChangeText={setInputValue}
            />
          )}

          <View style={styles.actionRow}>
            <C_button
              title={confirmText}
              onPress={() => onConfirm(showInput ? inputValue : undefined)}
              style={styles.confirmButton}
            />
            <C_button title={cancelText} onPress={onClose} style={styles.cancelButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalGeneric;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    width: 100,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  confirmButton: {
    width: 100,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2BB673',
  },
});