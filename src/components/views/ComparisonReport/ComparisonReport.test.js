
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import ComparisonReport from './ComparisonReport';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';

jest.mock('../ComparisonReportList', () => () => <div>ComparisonReportList</div>);

const data = {
  comparisonPointData: {},
  report: []
};
const onClose = jest.fn();

let renderComponent;
describe('ComparisonReport', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <ComparisonReport
          data={data}
          onClose={onClose}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders ComparisonReportList component', () => {
    const { getByText } = renderComponent;
    expect(getByText('ComparisonReportList')).toBeInTheDocument();
  });
});
