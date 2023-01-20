import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import { Accordion, AccordionSet, FilterAccordionHeader, Layout, Row } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import ComparisonPointFilter from './ComparisonPointFilter';
import useComparisonPointLookup from './useComparisonPointLookup';

const FILTERS = [
  'status',
  'result'
];

const ComparisonFilters = ({
  activeFilters = {},
  data,
  filterHandlers
}) => {
  const [filterState, setFilterState] = useState({
    status: [],
    result: [],
    comparisonPointOne: {},
    comparisonPointTwo: {}
  });

  const { fetchedResources } = useComparisonPointLookup(filterState);

  useEffect(() => {
    // Set up refdata value options
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

    // Set comparison points from activeFilters if no filterState
    if (
      activeFilters.comparisonPointOne?.[0] &&
      isEmpty(filterState.comparisonPointOne)
    ) {
      setFilterState({ ...filterState, comparisonPointOne: { id: activeFilters.comparisonPointOne?.[0] } });
    }

    if (
      activeFilters.comparisonPointTwo?.[0] &&
      isEmpty(filterState.comparisonPointTwo)
    ) {
      setFilterState({ ...filterState, comparisonPointTwo: { id: activeFilters.comparisonPointTwo?.[0] } });
    }

    // If a lookup has happened and we find a resource for some id, insert name for pretty rendering
    if (
      !!filterState.comparisonPointOne?.id &&
      !filterState.comparisonPointOne.name &&
      !!fetchedResources[filterState.comparisonPointOne?.id]
    ) {
      setFilterState({
        ...filterState,
        comparisonPointOne: {
          ...filterState.comparisonPointOne,
          name: fetchedResources[filterState.comparisonPointOne?.id].name // Same access for Agreement and Package
        }
      });
    }

    if (
      !!filterState.comparisonPointTwo?.id &&
      !filterState.comparisonPointTwo.name &&
      !!fetchedResources[filterState.comparisonPointTwo?.id]
    ) {
      setFilterState({
        ...filterState,
        comparisonPointTwo: {
          ...filterState.comparisonPointTwo,
          name: fetchedResources[filterState.comparisonPointTwo?.id].name // Same access for Agreement and Package
        }
      });
    }
  }, [
    activeFilters.comparisonPointOne,
    activeFilters.comparisonPointTwo,
    data,
    fetchedResources,
    filterState
  ]);

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

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-erm-comparisons.prop.${name}`} />}
        name={name}
        onClearFilter={() => {
          filterHandlers.clearGroup(name);
          setFilterState({ ...filterState, [name]: {} });
        }}
        separator={false}
        {...prps}
      >
        {!isEmpty(filterState[name]) ?
          <Layout className="padding-bottom-gutter">
            {filterState[name]?.name ?? filterState[name]?.id}
          </Layout> : null
        }
        <Row>
          <ComparisonPointFilter
            disabled={!isEmpty(filterState[name])}
            name={name}
            onAgreementSelected={(agreement) => {
              filterHandlers.state({ ...activeFilters, [name]: [agreement.id] });
              setFilterState({ ...filterState, [name] : { id: agreement.id, name: agreement.name } });
            }}
            onPackageSelected={(pkg) => {
              filterHandlers.state({ ...activeFilters, [name]: [pkg.id] });
              setFilterState({ ...filterState, [name] : { id: pkg.id, name: pkg.name } });
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

export default ComparisonFilters;

ComparisonFilters.propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
};
