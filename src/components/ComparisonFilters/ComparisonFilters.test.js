import React from 'react';
import { waitFor } from '@testing-library/dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion, Checkbox } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ComparisonFilters from './ComparisonFilters';

jest.mock('./ComparisonPointFilter', () => () => <div>ComparisonPointFilter</div>);
const activeFilters = {
  'comparisonPointOne': [
    '8a029ec3-f55d-46ea-9d04-5cdf2fd4a3ed'
  ]
};

const data = {
  'comparisons': [{
    'id': 'e5c0ef54-fc95-4333-b539-96c7b0bd8630',
    'dateCreated': 1667815696497,
    'name': 'test 1',
    'runnerId': '8d8ee494-a603-42b3-8e47-617bce1acd15',
    'comparisonPoints': [{
      'id': '06f886e1-d924-41d4-906c-59ce69f2a7a3',
      'date': '2022-11-02',
      'job': {
        'id': 'e5c0ef54-fc95-4333-b539-96c7b0bd8630'
      },
      'titleList': {
        'id': '8a029ec3-f55d-46ea-9d04-5cdf2fd4a3ed',
        'name': 'MR Agreement',
        'class': 'org.olf.erm.SubscriptionAgreement'
      }
    },
    {
      'id': 'eccdaf8f-2d4f-4906-90c9-2a61fd8cf4aa',
      'date': '2022-11-07',
      'job': {
        'id': 'e5c0ef54-fc95-4333-b539-96c7b0bd8630'
      },
      'titleList': {
        'id': 'fb1be09a-e304-465d-8c40-33a2449bcdb4',
        'name': 'ACM Digtal Library',
        'class': 'org.olf.kb.Pkg'
      }
    }
    ],
    'started': 1667815718438,
    'status': {
      'id': '2c91809c844d2d8c01844d3592c20047',
      'value': 'in_progress',
      'label': 'In progress'
    },
    'class': 'org.olf.general.jobs.ComparisonJob',
    'fullLogCount': 0,
    'errorLogCount': 0,
    'infoLogCount': 0
  }],
  'resultValues': [{
    'id': '2c91809c844d2d8c01844d3592ae0041',
    'value': 'success',
    'label': 'Success'
  },
  {
    'id': '2c91809c844d2d8c01844d3592b20042',
    'value': 'partial_success',
    'label': 'Partial success'
  },
  {
    'id': '2c91809c844d2d8c01844d3592b60043',
    'value': 'failure',
    'label': 'Failure'
  },
  {
    'id': '2c91809c844d2d8c01844d3592ba0044',
    'value': 'interrupted',
    'label': 'Interrupted'
  }
  ],
  'statusValues': [{
    'id': '2c91809c843dbb2701843dc312f50034',
    'value': 'queued',
    'label': 'Queued'
  },
  {
    'id': '2c91809c843dbb2701843dc312f80035',
    'value': 'in_progress',
    'label': 'In progress'
  },
  {
    'id': '2c91809c843dbb2701843dc312fc0036',
    'value': 'ended',
    'label': 'Ended'
  }
  ]
};

const stateMock = jest.fn();
const filterHandlers = {
  state: stateMock,
  'checkbox': () => {},
  'clear': () => {},
  'clearGroup': () => {},
  'reset': () => {}
};

describe('ComparisonFilters', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <ComparisonFilters
          activeFilters={activeFilters}
          data={data}
          filterHandlers={filterHandlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Running status Accordion', async () => {
    await Accordion('Running status').exists();
  });

  test('renders the Result Accordion', async () => {
    await Accordion('Result').exists();
  });

  test('renders the Comparison point 1 Accordion', async () => {
    await Accordion('Comparison point 1').exists();
  });

  test('renders the Comparison point 2 Accordion', async () => {
    await Accordion('Comparison point 2').exists();
  });

  it('renders ComparisonPointFilter component', () => {
    const { getAllByText } = renderComponent;
    expect(getAllByText('ComparisonPointFilter')).toBeDefined();
  });

  test('renders the expected button name', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('button', { name: 'Comparison point 1 filter list' }));
  });

  test('renders the expected button name', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('button', { name: 'Comparison point 2 filter list' }));
  });

  let index = 1;
  const testComparisonsFilterCheckbox = (field, value) => (
    test(`clicking the ${value} checkbox`, async () => {
      await waitFor(async () => {
        await Checkbox({ id: `clickable-filter-${field}-${value}` }).click();
      });

      await waitFor(() => {
        expect(stateMock.mock.calls.length).toEqual(index);
      });

      index++;
    })
  );

  // Running status checkboxes
  testComparisonsFilterCheckbox('status', 'queued');
  testComparisonsFilterCheckbox('status', 'in-progress');
  testComparisonsFilterCheckbox('status', 'ended');

  // Result checkboxes
  testComparisonsFilterCheckbox('result', 'success');
  testComparisonsFilterCheckbox('result', 'partial-success');
  testComparisonsFilterCheckbox('result', 'failure');
  testComparisonsFilterCheckbox('result', 'interrupted');
});
