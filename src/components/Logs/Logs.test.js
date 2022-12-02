import React from 'react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { errorLog, infoLog } from './testResources';
import Logs from './Logs';

describe('Logs', () => {
  describe('Logs', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <Logs
            comparison={errorLog}
            id="errorLogs"
            type="error"
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the expcected accordion', async () => {
      await Accordion('Error log').exists();
    });
  });

  describe('Logs', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <Logs
            comparison={infoLog}
            id="infoLogs"
            type="info"
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the expcected accordion', async () => {
      await Accordion('Info log').exists();
    });
  });
});
