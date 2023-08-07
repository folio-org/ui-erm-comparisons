import { MemoryRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button } from '@folio/stripes/components';
import {
  Button as ButtonInteractor,
  renderWithIntl
} from '@folio/stripes-erm-testing';

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
  match: {
    params: {
      id: '85f1c1f4-d619-4c07-a2f8-8163c3579bf9'
    },
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
      await waitFor(async () => {
        await ButtonInteractor('CloseButton').click();
      });
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('calls the DeleteButton', async () => {
      await waitFor(async () => {
        await ButtonInteractor('DeleteButton').click();
      });
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('calls the ViewReportButton', async () => {
      await waitFor(async () => {
        await ButtonInteractor('ViewReportButton').click();
      });
      expect(historyPushMock).toHaveBeenCalled();
    });
  });
});
