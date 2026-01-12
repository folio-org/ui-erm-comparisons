import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Col, Datepicker, Row } from '@folio/stripes/components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import { EditCard, requiredValidator } from '@folio/stripes-erm-components';
import ComparisonPointField from '../ComparisonPointField';

// Separate these out ready for centralised test resources
export const agreementToComparisonPoint = (agreement) => {
  return ({
    id: agreement.id,
    name: agreement.name,
    reasonForClosure: agreement.reasonForClosure?.label,
    startDate: agreement.startDate,
    status: agreement.agreementStatus?.label,
    endDate: agreement.endDate
  });
};

export const packageToComparisonPoint = (pkg) => {
  return ({
    id: pkg.id,
    name: pkg.name,
    count: pkg._object?.resourceCount,
    provider: pkg._object?.vendor?.name
  });
};

const ComparisonPointFieldArray = ({
  addButtonId,
  addLabelId,
  comparisonPoint,
  deleteButtonTooltipId,
  disableAddNew,
  fields: { name },
  headerId,
  id
}) => {
  const { items, onAddField, onDeleteField, onUpdateField } = useKiwtFieldArray(name, true);

  const handleComparisonPointSelected = (index, compPoint, comparisonType) => {
    if (comparisonType === 'agreement') {
      onUpdateField(index, {
        'comparisonPoint': agreementToComparisonPoint(compPoint)
      });
    } else if (comparisonType === 'package') {
      onUpdateField(index, {
        'comparisonPoint': packageToComparisonPoint(compPoint)
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
                backendDateStandard="YYYY-MM-DD"
                component={Datepicker}
                defaultValue={dayjs.utc().toISOString()}
                id={`data-test-field-date-${comparisonType}`}
                index={index}
                label={<FormattedMessage id="ui-erm-comparisons.newComparison.onDate" />}
                name={`${name}[${index}].onDate`}
                parse={v => v}
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
        {/*
          * It's kind of crazy that we're passing translation ids around here...
          * this whole component could use a refactor, we know the two cases.
          * Even if it was to be extended I don't think we really need to save the
          * logic of adding a button.
        */}
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
  deleteButtonTooltipId: PropTypes.string,
  disableAddNew: PropTypes.bool,
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
  headerId: PropTypes.string,
  id: PropTypes.string,
};

export default ComparisonPointFieldArray;
