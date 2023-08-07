import { MemoryRouter } from 'react-router-dom';

import {
  Accordion,
  Button,
  KeyValue,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ComparisonView from './ComparisonView';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

const data = {
  comparison: {
    'id': '44d02dfd-4383-43cf-92ab-4fc452b0cd93',
    'dateCreated': 1669029911015,
    'ended': 1669029924579,
    'result': {
      'id': '2c91809c8497de11018497e5d39a003f',
      'value': 'success',
      'label': 'Success'
    },
    'name': 'Comparison Title',
    'runnerId': 'ea7c7dbd-fce2-428c-9162-1e901b3b992b',
    'comparisonPoints': [{
      'id': '7af6f92a-a7e7-4e6c-873d-0ad823a9854b',
      'date': '2022-11-21',
      'job': {
        'id': '44d02dfd-4383-43cf-92ab-4fc452b0cd93'
      },
      'titleList': {
        'id': '616704cb-7833-473e-af74-387571f4f8b9',
        'name': 'AVA VOD Library',
        'class': 'org.olf.kb.Pkg'
      }
    },
    {
      'id': '60e8d797-102c-47b2-9214-a32b5a9d6572',
      'date': '2022-11-21',
      'job': {
        'id': '44d02dfd-4383-43cf-92ab-4fc452b0cd93'
      },
      'titleList': {
        'id': '30b2ea26-6e15-461c-a29c-8408c93484e2',
        'name': 'ACS in Focus Test',
        'class': 'org.olf.kb.Pkg'
      }
    }
    ],
    'started': 1669029924416,
    'status': {
      'id': '2c91809c8497de11018497e5d3c50046',
      'value': 'ended',
      'label': 'Ended'
    },
    'class': 'org.olf.general.jobs.ComparisonJob',
    'fullLogCount': 0,
    'errorLogCount': 0,
    'infoLogCount': 0
  }
};

const data2 = {
  comparison: {
    'id': '3d466140-0d86-4b12-a73b-ffd914e6a0dd',
    'dateCreated': 1669302524479,
    'name': 'test1',
    'comparisonPoints': [{
      'id': '669bcf70-8058-4a0a-84c9-c1d94b77a87e',
      'date': '2022-11-24',
      'job': {
        'id': '3d466140-0d86-4b12-a73b-ffd914e6a0dd'
      },
      'titleList': {
        'id': 'ac4c2dcd-4ca1-4fbb-ad30-60bf2c851672',
        'name': 'American Psychiatry Association : Psychiatry Legacy Collection : NL',
        'class': 'org.olf.kb.Pkg'
      }
    },
    {
      'id': '511b9120-a06f-46d3-abbb-77c775fad2b6',
      'date': '2022-11-24',
      'job': {
        'id': '3d466140-0d86-4b12-a73b-ffd914e6a0dd'
      },
      'titleList': {
        'id': '068847b1-8d37-4b9e-b9b0-31204cfd5102',
        'name': 'American Vacuum Society : Journals',
        'class': 'org.olf.kb.Pkg'
      }
    }
    ],
    'status': {
      'id': '2c91809c84a9e1ca0184a9e974a50011',
      'value': 'queued',
      'label': 'Queued'
    },
    'class': 'org.olf.general.jobs.ComparisonJob',
    'fullLogCount': 0,
    'errorLogCount': 0,
    'infoLogCount': 0
  }
};

const onViewReport = jest.fn();
const onClose = jest.fn();

describe('ComparisonView', () => {
  let renderComponent;
  describe('render expected components (completed comparison)', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <ComparisonView
            data={data}
            onClose={onClose}
            onViewReport={onViewReport}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the Heading', () => {
      const { queryAllByText } = renderComponent;
      expect(queryAllByText('Comparison Title')).toHaveLength(2);
    });

    test('renders the Comparison points Accordion', async () => {
      await Accordion('Comparison points').exists();
    });

    test('renders the Error log Accordion', async () => {
      await Accordion('Error log').exists();
    });

    test('renders the Info log Accordion', async () => {
      await Accordion('Info log').exists();
    });

    test('renders the Comparison points list', async () => {
      const { getByText } = renderComponent;
      expect(getByText('AVA VOD Library')).toBeInTheDocument();
      expect(getByText('ACS in Focus Test')).toBeInTheDocument();
    });

    test('renders the expected running status', async () => {
      await KeyValue('Running status').has({ value: 'Ended' });
    });

    test('renders the expected Outcome', async () => {
      await KeyValue('Outcome').has({ value: 'Success' });
    });

    test('renders the Actions button', async () => {
      await Button('Actions').exists();
    });

    test('renders the delete and export button under the Actions dropdown', async () => {
      await waitFor(async () => {
        await Button('Actions').click();
      });
      await Button('Delete').exists();
      await Button('Export comparison report as JSON').exists();
    });
  });

  describe('render expected components (queued comparison)', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <ComparisonView
            data={data2}
            onClose={onClose}
            onViewReport={onViewReport}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the expected running status', async () => {
      await KeyValue('Running status').has({ value: 'Queued' });
    });

    test('renders the Comparison points list', async () => {
      const { getByText } = renderComponent;
      expect(getByText('American Psychiatry Association : Psychiatry Legacy Collection : NL')).toBeInTheDocument();
      expect(getByText('American Vacuum Society : Journals')).toBeInTheDocument();
    });

    test('renders the Reload Page tooltip ', async () => {
      const { getByRole } = renderComponent;
      expect(getByRole('tooltip', { name: /Reload page to refresh button once job has ended/i })).toBeInTheDocument();
    });

    test('renders the Comparison points Accordion', async () => {
      await Accordion('Comparison points').exists();
    });

    test('does not render the Error log Accordion', async () => {
      await Accordion('Error log').absent();
    });

    test('does not render the Info log Accordion', async () => {
      await Accordion('Info log').absent();
    });
  });
});
