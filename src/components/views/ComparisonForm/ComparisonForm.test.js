import { MemoryRouter } from 'react-router-dom';
import { Button, Pane, PaneHeader, renderWithIntl, TextField } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/jest/helpers/translationsProperties';
import ComparisonForm from './ComparisonForm';

const onSubmitMock = jest.fn();
const onCloseMock = jest.fn();
const onEResourceAddedMock = jest.fn();
const onEResourceRemovedMock = jest.fn();

jest.mock('../../ComparisonPointFieldArray', () => () => <div>ComparisonPointFieldArray</div>);

const data = {
  'entitlements': {
    '2c082a2a-9fdc-45f9-8bb5-5e9b6e732b71': [{
      'id': 'c4776c65-fe63-44b9-b7aa-85578ad0812e',
      'dateCreated': '2022-12-06T12:55:59Z',
      'tags': [],
      'lastUpdated': '2022-12-06T12:55:59Z',
      'owner': {
        'id': '09ca8293-c6ad-420b-a8e2-4f952412db2d',
        'dateCreated': '2022-12-06T12:55:42Z',
        'name': 'EF Test Agreement',
        'orgs': '[]',
        'externalLicenseDocs': '[]',
        'outwardRelationships': '[]',
        'customProperties': '{}',
        'contacts': '[]',
        'tags': '[]',
        'lastUpdated': '2022-12-06T12:55:59Z',
        'inwardRelationships': '[]',
        'startDate': '2022-12-13',
        'linkedLicenses': '[]',
        'docs': '[]',
        'periods': '[{…}]',
        'usageDataProviders': '[]',
        'agreementStatus': '{id: "2c91809c84e51e730184e5264f630033", label: "Ac…}',
        'supplementaryDocs': '[]',
        'cancellationDeadline': null,
        'alternateNames': '[]',
        'version': 1
      },
      'resource': {
        'id': '2c082a2a-9fdc-45f9-8bb5-5e9b6e732b71',
        'class': 'org.olf.kb.Pkg',
        'name': 'ACM Digtal Library',
        'suppressFromDiscovery': false,
        'tags': '[]',
        'alternateResourceNames': '[{…}]',
        'customCoverage': false,
        '_object': '{alternateResourceNames: Array(1), availabilityCons…}'
      },
      'poLines': [],
      'suppressFromDiscovery': false,
      'customCoverage': false,
      'explanation': 'Agreement includes a package containing this item',
      'startDate': null,
      'endDate': null,
      'activeFrom': null,
      'activeTo': null,
      'contentUpdated': null,
      'haveAccess': true
    }]
  }
};

const pristine = false;
const submitting = false;

const values = {
  'name': 'MR TestComparison',
  'packages': [{
    '_delete': false,
    'onDate': '2022-12-06T00:00:00.000Z',
    'comparisonPoint': {
      'id': '2c082a2a-9fdc-45f9-8bb5-5e9b6e732b71',
      'name': 'ACM Digtal Library',
      'count': 10650,
      'provider': 'Association for Computing Machinery'
    }
  }],
  'agreements': [{
    '_delete': false,
    'onDate': '2022-12-06T00:00:00.000Z',
    'comparisonPoint': {
      'id': '09ca8293-c6ad-420b-a8e2-4f952412db2d',
      'name': 'EF Test Agreement',
      'startDate': '2022-12-13',
      'status': 'Active'
    }
  }]
};

describe('ComparisonForm', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <ComparisonForm
          data={data}
          handlers={{
            onClose: onCloseMock,
            onEResourceAdded: onEResourceAddedMock,
            onEResourceRemoved: onEResourceRemovedMock
          }}
          onSubmit={onSubmitMock}
          pristine={pristine}
          submitting={submitting}
          values={values}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expected New comparison Pane', async () => {
    await Pane('New comparison').is({ visible: true });
  });

  test('displays the New comparison pane header', async () => {
    await PaneHeader('New comparison').is({ visible: true });
  });

  it('renders the Select two items for comparison header', () => {
    const { getByText } = renderComponent;
    expect(getByText('Select two items for comparison')).toBeInTheDocument();
  });

  it('renders the ComparisonPointFieldArray component', () => {
    const { getAllByText } = renderComponent;
    expect(getAllByText('ComparisonPointFieldArray')).toHaveLength(2);
  });

  test('renders the Cancel button', async () => {
    await Button('Cancel').is({ visible: true });
  });

  test('renders the Name TextField', async () => {
    await TextField({ id: 'text-input-22' }).exists();
  });

  test('renders Close comparison button', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('button', { name: 'Close comparison' })).toBeInTheDocument();
  });

  test('renders Name textbox', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  });
});

