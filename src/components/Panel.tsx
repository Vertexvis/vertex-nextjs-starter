import cn from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
  readonly children: ReactNode;
  readonly position?: 'left' | 'right' | 'bottom';
  readonly overflow?: 'scroll' | 'visible';
  readonly overlay?: boolean;
}

export function Panel({
  children,
  position = 'left',
  overflow: userOverflow,
  overlay = true,
}: Props): JSX.Element {
  const isBottom = position === 'bottom';
  const isLeft = position === 'left';
  const isRight = position === 'right';
  const overflow = `overflow-${userOverflow ?? 'scroll'}`;
  const commonInner = `h-full w-80 ${overflow}`;

  return (
    <div
      className={cn({
        ['flex']: isBottom,
        ['relative']: isLeft,
        ['relative ml-auto']: isRight,
        ['w-0 flex-shrink-0']: overlay,
      })}
    >
      <div
        className={cn('z-overlay bg-white', {
          [`h-80 w-full absolute inset-x-0 bottom-0 ${overflow}`]: isBottom,
          [commonInner]: isLeft,
          [`${commonInner} right-0`]: isRight,
          ['absolute']: overlay,
        })}
      >
        <div
          className={cn('h-full w-full border-gray-300', {
            ['border-t']: isBottom,
            ['border-r shadow']: isLeft,
            ['border-l shadow']: isRight,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
