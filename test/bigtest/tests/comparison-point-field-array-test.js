import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { FieldArray } from 'react-final-form-arrays';

import { dummyMount, getPluginModule } from '@folio/stripes-erm-components/tests/helpers';
import TestForm from '@folio/stripes-erm-components/tests/TestForm';

import setupApplication from '../helpers/setup-application';
import ComparisonsCreateInteractor from '../interactors/comparisons-create';

import ComparisonPointFieldArray from '../../../src/components/ComparisonPointFieldArray';

const packages = [{
  id: 'package-1',
  name: 'Package 1',
  _object: {
    resourceCount: '42',
    vendor: {
      name: 'Provider 1'
    }
  }
},
{
  id: 'package-2',
  name: 'Package 2',
  _object: {
    resourceCount: '101',
    vendor: {
      name: 'Provider 2'
    }
  }
},
{
  id: 'package-3',
  name: 'Package 3',
  _object: {
    resourceCount: '4320',
    vendor: {
      name: 'Provider 3'
    }
  }
}];

const entitlements = {
  'package-2': [
    {
      owner: {
        agreementStatus: {
          label: 'Active'
        },
        name: 'Agreement A',
        startDate: '2001-12-06'
      }
    },
    {
      owner: {
        agreementStatus: {
          label: 'Closed'
        },
        name: 'Agreement B',
        startDate: '2007-10-05',
        endDate: '2018-03-29'
      }
    },
  ],
  'package-3': [
    {
      owner: {
        agreementStatus: {
          label: 'In negotiation'
        },
        name: 'Agreement C',
        startDate: '2020-07-12',
      }
    }
  ]
};

const agreements = [{
  id: 'agreement-1',
  name: 'Agreement 1',
  agreementStatus: {
    label: 'Closed'
  },
  reasonForClosure: {
    label: 'Cancelled'
  },
  startDate: '1996-10-10',
  endDate: '1999-02-06'
},
{
  id: 'agreement-2',
  name: 'Agreement 2',
  agreementStatus: {
    label: 'Active'
  },
  startDate: '1970-03-19',
},
{
  id: 'agreement-3',
  name: 'Agreement 3',
  agreementStatus: {
    label: 'In negotiation'
  },
  startDate: '1968-07-24',
}];

describe('Comparison point field array', () => {
  setupApplication();
  const interactor = new ComparisonsCreateInteractor();

  // Create mock form with two field arrays, for agreements/packages
  beforeEach(async function () {
    let packageToSelect = -1;
    let agreementToSelect = -1;
    const buttonRef = React.createRef();

    const findPackageButtonComponent = props => props.renderTrigger({
      buttonRef,
      onClick: () => {
        packageToSelect += 1;
        return props.onEresourceSelected(packages[packageToSelect]); // eslint-disable-line react/prop-types
      }
    });

    const findAgreementButtonComponent = props => props.renderTrigger({
      buttonRef,
      onClick: () => {
        agreementToSelect += 1;
        return props.onAgreementSelected(agreements[agreementToSelect]); // eslint-disable-line react/prop-types
      }
    });

    const findPackageModule = getPluginModule(findPackageButtonComponent, 'find-eresource');
    const findAgreementModule = getPluginModule(findAgreementButtonComponent, 'find-agreement');

    await dummyMount(
      <TestForm
        agreementListSize={interactor.agreementsList.size}
        packageListSize={interactor.packagesList.size}
      >
        <FieldArray
          addButtonId="data-test-add-package-button"
          addLabelId="ui-erm-comparisons.newComparison.addPackage"
          comparisonPoint="package"
          component={ComparisonPointFieldArray}
          data={{ entitlements }}
          data-test-field-array-packages
          deleteButtonTooltipId="ui-erm-comparisons.newComparison.removePackage"
          disableAddNew={interactor.packagesList.size + interactor.agreementsList.size >= 2}
          handlers={{
            onEResourceAdded: (id) => console.log('Added id: %o', id),
            onEResourceRemoved: (id) => console.log('Removed id: %o', id)
          }}
          headerId="ui-erm-comparisons.newComparison.packageTitle"
          id="comparison-point-form-packages"
          isEmptyMessage="No packages"
          name="ComparisonPointFieldArrayPackageTest"
          packages={packages}
        />
        <FieldArray
          addButtonId="data-test-add-agreement-button"
          addLabelId="ui-erm-comparisons.newComparison.addAgreement"
          agreements={agreements}
          comparisonPoint="agreement"
          component={ComparisonPointFieldArray}
          data-test-field-array-agreements
          deleteButtonTooltipId="ui-erm-comparisons.newComparison.removeAgreement"
          disableAddNew={interactor.packagesList.size + interactor.agreementsList.size >= 2}
          headerId="ui-erm-comparisons.newComparison.agreementTitle"
          id="comparison-point-form-agreement"
          isEmptyMessage="No agreements"
          name="ComparisonPointFieldArrayAgreementTest"
        />
      </TestForm>,
      [findPackageModule, findAgreementModule]
    );

    this.visit('/dummy');
  });

  it('renders the package add button', () => {
    expect(interactor.isAddPackageButtonPresent).to.be.true;
  });

  it('renders the agreement add button', () => {
    expect(interactor.isAddAgreementButtonPresent).to.be.true;
  });

  describe('Adding packages', () => {
    beforeEach(async function () {
      await interactor.addPackageButton.click();
    });

    it('adds a package card', () => {
      expect(interactor.packagesList.size).to.equal(1);
    });

    it('renders the link package button', () => {
      expect(interactor.packagesList.items(0).isLinkPackageButtonPresent).to.be.true;
    });

    it('renders the date field', () => {
      expect(interactor.packagesList.items(0).isOnDateFieldPresent).to.be.true;
    });

    describe('Linking a package', () => {
      beforeEach(async () => {
        await interactor.packagesList.items(0).linkPackageButton();
      });

      it('renders the package name', () => {
        expect(interactor.packagesList.items(0).packageName).to.have.string(packages[0].name);
      });

      it('renders the package count', () => {
        expect(interactor.packagesList.items(0).packageCount).to.have.string(packages[0]._object.resourceCount);
      });

      it('renders the package provider', () => {
        expect(interactor.packagesList.items(0).packageProvider).to.have.string(packages[0]._object.vendor.name);
      });

      it('renders the package entitlements component', () => {
        expect(interactor.packagesList.items(0).isEntitlementsTablePresent).to.be.true;
      });

      describe('Replacing the first package', () => {
        beforeEach(async () => {
          await interactor.packagesList.items(0).linkPackageButton();
        });

        it('renders the new package name', () => {
          expect(interactor.packagesList.items(0).packageName).to.have.string(packages[1].name);
        });

        it('renders the new package count', () => {
          expect(interactor.packagesList.items(0).packageCount).to.have.string(packages[1]._object.resourceCount);
        });

        it('renders the new package provider', () => {
          expect(interactor.packagesList.items(0).packageProvider).to.have.string(packages[1]._object.vendor.name);
        });

        it('renders the package entitlements component', () => {
          expect(interactor.packagesList.items(0).isEntitlementsTablePresent).to.be.true;
        });
      });
    });
  });
});
