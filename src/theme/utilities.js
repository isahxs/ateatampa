import { StyleSheet } from 'react-native';
import { typography } from './typography';

export const utils = StyleSheet.create({
    flexRow: { flexDirection: 'row' },
    flexColumn: { flexDirection: 'column' },

    flexGrow1: { flexGrow: 1 },

    justifyStart: { justifyContent: 'flex-start' },
    justifyCenter: { justifyContent: 'center' },
    justifyEnd: { justifyContent: 'flex-end' },
    justifyAround: { justifyContent: 'space-around' },
    justifyBetween: { justifyContent: 'space-between' },
    flexCenter: { justifyContent: 'center', alignItems: 'center' },
    alignStart: { alignItems: 'flex-start' },
    alignCenter: { alignItems: 'center' },
    alignEnd: { alignItems: 'flex-end' },

    textLeft: { textAlign: 'left' },
    textCenter: { textAlign: 'center' },
    textRight: { textAlign: 'right' },

    textXs: { fontSize: typography.sizes.xs },
    textSm: { fontSize: typography.sizes.sm },
    textBase: { fontSize: typography.sizes.base },
    textMd: { fontSize: typography.sizes.md },
    textLg: { fontSize: typography.sizes.lg },
    textXl: { fontSize: typography.sizes.xl },

    fontThin: { fontWeight: typography.weights.thin },
    fontLight: { fontWeight: typography.weights.light },
    fontRegular: { fontWeight: typography.weights.regular },
    fontMedium: { fontWeight: typography.weights.medium },
    fontSemibold: { fontWeight: typography.weights.semibold },
    fontBold: { fontWeight: typography.weights.bold },

    wFull: { width: '100%' },
    hFull: { height: '100%' },
});
