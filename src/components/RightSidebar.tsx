import React from 'react';
import { Properties } from '../lib/metadata';
import { Collapsible } from './Collapsible';
import { MetadataProperties } from './MetadataProperties';
import { Panel } from './Panel';

interface Props {
  readonly properties: Properties;
}

export function RightSidebar({ properties }: Props): JSX.Element {
  return (
    <Panel position="right" overlay={false}>
      <div className="w-full pr-2 border-b text-gray-700 text-sm">
        <Collapsible title="METADATA PROPERTIES">
          <MetadataProperties properties={properties} />
        </Collapsible>
      </div>
    </Panel>
  );
}
