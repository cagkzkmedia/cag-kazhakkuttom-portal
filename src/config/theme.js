// CAG Portal Theme Configuration
// This file contains all color definitions and theme variables used across the application

const theme = {
  // Primary Brand Colors
  primary: {
    main: '#667eea',        // Primary purple
    dark: '#764ba2',        // Dark purple/violet
    light: '#7c8aed',       // Light purple
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientReverse: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    gradientHorizontal: 'linear-gradient(to right, #667eea, #764ba2)',
    gradient90: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  },

  // Secondary Colors
  secondary: {
    yellow: '#ffeaa7',
    yellowDark: '#fdcb6e',
    gold: '#FFD700',
    goldDark: '#FFC700',
    goldAntique: '#D4AF37',
    goldBronze: '#B8956A',
    green: '#48bb78',
    greenDark: '#38a169',
    greenBright: '#22c55e',
    greenSuccess: '#16a34a',
    greenLime: '#84cc16',
    whatsapp: '#25D366',
    whatsappDark: '#128C7E',
    cyan: '#06b6d4',
    blue: '#0284c7',
    skyBlue: '#3498db',
    skyBlueDark: '#2980b9',
    amber: '#fbbf24',
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    offWhite: '#f0e6ff',
    black: '#000000',
    gray50: '#f7fafc',
    gray100: '#edf2f7',
    gray200: '#e2e8f0',
    gray300: '#cbd5e0',
    gray400: '#a0aec0',
    gray500: '#718096',
    gray600: '#4a5568',
    gray700: '#2d3748',
    gray800: '#1a202c',
    gray900: '#2c3e50',
    grayLight: '#f1f1f1',
    grayBorder: '#f3f3f3',
    grayText: '#4a5568',
    grayIcon: '#718096',
    graySubtle: '#e5e7eb',
    grayDark: '#2d3748',
    grayDarker: '#1a202c',
    grayMuted: '#999',
    grayDim: '#666',
    grayDim2: '#333',
  },

  // Opacity Variants (RGBA)
  opacity: {
    // White variants
    white10: 'rgba(255, 255, 255, 0.1)',
    white15: 'rgba(255, 255, 255, 0.15)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white30: 'rgba(255, 255, 255, 0.3)',
    white50: 'rgba(255, 255, 255, 0.5)',
    white60: 'rgba(255, 255, 255, 0.6)',
    white65: 'rgba(255, 255, 255, 0.65)',
    white70: 'rgba(255, 255, 255, 0.7)',
    white80: 'rgba(255, 255, 255, 0.8)',
    white85: 'rgba(255, 255, 255, 0.85)',
    white90: 'rgba(255, 255, 255, 0.9)',
    white95: 'rgba(255, 255, 255, 0.95)',
    white98: 'rgba(255, 255, 255, 0.98)',

    // Black variants
    black10: 'rgba(0, 0, 0, 0.1)',
    black15: 'rgba(0, 0, 0, 0.15)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black30: 'rgba(0, 0, 0, 0.3)',
    black40: 'rgba(0, 0, 0, 0.4)',
    black45: 'rgba(0, 0, 0, 0.45)',
    black50: 'rgba(0, 0, 0, 0.5)',
    black60: 'rgba(0, 0, 0, 0.6)',
    black75: 'rgba(0, 0, 0, 0.75)',
    black80: 'rgba(0, 0, 0, 0.8)',
    black92: 'rgba(0, 0, 0, 0.92)',

    // Primary color variants
    primary5: 'rgba(102, 126, 234, 0.05)',
    primary10: 'rgba(102, 126, 234, 0.1)',
    primary88: 'rgba(102, 126, 234, 0.88)',
    primaryDark88: 'rgba(118, 75, 162, 0.88)',
    primaryDark5: 'rgba(118, 75, 162, 0.05)',
    primaryDark90: 'rgba(118, 75, 162, 0.9)',
  },

  // Gradients
  gradients: {
    hero: 'linear-gradient(135deg, rgba(102, 126, 234, 0.88) 0%, rgba(118, 75, 162, 0.88) 100%)',
    heroDark: 'linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 0.4) 85%, transparent 100%)',
    whiteToOffWhite: 'linear-gradient(to right, #ffffff, #f0e6ff)',
    whiteToGray: 'linear-gradient(to bottom, #ffffff, #f7fafc)',
    grayLight: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    grayLightAlt: 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryReverse: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    primaryHorizontal: 'linear-gradient(to right, #667eea, #764ba2)',
    primarySubtle: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
    primarySubtleAlt: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent)',
    primaryWithTransparent: 'linear-gradient(to right, transparent, #667eea, transparent)',
    yellow: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
    gold: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    goldCard: 'linear-gradient(135deg, #FFD700, #FFC700, #FFD700)',
    goldAlt: 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)',
    green: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    greenBright: 'linear-gradient(90deg, #22c55e, #16a34a)',
    whatsapp: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    whatsappAlt: 'linear-gradient(135deg, #25d366, #128c7e)',
    blue: 'linear-gradient(135deg, #3498db, #2980b9)',
    dark: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
    whiteCard: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    glassWhite: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
    radialWhite: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
    radialWhiteAlt: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
    radialOverlay: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    radialDark: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
    shimmer: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
  },

  // Background Colors
  backgrounds: {
    body: '#ffffff',
    page: '#f7fafc',
    card: '#ffffff',
    hover: '#f7fafc',
    hoverDark: '#edf2f7',
    active: '#f7fafc',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayDark: 'rgba(0, 0, 0, 0.75)',
    overlayDarker: 'rgba(0, 0, 0, 0.8)',
    glass: 'rgba(255, 255, 255, 0.95)',
    glassLight: 'rgba(255, 255, 255, 0.98)',
  },

  // Text Colors
  text: {
    primary: '#2d3748',
    secondary: '#718096',
    tertiary: '#4a5568',
    muted: '#a0aec0',
    dark: '#1a202c',
    light: '#ffffff',
    brand: '#667eea',
    brandDark: '#764ba2',
    success: '#48bb78',
    warning: '#fbbf24',
    gold: '#D4AF37',
    goldBronze: '#B8956A',
  },

  // Border Colors
  borders: {
    light: '#e2e8f0',
    medium: '#cbd5e0',
    dark: '#a0aec0',
    primary: '#667eea',
    primaryDark: '#764ba2',
    white: '#ffffff',
    whiteFaded: 'rgba(255, 255, 255, 0.1)',
    whiteTranslucent: 'rgba(255, 255, 255, 0.2)',
    whiteHalf: 'rgba(255, 255, 255, 0.5)',
    grayLight: '#f3f3f3',
    grayMedium: '#e5e7eb',
    gold: '#D4AF37',
    goldBright: '#FFD700',
  },

  // Shadow Colors (for box-shadow)
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 20px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.15)',
    xl: '0 10px 40px rgba(0, 0, 0, 0.15)',
    '2xl': '0 20px 60px rgba(0, 0, 0, 0.3)',
    '3xl': '0 25px 100px rgba(0, 0, 0, 0.5)',
    primary: '0 4px 20px rgba(102, 126, 234, 0.3)',
    primaryMd: '0 10px 40px rgba(102, 126, 234, 0.3)',
    primaryLg: '0 16px 50px rgba(102, 126, 234, 0.25)',
    primaryXl: '0 20px 60px rgba(102, 126, 234, 0.4)',
    gold: '0 4px 12px rgba(255, 215, 0, 0.4)',
    goldLg: '0 8px 24px rgba(255, 215, 0, 0.5)',
    green: '0 10px 40px rgba(72, 187, 120, 0.3)',
    whatsapp: '0 4px 12px rgba(37, 211, 102, 0.3)',
    white: '0 4px 20px rgba(255, 255, 255, 0.3)',
    whiteLg: '0 8px 40px rgba(255, 255, 255, 0.5)',
    insetWhite: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    insetBlack: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
    card: '0 4px 12px rgba(0, 0, 0, 0.3)',
    cardHover: '0 6px 20px rgba(0, 0, 0, 0.3)',
  },
};

