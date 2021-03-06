import {
  clickable,
  collection,
  count,
  interactor,
  isPresent,
  is,
  text
} from '@bigtest/interactor';

import EntitlementAgreementsListInteractor from './entitlement-list';

@interactor class Button {
  isDisabled = is('[disabled]');
  click = clickable();

  whenEnabled() {
    return this.when(() => !this.isDisabled);
  }
}

@interactor class AgreementInteractor {
  isLinkAgreementButtonPresent = isPresent('[data-test-link-agreement]');
  linkAgreementButton = clickable('[data-test-link-agreement]');
  isOnDateFieldPresent = isPresent('#data-test-field-date-agreement');
  isEmptyAgreementCardPresent = isPresent('[data-test-agreement-empty]');
  isAgreementCardPresent = isPresent('[data-test-agreement-card]');
  agreementName = text('[data-test-agreement-name-link]');
  agreementNameLink = clickable('[data-test-agreement-name-link]');
  agreementStartDate = text('[data-test-agreement-start-date]');
  agreementEndDate = text('[data-test-agreement-end-date]');
  agreementStatus = text('[data-test-agreement-status]');
  isAgreementReasonForClosurePresent = isPresent('[data-test-agreement-reason-for-closure]');
  agreementReasonForClosure = text('[data-test-agreement-reason-for-closure]');

  clickDeleteButton = clickable('[data-test-comparison-point-delete-button]');
}

@interactor class AgreementsListInteractor {
  size = count('#data-test-comparison-point-agreement');
  items = collection('#data-test-comparison-point-agreement', AgreementInteractor);
}

@interactor class PackageInteractor {
  isLinkPackageButtonPresent = isPresent('[data-test-link-package]');
  linkPackageButton = clickable('[data-test-link-package]');
  isOnDateFieldPresent = isPresent('#data-test-field-date-package');
  isEmptyPackageCardPresent = isPresent('[data-test-package-empty]');
  isPackageCardPresent = isPresent('[data-test-package-card]');
  isEntitlementsTablePresent = isPresent('#package-agreements-list')
  entitlements = new EntitlementAgreementsListInteractor();
  packageName = text('[data-test-package-name-link]');
  packageNameLink = clickable('[data-test-package-name-link]');
  packageCount = text('[data-test-package-count]');
  packageProvider = text('[data-test-package-provider]');

  clickDeleteButton = clickable('[data-test-comparison-point-delete-button]');
}

@interactor class PackagesListInteractor {
  size = count('#data-test-comparison-point-package');
  items = collection('#data-test-comparison-point-package', PackageInteractor);
}

export default @interactor class ComparisonsCreate {
  isComparisonNameFieldPresent = isPresent('[data-test-field-comparison-name]');

  isAddAgreementButtonPresent = isPresent('#data-test-add-agreement-button');
  addAgreementButton = new Button('#data-test-add-agreement-button');
  agreementsList = new AgreementsListInteractor();

  isAddPackageButtonPresent = isPresent('#data-test-add-package-button');
  addPackageButton = new Button('#data-test-add-package-button');
  packagesList = new PackagesListInteractor();

  saveButton = new Button('[data-test-save-button]');
  closeButton = clickable('#close-comparison-form-button');
  confirmCloseButton = clickable('[data-test-confirmation-modal-cancel-button]');
  isComparisonPane = isPresent('[data-test-ermcomparisons]');
  errorText = text('[data-test-error-msg]');
}
