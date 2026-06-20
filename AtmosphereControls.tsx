import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Sliders, Moon, Sun, Leaf, Activity } from 'lucide-react';
import { useAtmosphere, VisualTheme, MotionPreset } from './AtmosphereContext';

export default function AtmosphereControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [testTrigger, setTestTrigger] = useState(false);
  const {
    theme,
    setTheme,
    motionPreset,
    setMotionPreset,
    stiffness,
    damping
  } = useAtmosphere();

  // Highlight spring physics on preset trigger
  const triggerPhysicsTest = () => {
    setTestTrigger(prev => !prev);
  };

  const themes: { id: VisualTheme; name: string; bg: string; text: string; accent: string; icon: any }[] = [
    { id: 'linen', name: 'Linen Classic', bg: '#FAF6F0', text: '#1F2824', accent: '#C4A578', icon: Sun },
    { id: 'midnight', name: 'Midnight Aurora', bg: '#0F1210', text: '#F3EFE9', accent: '#E2CA9E', icon: Moon },
    { id: 'velvet', name: 'Velvet Minimal', bg: '#1B1715', text: '#FAF6EF', accent: '#EBB682', icon: Leaf },
  ];

  const presets: { id: MotionPreset; name: string; desc: string }[] = [
    { id: 'muted', name: 'Glide', desc: 'Heavy, smooth and tranquil' },
    { id: 'spring', name: 'Organic', desc: 'Perfect natural spring bounce' },
    { id: 'elastic', name: 'Kinetic', desc: 'High energy elastic recoil' },
  ];

  return (
    <div className="fixed bottom-8 left-8 z-[90] flex items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="atmosphere-panel"
            initial={{ opacity: 0, scale: 0.88, y: 35, x: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 35, x: -10 }}
            transition={{ type: 'spring', stiffness: 240, damping: 21 }}
            className="absolute bottom-16 left-0 w-[300px] md:w-[335px] max-h-[85vh] overflow-y-auto p-6 bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-2xl shadow-[0_24px_64px_-16px_rgba(var(--shadow),0.2)] scrollbar-thin"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h4 className="font-serif text-base font-semibold tracking-wide">Atmosphere</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--ink-soft)] hover:text-[var(--ink)] text-xs font-mono uppercase tracking-widest cursor-pointer hover:underline"
              >
                Close
              </button>
            </div>

            {/* Themes Category */}
            <div className="mb-6">
              <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ink-soft)] mb-3">
                Select Theme Palette
              </span>
              <div className="flex flex-col gap-2">
                {themes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                        theme === t.id
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--line)] bg-[var(--canvas)]/30 hover:bg-[var(--canvas)]/80 hover:border-[var(--ink-faint)]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors shadow-inner"
                          style={{
                            background: t.bg,
                            borderColor: t.accent,
                            color: t.text,
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-sans text-xs font-semibold">{t.name}</span>
                          <span className="block text-[9px] text-[var(--ink-soft)]">
                            {t.id === 'linen' ? 'Original Warm Plaster' : t.id === 'midnight' ? 'Deep Space Moss' : 'Earth-Clay Bronze'}
                          </span>
                        </div>
                      </div>

                      {theme === t.id && (
                        <div className="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--canvas)] flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3" strokeWidth={2.5} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Motion Presets Category */}
            <div className="mb-6">
              <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ink-soft)] mb-3">
                Motion Curves &amp; Physics
              </span>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {presets.map((preset) => {
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setMotionPreset(preset.id);
                        triggerPhysicsTest();
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                        motionPreset === preset.id
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--line)] bg-[var(--canvas)]/30 hover:bg-[var(--canvas)]/80 hover:border-[var(--ink-faint)]/40'
                      }`}
                    >
                      <Activity className={`w-3.5 h-3.5 mb-1 ${motionPreset === preset.id ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)]'}`} />
                      <span className="font-sans text-[11px] font-semibold tracking-wide block">{preset.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Kinetic Springs Physics Interactive Playground block */}
              <div
                onClick={() => {
                  triggerPhysicsTest();
                }}
                className="p-3 bg-[var(--canvas)]/40 border border-[var(--line)] rounded-xl flex items-center justify-between cursor-pointer group hover:border-[var(--accent)]/40 hover:bg-[var(--canvas)]/80 transition-all duration-300"
              >
                <div className="text-left">
                  <span className="block text-[9px] font-mono tracking-wider text-[var(--ink-soft)]">
                    Spring: stiffness={stiffness}, damp={damping}
                  </span>
                  <span className="text-[10px] text-[var(--ink-faint)] block leading-tight mt-0.5 group-hover:text-[var(--ink-soft)]">
                    Click to test recoil response and feel feedback
                  </span>
                </div>
                <div className="w-10 h-10 bg-[var(--line)] rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner">
                  <motion.div
                    key={testTrigger ? 't1' : 't2'}
                    initial={{ scale: 0.35, rotate: -45 }}
                    animate={{ scale: 1.0, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: stiffness,
                      damping: damping,
                    }}
                    className="w-5 h-5 bg-[var(--accent)] rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher trigger */}
      <motion.button
        id="atmosphere-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--ink)] hover:bg-[var(--accent)] text-[var(--canvas)] hover:text-[var(--ink)] flex items-center justify-center shadow-[0_12px_40px_rgba(var(--shadow),0.25)] hover:shadow-[0_16px_48px_rgba(var(--shadow),0.35)] border border-[var(--line)]/50 transition-colors duration-300 ease-out cursor-pointer group"
        aria-label="Atmosphere Panel"
      >
        <Sliders className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:rotate-12" />
      </motion.button>
    </div>
  );
}
