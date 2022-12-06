import React from 'react';
import PropTypes from 'prop-types';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ComparisonViewRoute from './ComparisonViewRoute';

const ExportReportAsJSONButton = (props) => {
  return <Button onClick={props.handlers.onExportReportAsJSON}>ExportReportAsJSONButton</Button>;
};

const CloseButton = (props) => {
  return <Button onClick={props.onClose}>CloseButton</Button>;
};

const DeleteButton = (props) => {
  return <Button onClick={props.onDelete}>DeleteButton</Button>;
};

const ViewReportButton = (props) => {
  return <Button onClick={props.onViewReport}>ViewReportButton</Button>;
};

ExportReportAsJSONButton.propTypes = {
  handlers: PropTypes.shape({
    onExportReportAsJSON: PropTypes.func,
  }),
};

CloseButton.propTypes = {
  onClose: PropTypes.func,
};

DeleteButton.propTypes = {
  onDelete: PropTypes.func,
};

ViewReportButton.propTypes = {
  onViewReport: PropTypes.func,
};

const historyPushMock = jest.fn();
const historyReplaceMock = jest.fn();

jest.mock('../../components/views/ComparisonView', () => {
  return (props) => (
    <div>
      <div>ComparisonView</div>
      <ExportReportAsJSONButton {...props} />
      <CloseButton {...props} />
      <DeleteButton {...props} />
      <ViewReportButton {...props} />
    </div>
  );
});

const data = {
  history: {
    push: historyPushMock,
    replace: historyReplaceMock
  },
  location: {
    pathname: '/comparisons-erm/85f1c1f4-d619-4c07-a2f8-8163c3579bf9',
    search: ''
  },
  mutator: {
    comparisons: {
      DELETE: jest.fn(),
      PUT: jest.fn(),
      POST: jest.fn(),
      cancel: jest.fn()
    }
  },
  resources: {
    'comparison': {
      'hasLoaded': true,
      'isPending': false,
      'failed': false,
      'records': [
        '{class: "org.olf.general.jobs.ComparisonJob", compa…}'
      ],
      'successfulMutations': [],
      'failedMutations': [],
      'pendingMutations': [],
      'loadedAt': 'Tue Dec 06 2022 11:14:49 GMT+0000 (Greenwich Mean Time)',
      'url': 'http://folio-snapshot-2-okapi.dev.folio.org/erm/jobs/85f1c1f4-d619-4c07-a2f8-8163c3579bf9',
      'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
      'httpStatus': 200,
      'other': {
        'totalRecords': null
      },
      'resource': 'comparison',
      'module': '@folio/erm-comparisons',
      'throwErrors': true
    }
  }
};

describe('ComparisonViewRoute', () => {
  let renderComponent;
  describe('renders the ComparisonViewRoute', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <ComparisonViewRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders ComparisonView component', () => {
      const { getByText } = renderComponent;
      expect(getByText('ComparisonView')).toBeInTheDocument();
    });

    test('renders the ExportReportAsJSONButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('ExportReportAsJSONButton')).toBeInTheDocument();
    });

    test('calls the CloseButton', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('calls the DeleteButton', async () => {
      await ButtonInteractor('DeleteButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('calls the ViewReportButton', async () => {
      await ButtonInteractor('ViewReportButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });
  });
});
