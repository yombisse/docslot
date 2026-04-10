// Format YYYY-MM-DD
export function formateDate(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

// Format HH:MM
export function formateTime(time) {
  if (!time) return '00:00';
  const [hours = '00', minutes = '00'] = time.split(':');
  return `${hours.padStart(2,'0')}:${minutes.padStart(2,'0')}`;
}

// src/utils/formateDate.tsx

// src/utils/formateDate.tsx

// ✅ Formate une date au format YYYY-MM-DD
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// ✅ Formate une heure au format HH:MM (sans secondes)
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};
// Force le format YYYY-MM-DD pour clé d'agenda
export function normalizeDateKey(rawDate) {
  const d = new Date(rawDate);
  return isNaN(d.getTime()) ? '1970-01-01' : d.toISOString().split('T')[0];
}

// Force le format HH:MM pour clé d'agenda
export function normalizeTime(rawTime) {
  if (!rawTime) return '00:00';
  const [hours = '00', minutes = '00'] = rawTime.split(':');
  return `${hours.padStart(2,'0')}:${minutes.padStart(2,'0')}`;
}

// Construire les items pour l'agenda
export function buildAgendaItems(data, mapFn) {
  const agendaItems = {};

  data.forEach(item => {
    const mapped = mapFn(item);
    const dateKey = normalizeDateKey(mapped.date);

    if (!agendaItems[dateKey]) agendaItems[dateKey] = [];

    agendaItems[dateKey].push({
      ...mapped,
      time: normalizeTime(mapped.time),
    });
  });

  // Trier les heures
  Object.keys(agendaItems).forEach(date => {
    agendaItems[date].sort((a, b) => a.time.localeCompare(b.time));
  });

  return agendaItems;
}