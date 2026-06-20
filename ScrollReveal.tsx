import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'span' | 'section' | 'header';
  className?: string;
  key?: React.Key | number | string;
  id?: string;
}

export default function ScrollReveal({ children, delay = 0, className = '', as = 'div', ...rest }: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(true);
          }, delay);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  const Tag = as;

  return (
    <Tag ref={ref as any} className={`reveal ${visible ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
