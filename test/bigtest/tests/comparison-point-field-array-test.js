import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { FieldArray } from 'react-final-form-arrays';

import { dummyMount, getPluginModule } from '../helpers';
import TestForm from '../TestForm';

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

const entitlements = [];

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
        expect(interactor.packagesList.items(0).isPackageNamePresent).to.be.true;
      });

      describe('Clicking the package name', () => {
        beforeEach(async () => {
          await interactor.packagesList.items(0).packageNameLink();
        });

        it('redirects to the package', () => {
          console.log("test goes here")
        })
      });
    });

    describe('Adding a second package', () => {
      beforeEach(async function () {
        await interactor.addPackageButton.click();
      });

      it('disables the add buttons', () => {
        console.log("Test goes here")
      });
    });
  });

});
