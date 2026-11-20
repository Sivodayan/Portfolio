import React from 'react';
import TextEngine from 'spring-text-engine';

export interface PopHeadingProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  style?: React.CSSProperties;
  [key: string]: any;
}

/**
 * Pop Scale Heading Component
 * Driven strictly by spring-text-engine and @react-spring/web
 * Tension: 426, Friction: 17, Stagger: 27ms
 */
export const PopHeading: React.FC<PopHeadingProps> = ({
  tag,
  as,
  children,
  className = '',
  center = false,
  style,
  ...props
}) => {
  const chosenTag = (tag || as || 'h2') as any;
  const content = typeof children === 'string' ? children : String(children ?? '');

  return (
    <TextEngine
      tag={chosenTag}
      mode="once"
      letterOut={{ opacity: 0, scale: 0 }}
      letterIn={{ opacity: 1, scale: 1 }}
      letterConfig={{ tension: 426, friction: 17 }}
      letterStagger={27}
      className={`${center ? 'justify-center' : ''} ${className}`}
      style={style}
      {...props}
    >
      {content}
    </TextEngine>
  );
};

export default PopHeading;
