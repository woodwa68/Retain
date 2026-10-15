import { TYPOGRAPHY_STYLES } from './fonts';

type TypographyStyles = typeof TYPOGRAPHY_STYLES;

const headerVariants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const HEADER_SCALE_FACTOR = 0.91;
const HEADER_LINE_HEIGHT_SCALE_FACTOR = 0.91;

export function getScaledTypography(fontScale: number) {
  return Object.fromEntries(
    Object.entries(TYPOGRAPHY_STYLES).map(([key, style]) => {
      if (!style.fontSize) {
        return [key, style];
      }

      const isHeader = headerVariants.includes(key);

      // Apply slower scaling for headers on iOS
      const effectiveScale = isHeader ? fontScale * HEADER_SCALE_FACTOR : fontScale;

      const effectiveLineHeightScale = isHeader
        ? fontScale * HEADER_LINE_HEIGHT_SCALE_FACTOR
        : fontScale;

      const lineHeight = style.lineHeight
        ? Math.round(style.lineHeight * effectiveLineHeightScale)
        : undefined;

      return [
        key,
        {
          ...style,
          fontSize: Math.round(style.fontSize * effectiveScale),
          ...(lineHeight && { lineHeight }),
        },
      ];
    }),
  ) as TypographyStyles;
}
