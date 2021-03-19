import { useRouter } from 'next/router';
import React from 'react';

export function waitForHydrate<P>(
  WrappedComponent: React.ComponentType<P>
): React.FunctionComponent<P> {
  return function Component(props) {
    const { isReady } = useRouter();
    if (isReady) {
      return <WrappedComponent {...props} />;
    } else {
      return <></>;
    }
  };
}
