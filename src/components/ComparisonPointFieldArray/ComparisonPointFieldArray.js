import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Col, Datepicker, Row } from '@folio/stripes/components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import { EditCard, requiredValidator } from '@folio/stripes-erm-components';
import ComparisonPointField from './ComparisonPointField';

const ComparisonPointFieldArray = ({
  addButtonId,
  addLabelId,
  comparisonPoint,
  data,
  deleteButtonTooltipId,
  disableAddNew,
  fields: { name },
  handlers,
  headerId,
  id
}) => {
  const { items, onAddField, onDeleteField, onUpdateField } = useKiwtFieldArray(name, true);

  const handleUpdateField = (index, field, updateEntitlementQuery = false) => {
    if (updateEntitlementQuery) {
      // add new entitlements, remove old ones (if they exist, this method is used for adding as well as updating)
      const removedId = items?.[index]?.comparisonPoint?.id;
      const addedId = field?.comparisonPoint?.id;
      if (removedId) {
        handlers.onEResourceRemoved(removedId);
      }
      handlers.onEResourceAdded(addedId);
    }

    onUpdateField(index, field);
  };

  const handleComparisonPointSelected = (index, compPoint, comparisonType) => {
    if (comparisonType === 'agreement') {
      handleUpdateField(index, {
        'comparisonPoint': {
          id: compPoint.id,
          name: compPoint.name,
          reasonForClosure: compPoint.reasonForClosure?.label,
          startDate: compPoint.startDate,
          status: compPoint.agreementStatus?.label,
          endDate: compPoint.endDate
        }
      });
    } else if (comparisonType === 'package') {
      handlers.onEResourceAdded(compPoint.id);
      handleUpdateField(index, {
        'comparisonPoint': {
          id: compPoint.id,
          name: compPoint.name,
          count: compPoint._object?.resourceCount,
          provider: compPoint._object?.vendor?.name
        }
      }, true);
    }
  };

  const renderComparisonPoints = () => {
    const comparisonType = comparisonPoint;
    return items.map((compPoint, index) => {
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
          onDelete={() => onDeleteField(index, compPoint)}
        >
          <Field
            comparisonType={comparisonType}
            component={ComparisonPointField}
            entitlements={data?.entitlements}
            id={`data-test-field-comparison-point-${comparisonType}`}
            index={index}
            name={`${name}[${index}].comparisonPoint`}
            onComparisonPointSelected={selectedComparisonPoint => handleComparisonPointSelected(index, selectedComparisonPoint, comparisonType)}
            required
            validate={requiredValidator}
          />
          <Row>
            <Col xs={3}>
              <Field
                component={Datepicker}
                defaultValue={moment.utc().startOf('day').toISOString()}
                id={`data-test-field-date-${comparisonType}`}
                index={index}
                label={<FormattedMessage id="ui-erm-comparisons.newComparison.onDate" />}
                name={`${name}[${index}].onDate`}
                required
                timeZone="UTC"
                usePortal
                validate={requiredValidator}
              />
            </Col>
          </Row>
        </EditCard>
      );
    });
  };

  const renderAddNewButton = () => {
    return (
      <Button
        disabled={disableAddNew}
        id={addButtonId}
        marginBottom0
        onClick={() => onAddField()}
      >
        <FormattedMessage id={addLabelId} />
      </Button>
    );
  };

  return (
    <div>
      <div id={id}>
        {renderComparisonPoints()}
      </div>
      {renderAddNewButton()}
    </div>
  );
};

ComparisonPointFieldArray.propTypes = {
  addButtonId: PropTypes.string,
  addLabelId: PropTypes.string,
  comparisonPoint: PropTypes.string,
  data: PropTypes.object,
  deleteButtonTooltipId: PropTypes.string,
  disableAddNew: PropTypes.bool,
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
  handlers: PropTypes.object,
  headerId: PropTypes.string,
  id: PropTypes.string,
};

export default ComparisonPointFieldArray;
