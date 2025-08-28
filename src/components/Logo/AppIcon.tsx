import React from 'react';
type AppIconVariant = 'default' | 'light' | 'dark' | 'monochrome' | 'original' | 'bold';
interface AppIconProps {
  variant?: AppIconVariant;
  size?: number;
}
export const AppIcon = ({
  variant = 'default',
  size = 32
}: AppIconProps) => {
  // Get variant-specific styles
  const getVariantStyles = () => {
    const orangeColor = '#FF6B35';
    switch (variant) {
      case 'light':
        return {
          background: 'white',
          border: orangeColor,
          dollarColor: orangeColor,
          lineColor: orangeColor
        };
      case 'dark':
        return {
          background: 'white',
          border: orangeColor,
          dollarColor: orangeColor,
          lineColor: orangeColor
        };
      case 'monochrome':
        return {
          background: 'white',
          border: '#1F2937',
          dollarColor: '#1F2937',
          lineColor: '#1F2937'
        };
      case 'bold':
        return {
          background: orangeColor,
          border: orangeColor,
          dollarColor: 'white',
          lineColor: 'white'
        };
      case 'original':
      case 'default':
      default:
        return {
          background: 'white',
          border: orangeColor,
          dollarColor: orangeColor,
          lineColor: orangeColor
        };
    }
  };
  const styles = getVariantStyles();
  return <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="28" height="28" rx="8" fill={styles.background} stroke={styles.border} strokeWidth="2" />
      <text x="16" y="13" fontFamily="Arial, sans-serif" fontSize="10" fill={styles.dollarColor} fontWeight="700" textAnchor="middle">
        $
      </text>
      <rect x="12" y="17" width="8" height="2" rx="1" fill={styles.lineColor} />
      <rect x="10" y="21" width="12" height="2" rx="1" fill={styles.lineColor} />
      <rect x="8" y="25" width="16" height="2" rx="1" fill={styles.lineColor} />
    </svg>;
};