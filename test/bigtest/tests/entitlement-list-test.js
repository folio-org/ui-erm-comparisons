import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { StaticRouter as Router } from 'react-router-dom';
import { mountWithContext } from '@folio/stripes-erm-components/tests/helpers';

import EntitlementAgreementsListInteractor from '../interactors/entitlement-list';

import EntitlementAgreementsList from '../../../src/components/EntitlementsAgreementsList';

const noEntitlements = [];

const oneEntitlement = [
  {
    owner: {
      agreementStatus: {
        label: 'In negotiation'
      },
      name: 'Agreement A',
      startDate: '2020-07-12',
    }
  }
];

const twoEntitlements = [
  {
    owner: {
      agreementStatus: {
        label: 'Active'
      },
      name: 'Agreement B',
      startDate: '2001-12-06'
    }
  },
  {
    owner: {
      agreementStatus: {
        label: 'Closed'
      },
      name: 'Agreement C',
      startDate: '2007-10-05',
      endDate: '2018-03-29'
    }
  },
];

describe('Entitlements agreements list', () => {
  const interactor = new EntitlementAgreementsListInteractor();

  describe('No entitlements', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Router context={{}}>
          <EntitlementAgreementsList
            entitlements={noEntitlements}
            id="pci-agreements-list"
          />
        </Router>
      );
    });

    it('does not render the table', () => {
      expect(interactor.isTablePresent).to.be.false;
    });
  });

  describe('One entitlement', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Router context={{}}>
          <EntitlementAgreementsList
            entitlements={oneEntitlement}
            id="pci-agreements-list"
          />
        </Router>
      );
    });

    describe('Rendering tests', () => {
      it('renders a single row', () => {
        expect(interactor.table.rowCount).to.equal(1);
      });

      it('renders the correct agreement name', () => {
        expect(interactor.table.rows(0).cells(0).content).to.have.string(oneEntitlement[0].owner.name);
      });

      it('renders the correct agreement status', () => {
        expect(interactor.table.rows(0).cells(1).content).to.have.string(oneEntitlement[0].owner.agreementStatus.label);
      });

      // We have to check for formatted dates in US locale
      it('renders the correct agreement start date', () => {
        expect(interactor.table.rows(0).cells(2).content).to.have.string('7/12/2020');
      });

      it('does not render an agreement end date', () => {
        expect(interactor.table.rows(0).cells(3).content).to.equal('');
      });
    });
  });

  describe('Two entitlements', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Router context={{}}>
          <EntitlementAgreementsList
            entitlements={twoEntitlements}
            id="pci-agreements-list"
          />
        </Router>
      );
    });

    describe('Rendering tests', () => {
      it('renders two rows', () => {
        expect(interactor.table.rowCount).to.equal(2);
      });

      it('renders the correct first agreement name', () => {
        expect(interactor.table.rows(0).cells(0).content).to.have.string(twoEntitlements[0].owner.name);
      });

      it('renders the correct first agreement status', () => {
        expect(interactor.table.rows(0).cells(1).content).to.have.string(twoEntitlements[0].owner.agreementStatus.label);
      });

      it('renders the correct first agreement start date', () => {
        expect(interactor.table.rows(0).cells(2).content).to.have.string('12/6/2001');
      });

      it('does not render an agreement end date', () => {
        expect(interactor.table.rows(0).cells(3).content).to.equal('');
      });

      it('renders the correct second agreement name', () => {
        expect(interactor.table.rows(1).cells(0).content).to.have.string(twoEntitlements[1].owner.name);
      });

      it('renders the correct second agreement status', () => {
        expect(interactor.table.rows(1).cells(1).content).to.have.string(twoEntitlements[1].owner.agreementStatus.label);
      });

      it('renders the correct second agreement start date', () => {
        expect(interactor.table.rows(1).cells(2).content).to.have.string('10/5/2007');
      });

      it('renders the correct second agreement end date', () => {
        expect(interactor.table.rows(1).cells(3).content).to.have.string('3/29/2018');
      });
    });
  });
});
