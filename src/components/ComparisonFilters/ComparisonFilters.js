import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionSet, FilterAccordionHeader, Layout, Row } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import ComparisonPointFilter from './ComparisonPointFilter';

const FILTERS = [
  'status',
  'result'
];

export default class ComparisonFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {
      status: [],
      result: [],
      comparisonPointOne: [],
      comparisonPointTwo: [],
    }
  };

  state = {
    status: [],
    result: [],
    comparisonPointOne: [],
    comparisonPointTwo: [],
    comparisonPointOneValue: '',
    comparisonPointTwoValue: '',
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    FILTERS.forEach(filter => {
      const values = props.data[`${filter}Values`];
      if (values.length !== state[filter].length) {
        newState[filter] = values.map(({ label }) => ({ label, value: label }));
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }


  renderCheckboxFilter = (name, props) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[name] || [];
    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-erm-comparisons.prop.${name}`} />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup(name); }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[name]}
          name={name}
          onChange={(group) => { this.props.filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  }

  renderComparisonPointFilter = (name, props) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[name] || [];

    let disabled = false;
    if (this.state[`${name}Value`]) {
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
          this.props.filterHandlers.clearGroup(name);
          this.setState({ [`${name}Value`]: '' });
        }}
        separator={false}
        {...props}
      >
        {this.state[`${name}Value`] ?
          <Layout className="padding-bottom-gutter">
            {this.state[`${name}Value`]}
          </Layout> : null
        }
        <Row>
          <ComparisonPointFilter
            disabled={disabled}
            name={name}
            onAgreementSelected={(agreement) => {
              this.props.filterHandlers.state({ ...activeFilters, [name]: [agreement.id] });
              this.setState({ [`${name}Value`] : agreement.name });
            }}
            onPackageSelected={(pkg) => {
              this.props.filterHandlers.state({ ...activeFilters, [name]: [pkg.id] });
              this.setState({ [`${name}Value`]: pkg.name });
            }}
          />
        </Row>
      </Accordion>
    );
  }

  render() {
    return (
      <div data-test-checkboxfilters>
        <AccordionSet>
          {this.renderCheckboxFilter('status')}
          {this.renderCheckboxFilter('result')}
          {this.renderComparisonPointFilter('comparisonPointOne')}
          {this.renderComparisonPointFilter('comparisonPointTwo')}
        </AccordionSet>
      </div>
    );
  }
}
