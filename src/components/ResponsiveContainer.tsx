'use client';

import React, { useState, useEffect } from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
}

export default function ResponsiveContainer({ 
  children, 
  className = '' 
}: ResponsiveContainerProps) {
  const { isMobile, isTablet } = useBreakpoint();
  
  const responsiveClasses = `
    ${isMobile ? 'mobile-padding mobile-text-sm' : ''}
    ${isTablet ? 'tablet-spacing' : ''}
    ${className}
  `;
  
  return (
    <div className={responsiveClasses}>
      {children}
    </div>
  );
}

// 响应式网格组件
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'gap-6',
  className = ''
}: ResponsiveGridProps) {
  const gridClasses = `
    grid
    grid-cols-${cols.mobile || 1}
    md:grid-cols-${cols.tablet || 2}
    lg:grid-cols-${cols.desktop || 3}
    ${gap}
    ${className}
  `;
  
  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// 响应式文本组件
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
}

export function ResponsiveText({ 
  children, 
  size = { mobile: 'text-sm', tablet: 'text-base', desktop: 'text-lg' },
  className = ''
}: ResponsiveTextProps) {
  const textClasses = `
    ${size.mobile || 'text-sm'}
    md:${size.tablet || 'text-base'}
    lg:${size.desktop || 'text-lg'}
    ${className}
  `;
  
  return (
    <span className={textClasses}>
      {children}
    </span>
  );
}
