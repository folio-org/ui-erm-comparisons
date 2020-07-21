import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  InfoPopover,
  Layout,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  Embargo,
  SerialCoverage,
  TitleOnPlatformLink
} from '@folio/stripes-erm-components';

import TitleInfoPopover from '../TitleInfoPopover';
import {
  getResourceProperties,
  getResourceColumnHeader,
  getResourceOccurrence
} from '../utilities';

import css from './ComparisonReportList.css';

const ComparisonReportList = ({ sourceData }) => {
  const {
    comparisonPointData: { comparisonPoints = [] },
    report
  } = sourceData;

  const [comparisonResourceA, comparisonResourceB] = comparisonPoints;

  const getCoverage = (statements, embargo) => {
    if (!statements.length && !embargo) return null;
    return (
      <Layout className="full" data-test-coverage>
        <SerialCoverage statements={statements} />
        <Layout className="padding-top-gutter">
          <Embargo embargo={embargo} />
        </Layout>
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
      columnMapping={columnMapping}
      columnWidths={{
        title: 400,
        availableVia: 400,
        coverage: 300,
        resourceA: 300,
        resourceB: 300,
        overlap: 120
      }}
      contentData={report}
      formatter={{
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
              <div data-test-title><strong>{rowData.longName}</strong></div>
            </Layout>
          );
        },
        overlap: r => {
          return (
            <Layout className="centered" data-test-overlap>
              {r.overlap}
            </Layout>
          );
        },
      }}
      getCellClass={(defaultClass, rowData, column) => {
        const { overlap } = rowData;
        return column === 'overlap' ? `${defaultClass} ${css[overlap]}` : defaultClass;
      }}
      getHeaderCellClass={(header) => {
        return ['coverage', 'resourceA', 'resourceB', 'overlap'].includes(header) ? css[header] : undefined;
      }}
      id="comparison-report-mcl"
      interactive={false}
      rowFormatter={({
        cells,
        interactive,
        labelStrings,
        rowClass,
        rowData,
        rowIndex,
        rowProps,
      }) => {
        return (
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
              <div className={css.nestedMcl}>
                <MultiColumnList
                  columnWidths={{
                    availableVia: 400,
                    coverage: 300,
                    resourceA: 300,
                    resourceB: 300,
                  }}
                  contentData={Object.values(rowData.availability)}
                  formatter={{
                    availableVia: r => {
                      if (r.platform === Object.values(rowData.availability)[r.rowIndex - 1]?.platform) return ''; // logic to display the platform only once per title

                      const { id, name } = rowData;
                      const { platform, url } = r;

                      return (
                        <TitleOnPlatformLink
                          id={id}
                          name={name}
                          platform={platform}
                          url={url}
                        />
                      );
                    }
                  }}
                  headerRowClass="sr-only"
                  id="availability-mcl"
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
                          <div className={css.nestedMcl}>
                            <MultiColumnList
                              columnWidths={{
                                coverage: 300,
                                resourceA: 300,
                                resourceB: 300,
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
                              id="coverage-mcl"
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
                                    className={rowClass}
                                    data-test-coverage-mcl-row
                                    {...rowProps}
                                  >
                                    {cells}
                                  </div>
                                );
                              }}
                              tabIndex="-1"
                              visibleColumns={['coverage', 'resourceA', 'resourceB']}
                            />
                          </div>
                        }
                      </div>
                    );
                  }}
                  tabIndex="-1"
                  visibleColumns={['availableVia']}
                />
              </div>
            }
            {
               /* Render the overlap cell as-is because it'll only ever be one row and we can trust the `formatter` */
              cells[5]
            }
          </div>
        );
      }}
      visibleColumns={['title', 'availableVia', 'coverage', 'resourceA', 'resourceB', 'overlap']}
    />
  );
};

ComparisonReportList.propTypes = {
  sourceData: PropTypes.shape({
    comparisonPointData: PropTypes.shape({
      comparisonPoints: PropTypes.array,
    }),
    report: PropTypes.arrayOf(PropTypes.object)
  }),
};

export default ComparisonReportList;
