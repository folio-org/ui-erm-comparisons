import React from 'react';
import { Tooltip } from '@folio/stripes/components';

export default function ConditionalTooltip(props) {
  if (props.condition) {
    return (
      <Tooltip
        id={props.id}
        sub={props.sub ? props.sub : undefined}
        text={props.text}
      >
        {({ ref, ariaIds }) => (
          React.cloneElement(props.children, { 'aria-describedby': (props.sub ? ariaIds.sub : undefined), 'aria-labelledby': ariaIds.text, ref })
        )}
      </Tooltip>
    );
  }
  return (props.children);
}
