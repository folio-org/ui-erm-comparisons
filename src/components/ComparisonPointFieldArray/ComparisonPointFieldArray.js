import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Datepicker } from '@folio/stripes/components';

import { EditCard, requiredValidator } from '@folio/stripes-erm-components';
import ComparisonPointField from './ComparisonPointField';


class ComparisonPointFieldArray extends React.Component {
  state = { currentDate: moment.utc().startOf('day').toISOString() }
  // Execution of this block only occurs with the find-user plugin existing in UserPicker.
  handleComparisonPointSelected = /* istanbul ignore next */ (index, comparisonPoint, comparisonType) => {
    switch (comparisonType) {
      case 'agreement':
        this.handleUpdateField(index, {
          id: comparisonPoint.id,
          name: comparisonPoint.name,
          reasonForClosure: comparisonPoint.reasonForClosure?.label,
          startDate: comparisonPoint.startDate,
          status: comparisonPoint.agreementStatus?.label,
          endDate: comparisonPoint.endDate
        });
        break;
      case 'package':
        console.log("Package: %o", comparisonPoint)
        this.handleUpdateField(index, {
          id: comparisonPoint.id,
          name: comparisonPoint.name,
          count: comparisonPoint._object?.resourceCount,
          provider: comparisonPoint._object?.vendor?.name
        });
        break;
      default:
        break;
    }
  }


  // We don't need a full blown withKiwtFieldArray here since these will never be edited, just these small handlers will do
  handleAddField = () => {
    const { fields } = this.props;
    fields.insert(fields.length, {});
  }

  handleDeleteField = (index) => {
    this.props.fields.remove(index);
  }

  handleUpdateField = (index, field) => {
    const { fields, input } = this.props;
    fields.update(index, {
      ...fields.value[index],
      ...field,
    });
  }


  parseDateOnlyString = (value, _timeZone, dateFormat) => {
    return (!value || value === '') ? value : moment(value).format(dateFormat);
  };

  renderComparisonPoints = () => {
    const { comparisonPoint: comparisonType, deleteButtonTooltipId, fields, headerId } = this.props;
    const { name } = fields;
    return fields?.value?.map((comparisonPoint, index) => {
      return (
        <EditCard
          key={index}
          data-test-comparison-point-number={`${comparisonType} ${index}`}
          deleteButtonTooltipText={<FormattedMessage id={deleteButtonTooltipId} values={{ index: index + 1 }} />}
          header={<FormattedMessage id={headerId} values={{ number: index + 1 }} />}
          onDelete={() => this.handleDeleteField(index)}
        >
          <Field
            comparisonPoint={comparisonPoint}
            comparisonType={comparisonType}
            component={ComparisonPointField}
            index={index}
            name={`${name}[${index}]`}
            onComparisonPointSelected={selectedComparisonPoint => this.handleComparisonPointSelected(index, selectedComparisonPoint, comparisonType)}
          />
          <Field
            component={Datepicker}
            defaultValue={this.state.currentDate}
            index={index}
            label={<FormattedMessage id="ui-erm-comparisons.newComparison.onDate" />}
            name={`${name}[${index}].onDate`}
            parser={this.parseDateOnlyString}
          />
        </EditCard>
      );
    });
  }

  renderAddNewButton() {
    const {addButtonId, addLabelId, disableAddNew } = this.props;
    return (
      <Button disabled={disableAddNew} id={addButtonId} onClick={() => this.handleAddField()}>
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

export default ComparisonPointFieldArray;
