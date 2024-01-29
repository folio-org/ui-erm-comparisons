import React from 'react';
import { FormattedMessage } from 'react-intl';

const required = value => (
  value === undefined ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
);

// eslint-disable-next-line import/prefer-default-export
export { required };
