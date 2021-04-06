import React from 'react';
import { Collapsible } from './Collapsible';
import { Panel } from './Panel';

export function RightSidebar(): JSX.Element {
  return (
    <Panel position="right" overlay={false}>
      <div className="w-full pr-2 border-b text-gray-700 text-sm">
        <Collapsible title="MY SIDEBAR">
          <p className="text-center mb-4">TODO</p>
        </Collapsible>
      </div>
    </Panel>
  );
}
