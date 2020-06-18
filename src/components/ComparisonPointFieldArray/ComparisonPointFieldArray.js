import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Tooltip } from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import ComparisonPointField from './ComparisonPointField';

class ComparisonPointFieldArray extends React.Component {
  state = {
    comparisonPoints: {}
  }

  // Execution of this block only occurs with the find-user plugin existing in UserPicker.
  handleComparisonPointSelected = /* istanbul ignore next */ (index, comparisonPoint) => {
    this.props.onUpdateField(index, { comparisonPoint: comparisonPoint.id });

    this.setState(prevState => ({
      comparisonPoints: {
        ...prevState.comparisonPoints,
        [comparisonPoint.id]: comparisonPoint,
      },
    }));
  }

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
          onComparisonPointSelected={selectedComparisonPoint => this.handleComparisonPointSelected(index, selectedComparisonPoint)}
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
    console.log("CPFA PROPS: %o", this.props)
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
