import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import ComparisonsCreateInteractor from '../interactors/comparisons-create';

describe('Comparison create', () => {
  setupApplication();
  const interactor = new ComparisonsCreateInteractor();

  const comparisonLimit = 2;

  function additionalAgreements() {
    describe('Adding additional agreements', () => {
      beforeEach(async function () {
        // Add new agreements, up to the comparison limit
        const results = [];
        for (let i = 1; i < comparisonLimit; i++) {
          results.push(interactor.addAgreementButton.click());
        }
        await Promise.all(results);
      });

      it(`should have ${comparisonLimit} comparison points in total`, () => {
        expect(interactor.packagesList.size + interactor.agreementsList.size).to.equal(comparisonLimit);
      });

      it('should have disabled the add package button', () => {
        expect(interactor.addPackageButton.isDisabled).to.be.true;
      });

      it('should have disabled the add agreement button', () => {
        expect(interactor.addAgreementButton.isDisabled).to.be.true;
      });
    });
  }

  function additionalPackages() {
    describe('Adding additional packages', () => {
      beforeEach(async function () {
        // Add new packages, up to the comparison limit
        const results = [];
        for (let i = 1; i < comparisonLimit; i++) {
          results.push(interactor.addPackageButton.click());
        }
        await Promise.all(results);
      });

      it(`should have ${comparisonLimit} comparison points in total`, () => {
        expect(interactor.packagesList.size + interactor.agreementsList.size).to.equal(comparisonLimit);
      });

      it('should have disabled the add package button', () => {
        expect(interactor.addPackageButton.isDisabled).to.be.true;
      });

      it('should have disabled the add agreement button', () => {
        expect(interactor.addAgreementButton.isDisabled).to.be.true;
      });
    });
  }

  beforeEach(async function () {
    await this.visit('/comparisons-erm/create');
  });

  describe('Everything renders', () => {
    it('renders the comparison name field', () => {
      expect(interactor.isComparisonNameFieldPresent).to.be.false;
    });

    it('renders the package add button', () => {
      expect(interactor.isAddPackageButtonPresent).to.be.false;
    });

    it('renders the agreement add button', () => {
      expect(interactor.isAddAgreementButtonPresent).to.be.false;
    });
  });


  describe('Adding packages', () => {
    beforeEach(async function () {
      await interactor.addPackageButton.click();
    });

    it('adds a package card', () => {
      expect(interactor.packagesList.size).to.equal(1);
    });

    additionalAgreements();
    additionalPackages();
  });

  describe('Adding agreements', () => {
    beforeEach(async function () {
      await interactor.addAgreementButton.click();
    });

    it('adds an agreement card', () => {
      expect(interactor.agreementsList.size).to.equal(1);
    });

    additionalAgreements();
    additionalPackages();
  });
});
