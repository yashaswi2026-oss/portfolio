import React, { createContext, useContext, useState, useEffect } from 'react';

export type VisualTheme = 'linen' | 'midnight' | 'velvet';
export type MotionPreset = 'muted' | 'spring' | 'elastic';

interface AtmosphereContextType {
  theme: VisualTheme;
  setTheme: (theme: VisualTheme) => void;
  motionPreset: MotionPreset;
  setMotionPreset: (preset: MotionPreset) => void;
  stiffness: number;
  damping: number;
}

const AtmosphereContext = createContext<AtmosphereContextType | undefined>(undefined);

export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<VisualTheme>(() => {
    const saved = localStorage.getItem('site-theme');
    return (saved as VisualTheme) || 'linen';
  });

  const [motionPreset, setMotionPresetState] = useState<MotionPreset>(() => {
    const saved = localStorage.getItem('motion-preset');
    return (saved as MotionPreset) || 'spring';
  });

  // Physical parameters mapped from presets
  const [stiffness, setStiffness] = useState(160);
  const [damping, setDamping] = useState(18);

  useEffect(() => {
    // Map preset to spring constants
    switch (motionPreset) {
      case 'muted':
        setStiffness(75);
        setDamping(28);
        break;
      case 'spring':
        setStiffness(180);
        setDamping(18);
        break;
      case 'elastic':
        setStiffness(340);
        setDamping(11);
        break;
    }
    localStorage.setItem('motion-preset', motionPreset);
  }, [motionPreset]);

  const setTheme = (newTheme: VisualTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('site-theme', newTheme);
  };

  // Keep documents data-theme attribute in sync
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <AtmosphereContext.Provider
      value={{
        theme,
        setTheme,
        motionPreset,
        setMotionPreset: setMotionPresetState,
        stiffness,
        damping,
      }}
    >
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  const context = useContext(AtmosphereContext);
  if (!context) {
    throw new Error('useAtmosphere must be used within an AtmosphereProvider');
  }
  return context;
}
