import React from 'react';

type IconType = 'caret-right';

interface Props {
  icon: IconType;
}

export function Icon({ icon }: Props): JSX.Element {
  return getIcon(icon);
}

function getIcon(type: string): JSX.Element {
  switch (type) {
    case 'caret-right':
      return caretRight;
    default:
      return <></>;
  }
}

const baseIcon = (icon: React.ReactNode, testId?: string): JSX.Element => (
  <svg
    data-testid={`icon-${testId}`}
    className="fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
  >
    {icon}
  </svg>
);

const caretRight = baseIcon(
  <path d="M10.83,7.63l-5-4.5a.5.5,0,0,0-.66.74L9.75,8,5.17,12.13a.5.5,0,1,0,.66.74l5-4.5a.49.49,0,0,0,0-.74Z" />,
  'caret-right'
);
