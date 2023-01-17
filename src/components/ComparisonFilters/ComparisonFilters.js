import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionSet, FilterAccordionHeader, Layout, Row } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import ComparisonPointFilter from './ComparisonPointFilter';

const propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
};

const FILTERS = [
  'status',
  'result'
];

export default function ComparisonFilters({ activeFilters, data, filterHandlers }) {
  const [filterState, setFilterState] = useState({
    status: [],
    result: [],
    comparisonPointOne: [],
    comparisonPointTwo: [],
    comparisonPointOneValue: '',
    comparisonPointTwoValue: ''
  });

  const comparisonPointOneName = filterState?.comparisonPointOneValue?.[0];
  const comparisonPointTwoName = filterState?.comparisonPointTwoValue?.[0];
  const comparisonPointOneId = activeFilters?.comparisonPointOne?.[0];
  const comparisonPointTwoId = activeFilters?.comparisonPointTwo?.[0];

  useEffect(() => {
    const newState = {};
    FILTERS.forEach(filter => {
      const values = data[`${filter}Values`];
      if (values.length !== filterState[filter]?.length) {
        newState[filter] = values;
      }
    });

    if (Object.keys(newState).length) {
      setFilterState(prevState => ({ ...prevState, ...newState }));
    }

    if (!comparisonPointOneId && comparisonPointOneName) {
      setFilterState([]);
    }

    if (!comparisonPointTwoId && comparisonPointTwoName) {
      setFilterState([]);
    }
  }, [comparisonPointTwoName, comparisonPointTwoId, comparisonPointOneName, comparisonPointOneId, data, filterState]);


  const renderCheckboxFilter = (name, prps) => {
    const groupFilters = activeFilters[name] || [];
    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-erm-comparisons.prop.${name}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(name); }}
        separator={false}
        {...prps}
      >
        <CheckboxFilter
          dataOptions={filterState[name] || []}
          name={name}
          onChange={(group) => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderComparisonPointFilter = (name, prps) => {
    const groupFilters = activeFilters[name] || [];

    let disabled = false;
    if (filterState[`${name}Value`]) {
      disabled = true;
    }

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-erm-comparisons.prop.${name}`} />}
        name={name}
        onClearFilter={() => {
          filterHandlers.clearGroup(name);
          setFilterState({ [`${name}Value`]: '' });
        }}
        separator={false}
        {...prps}
      >
        {filterState[`${name}Value`] ?
          <Layout className="padding-bottom-gutter">
            {filterState[`${name}Value`]}
          </Layout> : null
        }
        <Row>
          <ComparisonPointFilter
            disabled={disabled}
            name={name}
            onAgreementSelected={(agreement) => {
              filterHandlers.state({ ...activeFilters, [name]: [agreement.id] });
              setFilterState({ [`${name}Value`] : agreement.name });
            }}
            onPackageSelected={(pkg) => {
              filterHandlers.state({ ...activeFilters, [name]: [pkg.id] });
              setFilterState({ [`${name}Value`]: pkg.name });
            }}
          />
        </Row>
      </Accordion>
    );
  };

  return (
    <div data-test-checkboxfilters>
      <AccordionSet>
        {renderCheckboxFilter('status')}
        {renderCheckboxFilter('result')}
        {renderComparisonPointFilter('comparisonPointOne')}
        {renderComparisonPointFilter('comparisonPointTwo')}
      </AccordionSet>
    </div>
  );
}

ComparisonFilters.propTypes = propTypes;
ComparisonFilters.defaultProps = {
  activeFilters: {}
};
