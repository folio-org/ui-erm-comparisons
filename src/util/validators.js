import React from 'react';
import { FormattedMessage } from 'react-intl';

const required = value => (
  value === undefined ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
);

const validateURLIsValid = (value) => {
  if (value) {
    try {
      // Test if the URL is valid
      new URL(value); // eslint-disable-line no-new
    } catch (_) {
      return <FormattedMessage id="stripes-erm-components.doc.error.invalidURL" />;
    }
  }

  return undefined;
};

export { validateURLIsValid, required };
