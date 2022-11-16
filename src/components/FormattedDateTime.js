import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';

const FormattedDateTime = ({ date, id }) => {
  return (
    <div id={id}>
      <FormattedDate value={date} />
      &nbsp;
      <FormattedTime value={date} />
    </div>
  );
};

FormattedDateTime.propTypes = {
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  id: PropTypes.string
};

export default FormattedDateTime;
