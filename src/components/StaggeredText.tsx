import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import TextEngine from 'spring-text-engine';

export interface StaggeredTextProps {
  text?: string;
  className?: string;
  as?: string;
  tag?: string;
  center?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}

export interface StaggeredTextHandle {
  replay: () => void;
  exit: () => void;
}

/**
 * Pop Scale Text Component using spring-text-engine & @react-spring/web
 * Each letter pops in with a springy overshoot.
 * Config: tension: 426, friction: 17, letterStagger: 27
 */
export const StaggeredText = forwardRef<StaggeredTextHandle, StaggeredTextProps>(
  (
    {
      text,
      className = '',
      as,
      tag,
      center = false,
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      segmentBy,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      duration,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      delay,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      blur,
      ...rest
    },
    ref
  ) => {
    const engineRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      replay: () => {
        engineRef.current?.playIn?.();
      },
      exit: () => {
        engineRef.current?.playOut?.();
      },
    }));

    const headingTag = (tag || as || 'h2') as any;
    const content = (children !== undefined && children !== null ? children : text) || '';
    const textString = typeof content === 'string' ? content : String(content);

    return (
      <TextEngine
        ref={engineRef}
        tag={headingTag}
        mode="once"
        letterOut={{ opacity: 0, scale: 0 }}
        letterIn={{ opacity: 1, scale: 1 }}
        letterConfig={{ tension: 426, friction: 17 }}
        letterStagger={27}
        className={`${center ? 'justify-center' : ''} ${className}`}
        {...rest}
      >
        {textString}
      </TextEngine>
    );
  }
);

StaggeredText.displayName = 'StaggeredText';
export default StaggeredText;
