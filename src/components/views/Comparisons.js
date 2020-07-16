import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { noop } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { AppIcon, IfPermission } from '@folio/stripes/core';

import {
  Button,
  Icon,
  MultiColumnList,
  NoValue,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';

import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import { ComparisonFilters } from '../ComparisonFilters';
import FormattedDateTime from '../FormattedDateTime';
import css from './Comparisons.css';

export default class Comparisons extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    contentRef: PropTypes.object,
    data: PropTypes.object,
    onNeedMoreData: PropTypes.func,
    queryGetter: PropTypes.func,
    querySetter: PropTypes.func,
    searchString: PropTypes.string,
    selectedRecordId: PropTypes.string,
    source: PropTypes.object,
  }

  static defaultProps = {
    data: {},
    searchString: '',
  }

  state = {
    filterPaneIsVisible: true
  }

  columnMapping = {
    comparisonName: <FormattedMessage id="ui-erm-comparisons.prop.comparisonName" />,
    runningStatus: <FormattedMessage id="ui-erm-comparisons.prop.runningStatus" />,
    result: <FormattedMessage id="ui-erm-comparisons.prop.outcome" />,
    errors: <FormattedMessage id="ui-erm-comparisons.prop.errors" />,
    started: <FormattedMessage id="ui-erm-comparisons.prop.started" />,
    ended: <FormattedMessage id="ui-erm-comparisons.prop.ended" />,
  }

  columnWidths = {
    ended: 150,
    errors: 100,
    comparisonName: 300,
    runningStatus: 150,
    result: 150,
    started: 150,
  }

  formatter = {
    ended: ({ ended }) => (ended ? <FormattedDateTime date={ended} /> : <NoValue />),
    errors: ({ errorLogCount }) => errorLogCount,
    comparisonName: ({ name }) => name,
    runningStatus: ({ status }) => status && status.label,
    result: ({ result }) => result && result.label,
    started: ({ started }) => (started ? <FormattedDateTime date={started} /> : <NoValue />),
  }

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;

    return (
      <Link
        key={`row-${rowIndex}`}
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={rowData.name}
        role="row"
        to={this.rowURL(rowData.id)}
        {...rowProps}
      >
        {cells}
      </Link>
    );
  }

  rowURL = (id) => {
    return `/comparisons-erm/${id}${this.props.searchString}`;
  }

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return 'no source yet';
    }

    return (
      <div data-test-comparison-no-results-message>
        <NoResultsMessage
          filterPaneIsVisible
          searchTerm={query.query || ''}
          source={source}
          toggleFilterPane={noop}
        />
      </div>
    );
  }

  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }


  renderResultsLastMenu() {
    const { searchString } = this.props;
    return (
      <IfPermission perm="ui-erm-comparisons.jobs.edit">
        <Button
          bottomMargin0
          buttonStyle="primary"
          to={`/comparisons-erm/create${searchString}`}
        >
          <FormattedMessage id="ui-erm-comparisons.comparison.new" />
        </Button>
      </IfPermission>
    );
  }

  renderResultsPaneSubtitle = (source) => {
    if (source && source.loaded()) {
      const count = source ? source.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  render() {
    const {
      children,
      contentRef,
      data,
      onNeedMoreData,
      queryGetter,
      querySetter,
      selectedRecordId,
      source,
    } = this.props;

    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';
    const visibleColumns = ['comparisonName', 'runningStatus', 'result', 'errors', 'started', 'ended'];

    return (
      <div ref={contentRef} data-test-ermcomparisons>
        <SearchAndSortQuery
          initialFilterState={{ status: ['Queued', 'In progress'] }}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: '-started' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
        >
          {
            ({
              searchValue,
              getSearchHandlers,
              onSubmitSearch,
              onSort,
              getFilterHandlers,
              activeFilters,
              filterChanged,
              searchChanged,
              resetAll,
            }) => {
              const disableReset = () => (!filterChanged && !searchChanged);

              return (
                <Paneset id="erm-comparisons-paneset">
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      onClose={this.toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        {/* TODO: Use forthcoming <SearchGroup> or similar component */}
                        <div className={css.searchGroupWrap}>
                          <FormattedMessage id="ui-erm-comparisons.searchInputLabel">
                            {ariaLabel => (
                              <SearchField
                                aria-label={ariaLabel}
                                autoFocus
                                className={css.searchField}
                                data-test-erm-comparisons-search-input
                                id="input-erm-comparisons-search"
                                inputRef={this.searchField}
                                marginBottom0
                                name="query"
                                onChange={getSearchHandlers().query}
                                onClear={() => {
                                  getSearchHandlers().clear();
                                  // TODO: Add way to trigger search automatically
                                  // onSubmitSearch();
                                }}
                                value={searchValue.query}
                              />
                            )}
                          </FormattedMessage>
                          <Button
                            buttonStyle="primary"
                            disabled={!searchValue.query || searchValue.query === ''}
                            fullWidth
                            id="clickable-search-comparisons"
                            marginBottom0
                            type="submit"
                          >
                            <FormattedMessage id="stripes-smart-components.search" />
                          </Button>
                        </div>
                        <div className={css.resetButtonWrap}>
                          <Button
                            buttonStyle="none"
                            disabled={disableReset()}
                            id="clickable-reset-all"
                            onClick={resetAll}
                          >
                            <Icon icon="times-circle-solid">
                              <FormattedMessage id="stripes-smart-components.resetAll" />
                            </Icon>
                          </Button>
                        </div>
                        <ComparisonFilters
                          activeFilters={activeFilters.state}
                          data={data}
                          filterHandlers={getFilterHandlers()}
                        />
                      </form>
                    </Pane> }
                  <Pane
                    appIcon={<AppIcon app="erm-comparisons" />}
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    lastMenu={this.renderResultsLastMenu()}
                    noOverflow
                    padContent={false}
                    paneSub={this.renderResultsPaneSubtitle(source)}
                    paneTitle={<FormattedMessage id="ui-erm-comparisons.meta.title" />}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={data.comparisons}
                      formatter={this.formatter}
                      id="list-comparisons"
                      isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                      isSelected={({ item }) => item.id === selectedRecordId}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      rowFormatter={this.rowFormatter}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={visibleColumns}
                    />
                  </Pane>
                  {children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}
