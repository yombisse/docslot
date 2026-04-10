export function validate(fields, config) {
  for (const key in config) {
    const value = fields[key];
    const rules = config[key];

    // Champ obligatoire
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `Le champ "${rules.label}" est obligatoire`;
    }

    // Email
    if (rules.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return `Le champ "${rules.label}" est invalide`;
      }
    }

    // Téléphone
    if (rules.type === 'phone') {
      const phoneRegex = /^[0-9]{8,15}$/;
      if (value && !phoneRegex.test(value)) {
        return `Le champ "${rules.label}" est invalide`;
      }
    }

    // Longueur minimale (ex: password)
    if (rules.minLength && value.length < rules.minLength) {
      return `Le champ "${rules.label}" doit contenir au moins ${rules.minLength} caractères`;
    }
  }

  return null;
}