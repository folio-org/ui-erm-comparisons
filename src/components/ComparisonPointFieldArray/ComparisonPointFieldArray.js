import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Col, Datepicker, Row } from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
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
    handlers: PropTypes.shape({
      onEResourceAdded: PropTypes.func.isRequired,
      onEResourceRemoved: PropTypes.func.isRequired
    }).isRequired,
    headerId: PropTypes.string,
    id: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onUpdateField: PropTypes.func.isRequired,
  }

  state = { currentDate: moment.utc().startOf('day').toISOString() }

  handleComparisonPointSelected = (index, comparisonPoint, comparisonType) => {
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

  handleUpdateField = (index, field, updateEntitlementQuery = false) => {
    const { handlers, items, onUpdateField } = this.props;

    if (updateEntitlementQuery) {
      // add new entitlements, remove old ones (if they exist, this method is used for adding as well as updating)
      const removedId = items?.[index]?.id;
      const addedId = field?.id;
      if (removedId) {
        handlers.onEResourceRemoved(removedId);
      }
      handlers.onEResourceAdded(addedId);
    }

    onUpdateField(index, field);
  }

  parseDateOnlyString = (value, _timeZone, dateFormat) => {
    return (!value || value === '') ? value : moment(value).format(dateFormat);
  };

  renderComparisonPoints = () => {
    const { comparisonPoint: comparisonType, data, deleteButtonTooltipId, headerId } = this.props;
    const { name } = this.props;
    return this.props.items.map((comparisonPoint, index) => {
      return (
        <EditCard
          key={`${comparisonType} ${index}`}
          deleteBtnProps={{
            'data-test-comparison-point-delete-button': true,
            'id': `${name}-delete-${index}`,
          }}
          deleteButtonTooltipText={<FormattedMessage id={deleteButtonTooltipId} values={{ index: index + 1 }} />}
          header={<FormattedMessage id={headerId} values={{ number: index + 1 }} />}
          id={`data-test-comparison-point-${comparisonType}`}
          onDelete={() => this.props.onDeleteField(index, comparisonPoint)}
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
          <Row>
            <Col xs={3}>
              <Field
                component={Datepicker}
                defaultValue={this.state.currentDate}
                id={`data-test-field-date-${comparisonType}`}
                index={index}
                label={<FormattedMessage id="ui-erm-comparisons.newComparison.onDate" />}
                name={`${name}[${index}].onDate`}
                parser={this.parseDateOnlyString}
              />
            </Col>
          </Row>
        </EditCard>
      );
    });
  }

  renderAddNewButton() {
    const { addButtonId, addLabelId, disableAddNew } = this.props;
    return (
      <Button
        disabled={disableAddNew}
        id={addButtonId}
        marginBottom0
        onClick={() => this.props.onAddField()}
      >
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
