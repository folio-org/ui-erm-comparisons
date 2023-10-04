import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { AppIcon, IfPermission } from '@folio/stripes/core';

import {
  Button,
  HasCommand,
  Icon,
  MultiColumnList,
  NoValue,
  Pane,
  PaneMenu,
  SearchField,
  checkScope
} from '@folio/stripes/components';

import {
  SearchAndSortQuery,
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  PersistedPaneset,
  SearchAndSortNoResultsMessage,
} from '@folio/stripes/smart-components';
import { FormattedDateTime, usePrevNextPagination } from '@folio/stripes-erm-components';

import { resultCount } from '../../../constants';
import { ComparisonFilters } from '../../ComparisonFilters';
import css from './Comparisons.css';

const propTypes = {
  children: PropTypes.node,
  contentRef: PropTypes.object,
  data: PropTypes.object,
  history: PropTypes.object,
  onNeedMoreData: PropTypes.func,
  queryGetter: PropTypes.func,
  querySetter: PropTypes.func,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.object,
};

const filterPaneVisibilityKey = '@folio/ui-erm-comparisons/comparisonsFilterPaneVisibility';
const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const Comparisons = ({
  children,
  contentRef,
  data,
  history,
  onNeedMoreData,
  queryGetter,
  querySetter,
  searchField,
  searchString,
  selectedRecordId,
  source
}) => {
  const count = source?.totalCount() ?? 0;
  const query = queryGetter() ?? {};
  const sortOrder = query.sort ?? '';

  const {
    paginationMCLProps,
    paginationSASQProps
  } = usePrevNextPagination({
    count,
    pageSize: RESULT_COUNT_INCREMENT_MEDIUM
  });

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(storedFilterPaneVisibility);
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
    writeStorage(filterPaneVisibilityKey, !filterPaneIsVisible);
  };


  const goToNew = () => {
    history.push(`/comparisons-erm/create${searchString}`);
  };

  const shortcuts = [
    {
      name: 'new',
      handler: goToNew,
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <div ref={contentRef} data-test-ermcomparisons data-testid="comparisons">
        <SearchAndSortQuery
          {...paginationSASQProps}
          initialFilterState={{ }}
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
            const filterCount = activeFilters.string ? activeFilters.string.split(',').length : 0;
            return (
              <PersistedPaneset appId="@folio/erm-comparisons" id="erm-comparisons-paneset" >
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="20%"
                    lastMenu={
                      <PaneMenu>
                        <CollapseFilterPaneButton onClick={toggleFilterPane} />
                      </PaneMenu>
                    }
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
                              inputRef={searchField}
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
                  firstMenu={
                    !filterPaneIsVisible ?
                      (
                        <PaneMenu>
                          <ExpandFilterPaneButton
                            filterCount={filterCount}
                            onClick={toggleFilterPane}
                          />
                        </PaneMenu>
                      )
                      :
                      null
                  }
                  lastMenu={
                    <IfPermission perm="ui-erm-comparisons.jobs.edit">
                      <Button
                        bottomMargin0
                        buttonStyle="primary"
                        to={`/comparisons-erm/create${searchString}`}
                      >
                        <FormattedMessage id="ui-erm-comparisons.comparison.new" />
                      </Button>
                    </IfPermission>
                  }
                  noOverflow
                  padContent={false}
                  paneSub={
                    source?.loaded() ?
                      <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count: source.totalCount() }} />
                      :
                      <FormattedMessage id="stripes-smart-components.searchCriteria" />
                  }
                  paneTitle={<FormattedMessage id="ui-erm-comparisons.meta.title" />}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      comparisonName: <FormattedMessage id="ui-erm-comparisons.prop.comparisonName" />,
                      runningStatus: <FormattedMessage id="ui-erm-comparisons.prop.runningStatus" />,
                      result: <FormattedMessage id="ui-erm-comparisons.prop.outcome" />,
                      errors: <FormattedMessage id="ui-erm-comparisons.prop.errors" />,
                      started: <FormattedMessage id="ui-erm-comparisons.prop.started" />,
                      ended: <FormattedMessage id="ui-erm-comparisons.prop.ended" />,
                    }}
                    columnWidths={{
                      ended: 150,
                      errors: 100,
                      comparisonName: 300,
                      runningStatus: 150,
                      result: 150,
                      started: 150,
                    }}
                    contentData={data.comparisons}
                    formatter={{
                      ended: ({ ended }) => (ended ? <FormattedDateTime date={ended} /> : <NoValue />),
                      errors: ({ errorLogCount }) => errorLogCount,
                      comparisonName: ({ name }) => {
                        return (
                          <AppIcon
                            app="erm-comparisons"
                            iconAlignment="baseline"
                            iconKey="app"
                            size="small"
                          >
                            <div style={{ overflowWrap: 'break-word', width: 460 }}>
                              {name}
                            </div>
                          </AppIcon>
                        );
                      },
                      runningStatus: ({ status }) => status && status.label,
                      result: ({ result }) => result && result.label,
                      started: ({ started }) => (started ? <FormattedDateTime date={started} /> : <NoValue />),
                    }}
                    id="list-comparisons"
                    isEmptyMessage={
                      source ? (
                        <div>
                          <SearchAndSortNoResultsMessage
                            filterPaneIsVisible
                            searchTerm={query.query ?? ''}
                            source={source}
                            toggleFilterPane={toggleFilterPane}
                          />
                        </div>
                      ) : '...'
                    }
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    rowProps={{
                      labelStrings: ({ rowData }) => [rowData.name],
                      to: id => `/erm-comparisons/${id}${searchString}`
                    }}
                    {...paginationMCLProps}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={[
                      'comparisonName',
                      'runningStatus',
                      'result',
                      'errors',
                      'started',
                      'ended'
                    ]}
                  />
                </Pane>
                {children}
              </PersistedPaneset>
            );
          }
        }
        </SearchAndSortQuery>
      </div>
    </HasCommand>
  );
};

Comparisons.propTypes = propTypes;
export default Comparisons;

