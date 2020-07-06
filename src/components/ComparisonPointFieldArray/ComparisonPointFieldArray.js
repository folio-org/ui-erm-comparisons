import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Datepicker } from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';
import ComparisonPointField from './ComparisonPointField';


class ComparisonPointFieldArray extends React.Component {
  static propTypes = {
    addButtonId: PropTypes.string,
    addLabelId: PropTypes.string,
    comparisonPoint: PropTypes.string,
    data: PropTypes.shape({
      entitlements: PropTypes.object
    }),
    deleteButtonTooltipId: PropTypes.string,
    disableAddNew: PropTypes.bool,
    fields: PropTypes.shape({
      insert: PropTypes.func.isRequired,
      length: PropTypes.number,
      name: PropTypes.string.isRequired,
      remove: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired,
      value: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    handlers: PropTypes.shape({
      onEResourceAdded: PropTypes.func.isRequired,
      onEResourceRemoved: PropTypes.func.isRequired
    }).isRequired,
    headerId: PropTypes.string,
    id: PropTypes.string,
  }

  state = { currentDate: moment.utc().startOf('day').toISOString() }
  handleComparisonPointSelected = /* istanbul ignore next */ (index, comparisonPoint, comparisonType) => {
    if (comparisonType === 'agreement') {
      this.handleUpdateField(index, {
        id: comparisonPoint.id,
        name: comparisonPoint.name,
        reasonForClosure: comparisonPoint.reasonForClosure?.label,
        startDate: comparisonPoint.startDate,
        status: comparisonPoint.agreementStatus?.label,
        endDate: comparisonPoint.endDate
      });
    } else if (comparisonType === 'package') {
      this.props.handlers.onEResourceAdded(comparisonPoint.id);
      this.handleUpdateField(index, {
        id: comparisonPoint.id,
        name: comparisonPoint.name,
        count: comparisonPoint._object?.resourceCount,
        provider: comparisonPoint._object?.vendor?.name
      }, true);
    }
  }


  // We don't need a full blown withKiwtFieldArray here since these will never be edited, just these small handlers will do
  handleAddField = () => {
    const { fields } = this.props;
    fields.insert(fields.length, {});
  }

  handleDeleteField = (index) => {
    const id = this.props.fields?.value?.[index]?.id;
    const eResourceField = this.props.comparisonPoint === 'package';

    if (eResourceField) {
      this.props.handlers.onEResourceRemoved(id);
    }
    this.props.fields.remove(index);
  }

  handleUpdateField = (index, field, updateEntitlementQuery = false) => {
    const { fields } = this.props;

    if (updateEntitlementQuery) {
      // add new entitlements, remove old ones (if they exist, this method is used for adding as well as updating)
      const removedId = this.props.fields?.value?.[index]?.id;
      const addedId = field?.id;
      if (removedId) {
        this.props.handlers.onEResourceRemoved(removedId);
      }
      this.props.handlers.onEResourceAdded(addedId);
    }

    fields.update(index, {
      ...fields.value[index],
      ...field,
    });
  }


  parseDateOnlyString = (value, _timeZone, dateFormat) => {
    return (!value || value === '') ? value : moment(value).format(dateFormat);
  };

  renderComparisonPoints = () => {
    const { comparisonPoint: comparisonType, data, deleteButtonTooltipId, fields, headerId } = this.props;
    const { name } = fields;
    return fields?.value?.map((comparisonPoint, index) => {
      return (
        <EditCard
          key={`${comparisonType} ${index}`}
          deleteButtonTooltipText={<FormattedMessage id={deleteButtonTooltipId} values={{ index: index + 1 }} />}
          header={<FormattedMessage id={headerId} values={{ number: index + 1 }} />}
          id={`data-test-comparison-point-${comparisonType}`}
          onDelete={() => this.handleDeleteField(index)}
        >
          <Field
            comparisonPoint={comparisonPoint}
            comparisonType={comparisonType}
            component={ComparisonPointField}
            entitlements={data?.entitlements}
            id={`data-test-field-comparison-point-${comparisonType}`}
            index={index}
            name={`${name}[${index}]`}
            onComparisonPointSelected={selectedComparisonPoint => this.handleComparisonPointSelected(index, selectedComparisonPoint, comparisonType)}
          />
          <Field
            component={Datepicker}
            defaultValue={this.state.currentDate}
            id={`data-test-field-date-${comparisonType}`}
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
    const { addButtonId, addLabelId, disableAddNew } = this.props;
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