// Generate CSS custom properties (CSS variables)
export const generateCSSVariables = () => {
  return `
    :root {
      /* Primary Brand Colors */
      --color-primary: ${theme.primary.main};
      --color-primary-dark: ${theme.primary.dark};
      --color-primary-light: ${theme.primary.light};

      /* Secondary Colors */
      --color-secondary-yellow: ${theme.secondary.yellow};
      --color-secondary-yellow-dark: ${theme.secondary.yellowDark};
      --color-gold: ${theme.secondary.gold};
      --color-gold-dark: ${theme.secondary.goldDark};
      --color-gold-antique: ${theme.secondary.goldAntique};
      --color-gold-bronze: ${theme.secondary.goldBronze};
      --color-green: ${theme.secondary.green};
      --color-green-dark: ${theme.secondary.greenDark};
      --color-green-bright: ${theme.secondary.greenBright};
      --color-green-success: ${theme.secondary.greenSuccess};
      --color-green-lime: ${theme.secondary.greenLime};
      --color-whatsapp: ${theme.secondary.whatsapp};
      --color-whatsapp-dark: ${theme.secondary.whatsappDark};
      --color-cyan: ${theme.secondary.cyan};
      --color-blue: ${theme.secondary.blue};
      --color-sky-blue: ${theme.secondary.skyBlue};
      --color-sky-blue-dark: ${theme.secondary.skyBlueDark};
      --color-amber: ${theme.secondary.amber};

      /* Neutral Colors */
      --color-white: ${theme.neutral.white};
      --color-off-white: ${theme.neutral.offWhite};
      --color-black: ${theme.neutral.black};
      --color-gray-50: ${theme.neutral.gray50};
      --color-gray-100: ${theme.neutral.gray100};
      --color-gray-200: ${theme.neutral.gray200};
      --color-gray-300: ${theme.neutral.gray300};
      --color-gray-400: ${theme.neutral.gray400};
      --color-gray-500: ${theme.neutral.gray500};
      --color-gray-600: ${theme.neutral.gray600};
      --color-gray-700: ${theme.neutral.gray700};
      --color-gray-800: ${theme.neutral.gray800};
      --color-gray-900: ${theme.neutral.gray900};
      --color-gray-light: ${theme.neutral.grayLight};
      --color-gray-border: ${theme.neutral.grayBorder};
      --color-gray-text: ${theme.neutral.grayText};
      --color-gray-icon: ${theme.neutral.grayIcon};
      --color-gray-subtle: ${theme.neutral.graySubtle};
      --color-gray-dark: ${theme.neutral.grayDark};
      --color-gray-darker: ${theme.neutral.grayDarker};
      --color-gray-muted: ${theme.neutral.grayMuted};
      --color-gray-dim: ${theme.neutral.grayDim};
      --color-gray-dim-2: ${theme.neutral.grayDim2};

      /* Backgrounds */
      --bg-body: ${theme.backgrounds.body};
      --bg-page: ${theme.backgrounds.page};
      --bg-card: ${theme.backgrounds.card};
      --bg-hover: ${theme.backgrounds.hover};
      --bg-hover-dark: ${theme.backgrounds.hoverDark};
      --bg-active: ${theme.backgrounds.active};

      /* Text Colors */
      --text-primary: ${theme.text.primary};
      --text-secondary: ${theme.text.secondary};
      --text-tertiary: ${theme.text.tertiary};
      --text-muted: ${theme.text.muted};
      --text-dark: ${theme.text.dark};
      --text-light: ${theme.text.light};
      --text-brand: ${theme.text.brand};
      --text-brand-dark: ${theme.text.brandDark};
      --text-success: ${theme.text.success};
      --text-warning: ${theme.text.warning};
      --text-gold: ${theme.text.gold};
      --text-gold-bronze: ${theme.text.goldBronze};

      /* Border Colors */
      --border-light: ${theme.borders.light};
      --border-medium: ${theme.borders.medium};
      --border-dark: ${theme.borders.dark};
      --border-primary: ${theme.borders.primary};
      --border-primary-dark: ${theme.borders.primaryDark};
      --border-white: ${theme.borders.white};
      --border-gray-light: ${theme.borders.grayLight};
      --border-gray-medium: ${theme.borders.grayMedium};
      --border-gold: ${theme.borders.gold};
      --border-gold-bright: ${theme.borders.goldBright};

      /* Gradients */
      --gradient-hero: ${theme.gradients.hero};
      --gradient-primary: ${theme.gradients.primary};
      --gradient-primary-reverse: ${theme.gradients.primaryReverse};
      --gradient-primary-horizontal: ${theme.gradients.primaryHorizontal};
      --gradient-white-to-off-white: ${theme.gradients.whiteToOffWhite};
      --gradient-white-to-gray: ${theme.gradients.whiteToGray};
      --gradient-yellow: ${theme.gradients.yellow};
      --gradient-gold: ${theme.gradients.gold};
      --gradient-green: ${theme.gradients.green};
      --gradient-whatsapp: ${theme.gradients.whatsapp};
      --gradient-blue: ${theme.gradients.blue};
      --gradient-dark: ${theme.gradients.dark};
      --gradient-white-card: ${theme.gradients.whiteCard};
      --gradient-gray-light: ${theme.gradients.grayLight};
    }
  `;
};

// Apply theme to DOM
export const applyTheme = () => {
  const styleElement = document.createElement('style');
  styleElement.id = 'cag-theme';
  styleElement.innerHTML = generateCSSVariables();
  document.head.appendChild(styleElement);
};

export default theme;
