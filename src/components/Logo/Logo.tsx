import React from 'react';
type LogoVariant = 'default' | 'light' | 'dark' | 'monochrome' | 'original' | 'bold';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  withText?: boolean;
  tagline?: boolean;
}
export const Logo = ({
  variant = 'default',
  size = 'md',
  withText = true,
  tagline = false
}: LogoProps) => {
  // Size mapping
  const sizeMap = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-base',
      tagline: 'text-xs',
      logoWidth: 32,
      logoHeight: 32
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-xl',
      tagline: 'text-sm',
      logoWidth: 40,
      logoHeight: 40
    },
    lg: {
      container: 'w-16 h-16',
      text: 'text-2xl',
      tagline: 'text-base',
      logoWidth: 64,
      logoHeight: 64
    },
    xl: {
      container: 'w-24 h-24',
      text: 'text-3xl',
      tagline: 'text-lg',
      logoWidth: 96,
      logoHeight: 96
    }
  };
  // Get variant-specific styles
  const getVariantStyles = () => {
    const orangeColor = '#FF6B35';
    const textColor = '#374151';
    const taglineColor = '#6B7280';
    switch (variant) {
      case 'light':
        return {
          border: orangeColor,
          fill: 'white',
          textColor: textColor,
          taglineColor: taglineColor,
          dollarColor: orangeColor,
          lineColor: orangeColor
        };
      case 'dark':
        return {
          border: orangeColor,
          fill: 'white',
          textColor: textColor,
          taglineColor: taglineColor,
          dollarColor: orangeColor,
          lineColor: orangeColor
        };
      case 'monochrome':
        return {
          border: '#1F2937',
          fill: 'white',
          textColor: '#1F2937',
          taglineColor: '#4B5563',
          dollarColor: '#1F2937',
          lineColor: '#1F2937'
        };
      case 'bold':
        return {
          border: orangeColor,
          fill: orangeColor,
          textColor: 'white',
          taglineColor: '#FFD0C2',
          dollarColor: 'white',
          lineColor: 'white'
        };
      case 'original':
      case 'default':
      default:
        return {
          border: orangeColor,
          fill: 'white',
          textColor: textColor,
          taglineColor: taglineColor,
          dollarColor: orangeColor,
          lineColor: orangeColor
        };
    }
  };
  const styles = getVariantStyles();
  const sizes = sizeMap[size];
  return <div className="flex items-center justify-start w-full">
      <div className="flex-shrink-0">
        <svg width={sizes.logoWidth} height={sizes.logoHeight} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="36" height="36" rx="8" fill={styles.fill} stroke={styles.border} strokeWidth="2" />
          <text x="20" y="16" fontFamily="Arial, sans-serif" fontSize="12" fill={styles.dollarColor} fontWeight="700" textAnchor="middle">
            $
          </text>
          <rect x="14" y="22" width="12" height="2" rx="1" fill={styles.lineColor} />
          <rect x="12" y="26" width="16" height="2" rx="1" fill={styles.lineColor} />
          <rect x="10" y="30" width="20" height="2" rx="1" fill={styles.lineColor} />
        </svg>
      </div>
      {withText && <div className="ml-3">
          <h1 className="font-bold text-left" style={{
        fontFamily: "'Roboto Condensed', sans-serif",
        fontSize: sizes.text === 'text-base' ? '14px' : sizes.text === 'text-xl' ? '18px' : sizes.text === 'text-2xl' ? '24px' : '30px',
        color: styles.textColor
      }}>
            Survival Budget
          </h1>
          {tagline && <p style={{
        fontFamily: "'Roboto Condensed', sans-serif",
        fontSize: sizes.tagline === 'text-xs' ? '10px' : sizes.tagline === 'text-sm' ? '11px' : sizes.tagline === 'text-base' ? '14px' : '16px',
        color: styles.taglineColor,
        fontWeight: '300',
        textAlign: 'left',
        marginTop: '0px',
        lineHeight: '1'
      }}>
              Priority-based budgeting
            </p>}
        </div>}
    </div>;
};