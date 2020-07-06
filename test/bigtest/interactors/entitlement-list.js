import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

export default @interactor class EntitlementAgreementsListInteractor {
  static defaultScope = '[data-test-package-entitlements]';

  table = new MultiColumnListInteractor('#pci-agreements-list');
  isTablePresent = isPresent('#pci-agreements-list');
}
