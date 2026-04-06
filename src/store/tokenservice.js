import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = '@uth_tk001';

/**
 * Sauvegarder le token JWT en stockage sécurisé
 */
export const saveToken = async (token) => {
  try {
    await Keychain.setGenericPassword('token', token, {
      service: SERVICE_NAME,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
    return true;
  } catch (error) {
    console.log('Erreur saveToken:', error);
    return false;
  }
};

/**
 * Récupérer le token JWT
 */
export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE_NAME,
    });

    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.log('Erreur getToken:', error);
    return null;
  }
};

/**
 * Vérifier si un token existe
 */
export const hasToken = async () => {
  const token = await getToken();
  return !!token;
};

/**
 * Supprimer le token (logout)
 */
export const deleteToken = async () => {
  try {
    await Keychain.resetGenericPassword({
      service: SERVICE_NAME,
    });
    return true;
  } catch (error) {
    console.log('Erreur deleteToken:', error);
    return false;
  }
};