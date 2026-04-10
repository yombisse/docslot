// Calculer l'heure de fin d'un créneau selon la durée du médecin
const getEndTime = (startTime, duree) => {
  const [h, m, s] = startTime.split(':').map(Number);
  const date = new Date(1970, 0, 1, h, m, s);
  date.setMinutes(date.getMinutes() + duree);
  return date.toTimeString().slice(0,5); // HH:MM
};

export {getEndTime};