/* eslint-disable no-irregular-whitespace */
import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { StaticRouter as Router } from 'react-router-dom';
import { mountWithContext } from '@folio/stripes-erm-components/tests/helpers';

import { ComparisonInfo } from '../../../src/components/ComparisonSections';
import ComparisonsInfoInteractor from '../interactors/comparisons-info';

const comparison = {
  class: 'org.olf.general.jobs.ComparisonJob',
  comparisonPoints: [
    {
      date: '2017-05-13',
      id: 'comparison-point-1',
      titleList: {
        id: 'titleList1'
      }
    },
    {
      date: '2004-11-08',
      id: 'comparison-point-2',
      titleList: {
        id: 'titleList2'
      }
    }
  ],
  started: 1234054805005, /* corresponds to '2/8/2009 1:00 AM' */
  ended: 1459868316425, /* corresponds to '4/5/2016 2:58 PM' */
  errorLogCount: 0,
  fullLogCount: 0,
  id: 'comparison-1',
  infoLogCount: 0,
  name: 'Comparison one',
  result: {
    label: 'Success'
  },
  status: {
    label: 'Ended'
  }
};

describe('Comparison info', () => {
  const interactor = new ComparisonsInfoInteractor();

  describe('Comparison not queued', () => {
    let viewButtonClicked = false;
    beforeEach(async function () {
      await mountWithContext(
        <Router context={{}}>
          <ComparisonInfo
            comparison={comparison}
            isComparisonNotQueued
            onViewReport={() => { viewButtonClicked = true; }}
          />
        </Router>
      );
    });

    describe('Render tests', () => {
      it('renders correct comparison name', () => {
        expect(interactor.comparisonName).to.equal(comparison.name);
      });

      it('renders correct comparison status', () => {
        expect(interactor.comparisonStatus).to.equal(comparison.status.label);
      });

      it('renders correct comparison result', () => {
        expect(interactor.comparisonResult).to.equal(comparison.result.label);
      });

      it('renders correct comparison errors', () => {
        expect(interactor.comparisonErrors).to.equal('0');
      });

      it('renders correct comparison started', () => {
        expect(interactor.comparisonStarted).to.equal('2/8/2009 1:00 AM');
      });

      it('renders correct comparison ended', () => {
        expect(interactor.comparisonEnded).to.equal('4/5/2016 2:58 PM');
      });

      it('renders \'view report\' button', () => {
        expect(interactor.isViewReportButtonPresent).to.be.true;
      });

      describe('Clicking the view report button', () => {
        beforeEach(async function () {
          await interactor.viewReportButton();
        });

        it('calls onViewReport', () => {
          expect(viewButtonClicked).to.be.true;
        });
      });
    });
  });

  describe('Comparison queued', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Router context={{}}>
          <ComparisonInfo
            comparison={comparison}
            isComparisonNotQueued={false}
            onViewReport={() => {}}
          />
        </Router>
      );
    });

    describe('Render tests', () => {
      it('renders correct comparison name', () => {
        expect(interactor.comparisonName).to.equal(comparison.name);
      });

      it('renders correct comparison status', () => {
        expect(interactor.comparisonStatus).to.equal(comparison.status.label);
      });

      it('does not render result', () => {
        expect(interactor.isComparisonResultPresent).to.be.false;
      });

      it('does not render errors', () => {
        expect(interactor.isComparisonErrorsPresent).to.be.false;
      });

      it('does not render started', () => {
        expect(interactor.isComparisonStartedPresent).to.be.false;
      });

      it('does not render ended', () => {
        expect(interactor.isComparisonEndedPresent).to.be.false;
      });

      it('renders \'view report\' button', () => {
        expect(interactor.isViewReportButtonPresent).to.be.true;
      });
    });
  });
});
