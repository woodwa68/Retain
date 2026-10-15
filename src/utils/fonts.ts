import { Platform, StyleSheet } from 'react-native';

const fontFamily = {
  '400': Platform.select({
    android: 'Domine-Regular',
    ios: 'Domine-Regular',
  }),
  '500': Platform.select({
    android: 'BeausiteClassic-Medium',
    ios: 'Beausite Classic',
  }),
  '600': Platform.select({
    android: 'BeausiteClassic-Semibold',
    ios: 'Beausite Classic',
  }),
  '700': Platform.select({
    android: 'BeausiteClassic-Bold',
    ios: 'Beausite Classic',
  }),
};

const fontWeight = {
  '400': Platform.select({ ios: '400' as const }),
  '500': Platform.select({ ios: '500' as const }),
  '600': Platform.select({ ios: '600' as const }),
  '700': Platform.select({ ios: '700' as const }),
};

export const TYPOGRAPHY_STYLES = StyleSheet.create({
  // Headings/Heading 1
  h1: {
    fontSize: 56,
    lineHeight: 56,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
  },
  // Headings/Heading 2
  h2: {
    fontSize: 44,
    lineHeight: 44,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
  },
  // Headings/Heading 3
  h3: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
  // Headings/Heading 4
  h4: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
  },
  // Headings/Heading 5
  h5: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
  // Headings/Heading 6
  h6: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
  // Labels & Chips/Large
  'label-l': {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[600],
  },
  // Labels & Chips/Medium
  'label-m': {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[600],
    textTransform: 'uppercase',
  },
  // Labels & Chips/Regular 100
  'label-r-100': {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
    letterSpacing: 1.08,
  },
  // Labels & Chips/Regular 200
  'label-r-200': {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[600],
    letterSpacing: 0.6,
  },
  // Labels & Chips/Regular 300
  'label-r-300': {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: fontFamily[700],
    fontWeight: fontWeight[700],
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Labels & Chips/Regular 400
  'label-r-400': {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
    letterSpacing: 0.12,
  },
  // Labels & Chips/Small 100
  'label-s-100': {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[600],
    letterSpacing: 0.72,
    textTransform: 'uppercase',
  },
  // Labels & Chips/Small 200
  'label-s-200': {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
    letterSpacing: 0.06,
  },
  // Labels & Chips/Small 200
  'label-s-300': {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: fontWeight[700],
    fontFamily: fontFamily[700],
    letterSpacing: 0.72,
    textTransform: 'uppercase',
  },
  // Labels & Chips/XSmall 100
  'label-xs-100': {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[400],
    letterSpacing: 0.38,
    textTransform: 'uppercase',
  },
  // Body/Extra Large
  'body-xl': {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
  },
  // Body/Large
  'body-l': {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
  },
  // Body/Large-200
  'body-l-200': {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[600],
  },
  // Body/Medium
  'body-m': {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
  },
  // Body/Medium 100
  'body-m-100': {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[600],
  },
  // Body/Medium 200
  'body-m-200': {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
  },
  'body-m-bold': {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: fontWeight[700],
    fontFamily: fontFamily[400],
  },
  // Body/Regular
  'body-r': {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeight[400],
  },
  // Body/Regular Bold
  'body-r-bold': {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeight[600],
  },
  // Body/Small
  'body-s': {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
    letterSpacing: 0.05,
  },
  // Body/Regular 200
  'body-r-200': {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
  // Body/Regular 100
  'body-r-100': {
    fontSize: 14,
    lineHeight: 23,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
  },
  // Body/Extra-Small 100
  'body-xs-100': {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[600],
    letterSpacing: 0.24,
  },
  // Body/Extra-Small 200
  'body-xs-200': {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: fontWeight[400],
    fontFamily: fontFamily[400],
    letterSpacing: 0.1,
  },
  // Button/Large
  'btn-l': {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
  // Button/Medium 100
  'btn-m-100': {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
  // Button/Medium 200
  'btn-m-200': {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
    letterSpacing: 0.96,
    textTransform: 'uppercase',
  },
  // Button/Medium 300
  'btn-m-300': {
    fontSize: 15, // 16 in typography but different in button DS
    lineHeight: Platform.select({
      android: 20,
      ios: 20,
    }), // 22 in typography but different in button DS
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
    letterSpacing: 0.06,
  },
  // Button/Regular
  'btn-r': {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeight[600],
    fontFamily: fontFamily[600],
  },
  // Button/Small
  'btn-s-100': {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
    letterSpacing: 0.09,
    textTransform: 'uppercase',
  },
  // Button/Small
  'btn-s-200': {
    fontSize: 12,
    lineHeight: Platform.select({
      android: 14,
      ios: 16,
    }),
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
  'btn-xxs': {
    fontSize: 10,
    lineHeight: Platform.select({
      android: 12,
      ios: 14,
    }),
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
  // Links
  // Inline Link Bold
  'link-bold': {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: fontWeight[700],
    fontFamily: fontFamily[700],
  },
  'link-regular': {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: fontWeight[500],
    fontFamily: fontFamily[500],
  },
});
