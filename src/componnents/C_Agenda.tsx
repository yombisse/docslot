import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

export type Slot = {
  time?: string;   // optionnel
  [key: string]: any; // n'importe quelles données
};

type Props = {
  items: { [date: string]: Slot[] };      // agenda regroupé par date
  renderSlot: (slot: Slot) => JSX.Element; // comment afficher un slot
  initialDate?: string;                    // jour sélectionné au départ
};

export default function C_AgendaPlanner({ items, renderSlot, initialDate }: Props) {
  const dates = useMemo(() => Object.keys(items).sort(), [items]);
  const [selectedDate, setSelectedDate] = useState(initialDate || dates[0] || '');

  const currentItems = items[selectedDate] || [];

  // Préparer les marqueurs pour le calendrier
  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};
    Object.keys(items).forEach(date => {
      marks[date] = { marked: true, dotColor: '#2BB673' }; // tous les jours avec des slots
    });
    if (selectedDate) {
      marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true, selectedColor: '#2BB673' };
    }
    return marks;
  }, [items, selectedDate]);

  return (
    <View style={styles.container}>
      {/* Calendrier générique */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#2BB673',
          arrowColor: '#2BB673',
        }}
      />

      {/* Liste des slots générique */}
      <FlatList
        data={currentItems}
        keyExtractor={(_, index) => `${selectedDate}-${index}`}
        style={styles.list}
        renderItem={({ item }) => renderSlot(item)}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun élément</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { flex: 1, padding: 10 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: '#999' },
});