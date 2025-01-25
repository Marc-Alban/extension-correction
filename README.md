# Correcteur Intelligent - Extension Chrome

Cette extension Chrome permet de corriger automatiquement l'orthographe et la grammaire des textes en français, en respectant les règles typographiques françaises.

## 🌟 Fonctionnalités

- Correction orthographique et grammaticale en français
- Respect des règles typographiques françaises
- Correction de la ponctuation
- Détection automatique des questions
- Préservation de la casse d'origine des mots
- Fonctionne sur tous les sites web

## 📁 Structure du projet

```
mon-app-internet/
├── manifest.json     # Configuration de l'extension
├── background.js     # Script de fond pour la logique de correction
├── content.js        # Script injecté dans les pages web
└── README.md         # Documentation
```

### Description des fichiers

- `manifest.json` : Fichier de configuration de l'extension qui définit :
  - Les permissions nécessaires
  - Les scripts à charger
  - Les API autorisées
  - Les métadonnées de l'extension

- `background.js` : Script principal qui contient :
  - La logique de correction avec LanguageTool
  - La gestion du menu contextuel
  - Les règles de correction françaises
  - La gestion de la ponctuation

- `content.js` : Script injecté dans les pages web qui :
  - Gère la sélection de texte
  - Applique les corrections
  - Communique avec le background script

## 🚀 Installation

1. Clonez ce dépôt ou téléchargez les fichiers
```bash
git clone [URL_DU_REPO]
```

2. Ouvrez Chrome et accédez aux extensions
   - Tapez `chrome://extensions/` dans la barre d'adresse
   - Ou Menu → Plus d'outils → Extensions

3. Activez le "Mode développeur" (en haut à droite)

4. Cliquez sur "Charger l'extension non empaquetée"

5. Sélectionnez le dossier `mon-app-internet`

## 💡 Utilisation

1. Sélectionnez le texte que vous souhaitez corriger sur n'importe quelle page web

2. Faites un clic droit sur la sélection

3. Cliquez sur "Corriger le texte" dans le menu contextuel

4. Le texte sera automatiquement corrigé en respectant :
   - L'orthographe
   - La grammaire
   - La ponctuation française
   - La casse d'origine des mots

## 🔧 Configuration technique

### Permissions requises
- `contextMenus` : Pour ajouter l'option de correction dans le menu contextuel
- `activeTab` : Pour accéder au contenu de l'onglet actif

### API utilisées
- LanguageTool API : `https://api.languagetool.org/v2/check`
  - Utilisée pour la correction orthographique et grammaticale
  - Gratuite pour un usage modéré

## 🔍 Fonctionnement détaillé

1. **Sélection du texte**
   - Le `content.js` surveille les sélections de texte
   - Stocke la dernière sélection et sa position

2. **Correction**
   - Le `background.js` envoie le texte à LanguageTool
   - Applique les corrections courantes en français
   - Gère la ponctuation et la casse

3. **Remplacement**
   - Le `content.js` reçoit le texte corrigé
   - Remplace le texte sélectionné par sa version corrigée
   - Préserve le formatage du document

## ⚠️ Limitations connues

- Ne fonctionne pas dans les champs de texte sécurisés
- Peut avoir des limitations de requêtes avec l'API LanguageTool gratuite
- Certains sites web peuvent bloquer les modifications de texte

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 