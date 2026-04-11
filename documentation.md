# DocSlot - Application Mobile de Gestion de Rendez-vous Médicaux

## Aperçu Général
DocSlot est une application React Native (v0.84.1) pour la prise de rendez-vous médicaux. Elle supporte trois rôles utilisateurs : **Patient**, **Médecin** et **Administrateur**. L'authentification est obligatoire avant accès aux fonctionnalités principales.

### Architecture
- **Navigation** : React Navigation (Stack, Tabs, Drawer) avec `rootNavigator.tsx` comme point d'entrée.
  - Auth → PatientTabs / MedecinTabs / AdminDrawer.
- **Composants réutilisables** : `src/componnents/` (C_Button, C_Modal, C_InputFields, etc.).
- **Services API** : Axios (`axiosIstance.js`) pour auth, users, RDV, disponibilités, notifications.
- **Écrans principaux** :
  | Rôle       | Écrans clés                          |
  |------------|--------------------------------------|
  | Patient   | DashboardPatient, MesRdv, AddRdv, Notifications |
  | Médecin   | DashboardMedecin, CreneauxMedecin, MesRdv, Disponnibilites |
  | Admin     | DashboardAdmin, GestionUsers/Patients |
- **Dépendances clés** : React Navigation, React Native Paper, Reanimated, Calendars, Element Dropdown.

### Fonctionnalités Principales
1. **Authentification** : Login/Register (`authNavigator.tsx`).
2. **Patient** : Recherche médecins disponibles, prise RDV, historique RDV, notifications.
3. **Médecin** : Gestion créneaux/disponibilités, liste RDV.
4. **Admin** : Dashboard stats, gestion utilisateurs (médecins/patients).
5. **Notifications** : Service dédié (`notificationsService.js`).

### Installation & Lancement
```bash
npm install
npx react-native run-android  # ou run-ios
```

### Structure des Dossiers
```
src/
├── navigation/     # Navigators par rôle
├── screens/        # Écrans par rôle
├── services/       # API calls (auth, rdv, user...)
├── componnents/    # UI réutilisables
└── store/          # Gestion tokens
```

Application prête pour production mobile (Android/iOS). Code modulaire, validé par ESLint/Prettier.
