const palette = {
    system: {
        white: '#FFFFFF',
        black: '#000000',
    },

    brand: {
        alabaster: '#E6E6E6',
        cream: '#F2F0E4',
        gold: '#D9BD8B',
        lavender: '#6D76A6',
        maroon: '#800000',
        navy: '#161C5C',
        parchment: '#F3ECE6',
        snow: '#FFF9F8',
        walnut: '#5A3E2B',
    },

    neutral: {
        50: '#FDFDFD',
        100: '#FAFAFA',
        200: '#F2F0F1',
        300: '#E5E5E5',
        400: '#D4D4D4',
        500: '#A3A3A3',
        600: '#737373',
        700: '#525252',
        800: '#404040',
        900: '#282828',
        950: '#141414',
    },

    plum: {
        50: '#FAF3F7',
        100: '#F4EBF1',
        200: '#E5CBD9',
        300: '#D1A3BE',
        400: '#B8759D',
        500: '#9D5280',
        600: '#803765',
        700: '#672A51',
        800: '#4F203E',
        900: '#3A152D',
        950: '#220B19',
    },

    zinc: {
        50: '#F9F9FA',
        100: '#F4F4F5',
        200: '#E4E4E7',
        300: '#D4D4D8',
        400: '#A1A1AA',
        500: '#71717A',
        600: '#52525B',
        700: '#3F3F46',
        800: '#27272A',
        900: '#18181B',
        950: '#09090B',
    },
};

export const colors = {
    system: {
        white: palette.system.white,
        black: palette.system.black,
    },

    brand: {
        alabaster: palette.brand.alabaster,
        cream: palette.brand.cream,
        gold: palette.brand.gold,
        lavender: palette.brand.lavender,
        maroon: palette.brand.maroon,
        navy: palette.brand.navy,
        parchment: palette.brand.parchment,
        snow: palette.brand.snow,
        walnut: palette.brand.walnut,
    },

    background: palette.brand.cream,
    title: palette.plum[800],
    subtitle: palette.plum[600],

    cardBackground: palette.neutral[100],
    badgeBackground: palette.neutral[200],

    light: palette.neutral[200],
    dark: palette.neutral[900],
    muted: palette.zinc[400],
    mutedMedium: palette.zinc[500],

    primary: palette.plum[600],
    primaryHover: palette.plum[500],
    primaryActive: palette.plum[400],
};
