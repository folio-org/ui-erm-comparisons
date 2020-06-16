import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';

export default class FormattedDateTime extends React.Component {
  static propTypes = {
    date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  render() {
    return (
      <div>
        <FormattedDate value={this.props.date} />
        &nbsp;
        <FormattedTime value={this.props.date} />
      </div>
    );
  }
}
