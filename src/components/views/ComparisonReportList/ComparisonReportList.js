import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';

import {
  Icon,
  InfoPopover,
  Layout,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  Embargo,
  SerialCoverage,
  TitleOnPlatformLink
} from '@folio/stripes-erm-components';

import TitleInfoPopover from '../../TitleInfoPopover';

import {
  getResourceProperties,
  getResourceColumnHeader,
  getResourceOccurrence
} from '../../utilities';
import css from './ComparisonReportList.css';

const ComparisonReportList = (
  {
    isLoading,
    onNeedMoreData,
    sourceData,
    totalCount
  }
) => {
  const {
    comparisonPointData: { comparisonPoints = [] },
    report
  } = sourceData;

  const icon = 'spinner-ellipsis';
  const label = <FormattedMessage id="ui-erm-comparisons.comparisonReport.buildingReport" />;

  if (isLoading) {
    return (
      <div className={css.emptyReportMessage}>
        <div className={css.emptyReportMessageLabelWrap}>
          {icon && <Icon icon={icon} iconRootClass={css.emptyReportMessageIcon} />}
          <span className={css.emptyReportMessageLabel}>{label}</span>
        </div>
      </div>
    );
  }

  const [comparisonResourceA, comparisonResourceB] = comparisonPoints;

  // Nest MCL only if we need to
  const shouldNestMCL = (rowData) => {
    const availability = Object.values(rowData.availability);
    if (availability.length <= 1) {
      const coverage = Object.values(availability?.[0]?.coverage ?? {});
      if (coverage.length <= 1) return false;
    }

    return true;
  };

  const getCoverage = (statements, embargo, uniqueKey = 'getCoverage') => {
    if (!statements.length && !embargo) return '';
    return (
      <Layout key={`coverage-layout-${uniqueKey}`} className="full" data-test-coverage>
        <SerialCoverage key={`serial-coverage-${uniqueKey}`} statements={statements} />
        {embargo &&
          <Layout key={`embargo-layout-${uniqueKey}`} className="padding-top-gutter">
            <Embargo embargo={embargo} />
          </Layout>
        }
      </Layout>
    );
  };

  const columnMapping = {
    title: <FormattedMessage id="ui-erm-comparisons.comparisonReport.title" />,
    availableVia: <FormattedMessage id="ui-erm-comparisons.comparisonReport.availableVia" />,
    coverage: <FormattedMessage id="ui-erm-comparisons.comparisonReport.coverage" />,
    resourceA: getResourceColumnHeader(comparisonResourceA),
    resourceB: getResourceColumnHeader(comparisonResourceB),
    overlap: <FormattedMessage id="ui-erm-comparisons.comparisonReport.overlap" />,
  };

  return (
    <MultiColumnList
      autosize
      columnMapping={columnMapping}
      columnWidths={{
        title: 400,
        availableVia: 250,
        coverage: 300,
        resourceA: 250,
        resourceB: 250,
        overlap: { max: 200 }
      }}
      contentData={report}
      formatter={{
        availableVia: rowData => {
          const { id } = rowData;

          return !shouldNestMCL(rowData) ? (
            <Layout className="display-flex flex-direction-column">
              {Object.values(rowData.availability).map(value => {
                const { longName, platform, url } = value;
                return (
                  <TitleOnPlatformLink
                    key={id}
                    id={id}
                    name={longName}
                    platform={platform}
                    url={url}
                  />
                );
              })
              }
            </Layout>
          ) : true;
        },
        coverage: rowData => {
          return !shouldNestMCL(rowData) ? (
            <Layout className="display-flex flex-direction-column full">
              {Object.values(rowData.availability).map((availability, i) => {
                const { coverage } = availability;
                return Object.values(coverage).map((cov, j) => {
                  const { statements, embargo } = cov;
                  return getCoverage(statements, embargo, `${i}-${j}`);
                });
              })
              }
            </Layout>
          ) : true;
        },
        resourceA: rowData => {
          return !shouldNestMCL(rowData) ? (
            <Layout className="display-flex full">
              {Object.values(rowData.availability).map(availability => {
                const { coverage } = availability;
                return Object.values(coverage).map(cov => {
                  return getResourceOccurrence(cov, getResourceProperties(comparisonResourceA));
                });
              })
              }
            </Layout>
          ) : true;
        },
        resourceB: rowData => {
          return !shouldNestMCL(rowData) ? (
            <Layout className="display-flex full">
              {Object.values(rowData.availability).map(availability => {
                const { coverage } = availability;
                return Object.values(coverage).map(cov => {
                  return getResourceOccurrence(cov, getResourceProperties(comparisonResourceB));
                });
              })
              }
            </Layout>
          ) : true;
        },
        title: rowData => {
          return (
            <Layout className="display-flex">
              <InfoPopover
                content={
                  <TitleInfoPopover
                    titleInstance={rowData}
                  />
                }
                contentClass={css.titleInfoPopoverContent}
              />
              &nbsp;
              <div data-test-title>
                <strong>
                  {rowData.longName}
                </strong>
              </div>
            </Layout>
          );
        },
        overlap: r => {
          const { overlap } = r;
          return (
            <Layout className="centered" data-test-overlap>
              <strong>
                <FormattedMessage
                  id={`ui-erm-comparisons.comparisonReport.overlap.${overlap}`}
                />
              </strong>
            </Layout>
          );
        },
      }}
      getCellClass={(defaultClass, rowData, column) => {
        const { overlap } = rowData;
        if (column === 'overlap') {
          return `${defaultClass} ${css[overlap]} ${css.borderCell}`;
        } else if (column === 'title') {
          return `${defaultClass} ${css.titleCell} ${css.borderCell}`;
        }
        return `${defaultClass} ${css.borderCell}`;
      }}
      getHeaderCellClass={(header) => {
        return ['coverage', 'resourceA', 'resourceB', 'overlap'].includes(header) ? css[header] : undefined;
      }}
      id="comparison-report-mcl"
      interactive={false}
      onNeedMoreData={onNeedMoreData}
      pagingButtonLabel={<FormattedMessage id="ui-erm-comparisons.comparisonReport.loadAll" />}
      pagingType="click"
      rowFormatter={({
        cells,
        interactive,
        labelStrings,
        rowClass,
        rowData,
        rowIndex,
        rowProps,
      }) => {
        return shouldNestMCL(rowData) ? (
          <div
            key={`row-${rowIndex}`}
            aria-label={labelStrings[0]}
            className={rowClass}
            data-test-report-mcl-row
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex="0"
            {...rowProps}
          >
            {
              /* Render the title cell as-is because it'll only ever be one row and we can trust the `formatter` */
              cells[0]
            }
            {
              <div aria-colspan="4" className={`${css.nestedMcl} ${css.borderCell}`}>
                <MultiColumnList
                  columnWidths={{
                    availableVia: 250,
                    coverage: 300,
                    resourceA: 250,
                    resourceB: 250,
                  }}
                  contentData={Object.values(rowData.availability)}
                  formatter={{
                    availableVia: r => {
                      if (r.platform === Object.values(rowData.availability)[r.rowIndex - 1]?.platform) return ''; // logic to display the platform only once per title
                      const { id } = rowData;
                      const { longName, platform, url } = r;
                      return (
                        <TitleOnPlatformLink
                          id={id}
                          name={longName}
                          platform={platform}
                          url={url}
                        />
                      );
                    },
                    coverage: () => true
                  }}
                  headerRowClass="sr-only"
                  id={`availability-mcl-${rowData.id}`}
                  interactive={interactive}
                  rowFormatter={({
                    /* eslint-disable no-shadow */
                    cells,
                    interactive,
                    rowClass,
                    rowData,
                    rowIndex,
                    rowProps,
                  }) => {
                    return (
                      <div
                        key={`row-${rowIndex}`}
                        className={rowClass}
                        data-test-availability-mcl-row
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        tabIndex="0"
                        {...rowProps}
                      >
                        {cells[0]}
                        {
                          // no css.borderCell needed here, it would double the cell border
                          <div aria-colspan="3" className={css.nestedMcl}>
                            <MultiColumnList
                              columnWidths={{
                                coverage: 300,
                                resourceA: 250,
                                resourceB: 250,
                              }}
                              contentData={Object.values(rowData.coverage)}
                              formatter={{
                                coverage: (r) => {
                                  const { statements, embargo } = r;
                                  return getCoverage(statements, embargo);
                                },
                                resourceA: r => getResourceOccurrence(r, getResourceProperties(comparisonResourceA)),
                                resourceB: r => getResourceOccurrence(r, getResourceProperties(comparisonResourceB))
                              }}
                              headerRowClass="sr-only"
                              id={uniqueId('coverage-mcl')}
                              interactive={interactive}
                              rowFormatter={({
                                /* eslint-disable no-shadow */
                                cells,
                                rowClass,
                                rowIndex,
                                rowProps,
                              }) => {
                                return (
                                  <div
                                    key={`row-${rowIndex}`}
                                    className={`${rowClass} ${rowIndex !== 0 ? css.borderCell : ''}`}
                                    data-test-coverage-mcl-row
                                    {...rowProps}
                                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                                    tabIndex="0"
                                  >
                                    {cells}
                                  </div>
                                );
                              }}
                              visibleColumns={['coverage', 'resourceA', 'resourceB']}
                            />
                          </div>
                        }
                      </div>
                    );
                  }}
                  visibleColumns={['availableVia', 'coverage', 'resourceA', 'resourceB']}
                />
              </div>
            }
            {
              /* Render the overlap cell as-is because it'll only ever be one row and we can trust the `formatter` */
              cells[5]
            }
          </div>
        ) :
          <div
            key={`row-${rowIndex}`}
            aria-label={labelStrings[0]}
            className={rowClass}
            data-test-report-mcl-row
            {...rowProps}
          >
            {cells}
          </div>;
      }}
      totalCount={totalCount}
      visibleColumns={['title', 'availableVia', 'coverage', 'resourceA', 'resourceB', 'overlap']}
    />
  );
};

ComparisonReportList.propTypes = {
  isLoading: PropTypes.bool,
  onNeedMoreData: PropTypes.func,
  sourceData: PropTypes.shape({
    comparisonPointData: PropTypes.shape({
      comparisonPoints: PropTypes.arrayOf(PropTypes.object),
    }),
    report: PropTypes.arrayOf(PropTypes.object)
  }),
  totalCount: PropTypes.number
};

export default ComparisonReportList;
