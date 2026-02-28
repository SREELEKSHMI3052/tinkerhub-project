// Responsive design utilities
export const responsive = {
  // Breakpoints
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  
  // Media query helpers
  getResponsivePadding: (isMobile) => isMobile ? '20px' : '40px',
  getResponsiveGap: (isMobile) => isMobile ? '20px' : '40px',
  getResponsiveCardPadding: (isMobile) => isMobile ? '20px' : '30px',
  getResponsiveFontSize: (isMobile, baseSize) => isMobile ? baseSize * 0.85 : baseSize,
  
  // Container styles
  container: (isMobile) => ({
    maxWidth: isMobile ? '100%' : '1400px',
    padding: responsive.getResponsivePadding(isMobile),
    margin: '0 auto'
  }),

  // Grid layouts
  gridResponsive: (isMobile, cols = 2) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : cols === 2 ? '1fr 1.5fr' : '1fr',
    gap: responsive.getResponsiveGap(isMobile),
    alignItems: 'start'
  }),

  // Flex responsive
  flexResponsive: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: responsive.getResponsiveGap(isMobile)
  })
};

// Hook for responsive design
export const useResponsive = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 640);
  const [isTablet, setIsTablet] = React.useState(window.innerWidth <= 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsTablet(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet };
};
