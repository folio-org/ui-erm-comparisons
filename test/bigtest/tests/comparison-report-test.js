import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../helpers/mountWithContext';
import ComparisonReportInteractor from '../interactors/comparison-report';

import ComparisonReportList from '../../../src/components/views/ComparisonReportList';
import {
  samePackageDifferentDates,
  differentPackagesSamePTI,
  differentPackagesSameTI,
  differentPackagesNoOverlap,
  packageAgreementOnePCI,
  packageAgreementSamePCINoCoverage,
  packageAgreementWithPCICustomCoverage,
  sameAgreementDifferentDates
} from './resources';

describe('Comparison report for', () => {
  const interactor = new ComparisonReportInteractor();

  function runTests(sourceData) {
    let availabilityIndex = 0;

    const { report } = sourceData;

    it('renders the comparison report MCL', () => {
      expect(interactor.isReportMCLPresent).to.be.true;
    });

    report.forEach((record, index) => {
      it(`renders expected title on title instance ${index + 1}`, () => {
        expect(interactor.reportMCLRows(index).title).to.have.string(record.longName);
      });

      const { availability } = record;

      Object.values(availability).forEach((item, i) => {
        it(`renders expected platform ${i + 1} on title instance ${index + 1}`, () => {
          expect(interactor.availabilityMCLRows(availabilityIndex++).platform).to.have.string(item.platform);
        });
      });

      it('renders expected overlap', () => {
        expect(interactor.reportMCLRows(index).overlap).to.have.string(record.overlap);
      });
    });
  }

  describe('same package with different dates', () => {
    beforeEach(async function () {
      await mountWithContext(
        <ComparisonReportList
          sourceData={samePackageDifferentDates}
        />
      );
    });

    runTests(samePackageDifferentDates);
  });

  describe('different packages and same PTI', () => {
    beforeEach(async function () {
      await mountWithContext(
        <ComparisonReportList
          sourceData={differentPackagesSamePTI}
        />
      );
    });

    runTests(differentPackagesSamePTI);
  });

  describe('different packages and same TI', () => {
    beforeEach(async function () {
      await mountWithContext(
        <ComparisonReportList
          sourceData={differentPackagesSameTI}
        />
      );
    });

    // runTests(differentPackagesSameTI);
  });

  describe('different packages with no overlap', () => {
    beforeEach(async function () {
      await mountWithContext(
        <ComparisonReportList
          sourceData={differentPackagesNoOverlap}
        />
      );
    });

    runTests(differentPackagesNoOverlap);
  });

  describe('package agreement with one PCI', () => {
    beforeEach(async function () {
      await mountWithContext(
        <ComparisonReportList
          sourceData={packageAgreementOnePCI}
        />
      );
    });

    runTests(packageAgreementOnePCI);
  });

  describe('package agreement same PCI no custom coverage', () => {
    beforeEach(async function () {
      await mountWithContext(
        <ComparisonReportList
          sourceData={packageAgreementSamePCINoCoverage}
        />
      );
    });

    runTests(packageAgreementSamePCINoCoverage);
  });

  describe('package agreement with PCI and custom coverage', () => {
    beforeEach(async function () {
      await mountWithContext(
        <ComparisonReportList
          sourceData={packageAgreementWithPCICustomCoverage}
        />
      );
    });

    runTests(packageAgreementWithPCICustomCoverage);
  });

  describe('same agreement different dates', () => {
    beforeEach(async function () {
      await mountWithContext(
        <ComparisonReportList
          sourceData={sameAgreementDifferentDates}
        />
      );
    });

    runTests(sameAgreementDifferentDates);
  });
});
