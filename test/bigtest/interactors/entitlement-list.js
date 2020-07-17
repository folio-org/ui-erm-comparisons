import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

export default @interactor class EntitlementAgreementsListInteractor {
  static defaultScope = '[data-test-entitlements-table]';

  table = new MultiColumnListInteractor('#package-agreements-list');
  isTablePresent = isPresent('#package-agreements-list');
}
