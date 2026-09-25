export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// Frontend'in src/utils/validationSchemas.js ve src/constants/boardIcons.js dosyalarıyla
// birebir aynı kalmalı; biri değişirse diğeri de değişmeli.
export const PRIORITIES = ['without', 'low', 'medium', 'high'];

export const BOARD_ICONS = [
  'icon-project',
  'icon-star',
  'icon-loading',
  'icon-puzzle',
  'icon-container',
  'icon-lightning',
  'icon-colors',
  'icon-hexagon',
];

export const BOARD_BACKGROUNDS = [
  '',
  '/bg/bg1.svg',
  '/bg/bg2.svg',
  '/bg/bg3.svg',
  '/bg/bg4.svg',
  '/bg/bg5.svg',
  '/bg/bg6.svg',
  '/bg/bg7.svg',
  '/bg/bg8.svg',
];

// Frontend'in src/context/ThemeContext.jsx dosyasıyla birebir aynı kalmalı.
export const THEMES = ['dark', 'light', 'violet'];
