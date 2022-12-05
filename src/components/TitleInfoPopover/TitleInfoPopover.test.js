import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import TitleInfoPopover from './TitleInfoPopover';

const titleInstance = {
  'overlap': 'none',
  'availability': {
    '80749403-9314-4598-b4c8-c7313d6e1ea0': {
      'coverage': {
        'a13a0c5b-5d94-4b14-b26e-c7f6514f00ed': {
          'statements': '[]',
          'occurrences': {
            '40078706-63b5-4c22-9667-b5190abc818e': true
          }
        }
      },
      'platform': 'ACM Digital Library',
      'url': 'https://dl.acm.org/doi/book/10.1145/3423423',
      'name': "'10th International Conference on the Internet of Things Companion' on Platform 'ACM Digital Library'",
      'longName': "'10th International Conference on the Internet of Things Companion' on Platform 'ACM Digital Library'"
    }
  },
  'name': '10th International Conference on the Internet of Things Companiona13a0c5b-5d94-4b14-b26e-c7f6514f00ed',
  'id': 'a13a0c5b-5d94-4b14-b26e-c7f6514f00ed',
  'longName': '10th International Conference on the Internet of Things Companion.2020-10-07',
  'type': {
    'id': '2c91809c84dd61280184dd68d792003c',
    'value': 'monograph',
    'label': 'Monograph'
  },
  'subType': {
    'id': '2c91809c84dd61280184dd68d78d003a',
    'value': 'electronic',
    'label': 'Electronic'
  },
  'identifiers': [{
    'dateCreated': '2022-12-04T14:51:22Z',
    'lastUpdated': '2022-12-04T14:51:22Z',
    'status': {
      'id': '2c91809c84dd61280184dd69a5d60064',
      'value': 'approved',
      'label': 'approved'
    },
    'resource': {
      'id': 'a13a0c5b-5d94-4b14-b26e-c7f6514f00ed'
    },
    'identifier': {
      'value': '978-1-4503-8820-7',
      'ns': {
        'value': 'isbn'
      }
    }
  }],
  'rowIndex': 0
};

describe('TitleInfoPopover', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <TitleInfoPopover
          titleInstance={titleInstance}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders Type value', () => {
    const { getByText } = renderComponent;
    expect(getByText(': Monograph')).toBeInTheDocument();
  });

  it('renders Resource type value', () => {
    const { getByText } = renderComponent;
    expect(getByText(': Electronic')).toBeInTheDocument();
  });

  it('renders ISBN value', () => {
    const { getByText } = renderComponent;
    expect(getByText(': 978-1-4503-8820-7')).toBeInTheDocument();
  });
});
