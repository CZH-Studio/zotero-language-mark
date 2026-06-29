# Zotero Language Mark

[![zotero target version](https://img.shields.io/badge/Zotero-9-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)

[简体中文](../README.md) | [English](./README-enUS.md) | [Français](./README-frFR.md)

Une extension Zotero pour définir en masse le champ « Langue » des notices.

## Fonctionnalités

- **Sélection de la langue** : Choisissez parmi des codes de langue prédéfinis (en, zh-CN, ja, fr, de, etc.) ou saisissez un code personnalisé
- **Définition automatique à l'import** : Lorsqu'elle est activée, les nouvelles notices importées reçoivent automatiquement le champ langue défini
- **Définition par lot** : Définissez le champ langue de toutes les notices en un clic
  - Par défaut, ne modifie que les notices dont le champ langue est vide
  - Cochez « Écraser les valeurs existantes » pour tout remplacer

![Interface des paramètres](../image/UI-enUS.png)

## Installation et configuration

### Installation

1. Téléchargez le dernier fichier `.xpi` depuis [Releases](https://github.com/CZH-Studio/zotero-language-mark/releases)
2. Dans Zotero, allez dans `Outils → Extensions → Icône d'engrenage → Installer un module depuis un fichier...`
3. Sélectionnez le fichier `.xpi` téléchargé et installez-le
4. Redémarrez Zotero

### Utilisation

1. Ouvrez `Outils → Extensions`, trouvez **Zotero Language Mark**, cliquez sur `Préférences`
2. Choisissez une langue dans le menu déroulant ou sélectionnez « Custom... » pour saisir un code personnalisé
3. **Définition par lot** : Cliquez sur le bouton en bas pour appliquer la langue cible à toutes les notices
4. **Définition automatique** : Cochez « Automatically set language on import » pour appliquer automatiquement à toutes les nouvelles notices

### Développement

```sh
cp .env.example .env
# Modifiez .env pour définir ZOTERO_PLUGIN_ZOTERO_BIN_PATH et ZOTERO_PLUGIN_PROFILE_PATH
npm install
npm start
```

## Licence

AGPL-3.0-or-later
