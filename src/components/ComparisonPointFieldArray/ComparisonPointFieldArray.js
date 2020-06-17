import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Tooltip } from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import ComparisonPointField from './ComparisonPointField';

class ComparisonPointFieldArray extends React.Component {

  renderComparisonPoints = () => {
    const { comparisonPoint: comparisonType, deleteButtonTooltipId, headerId, items, name } = this.props;

    return items.map((comparisonPoint, index) => (
      <EditCard
        key={index}
        data-test-comparison-point-number={`${comparisonType} ${index}`}
        deleteButtonTooltipText={<FormattedMessage id={deleteButtonTooltipId} values={{ index: index + 1 }} />}
        header={<FormattedMessage id={headerId} values={{ number: index + 1 }} />}
        onDelete={() => this.props.onDeleteField(index, comparisonPoint)}
      >
        <Field
          component={ComparisonPointField}
          index={index}
          name={`${name}[${index}]`}
        />
      </EditCard>
    ));
  }

  renderAddNewButton() {
    const {addButtonId, addLabelId, disableAddNew } = this.props;
    return (
      <Button disabled={disableAddNew} id={addButtonId} onClick={() => this.props.onAddField()}>
        <FormattedMessage id={addLabelId} />
      </Button>
    );
  }

  render = () => {
    const { id } = this.props;
    return (
      <div>
        <div id={id}>
          {this.renderComparisonPoints()}
        </div>
        {this.renderAddNewButton()}
      </div>
    );
  }
}

export default withKiwtFieldArray(ComparisonPointFieldArray);
