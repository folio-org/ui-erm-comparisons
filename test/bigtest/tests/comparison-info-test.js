/* eslint-disable no-irregular-whitespace */
import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { cloneDeep } from 'lodash';

import { StaticRouter as Router } from 'react-router-dom';
import { mountWithContext } from '../helpers/mountWithContext';

import { ComparisonInfo } from '../../../src/components/ComparisonSections';
import ComparisonsInfoInteractor from '../interactors/comparisons-info';

const queuedComparison = {
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
    label: 'Queued',
    value: 'queued'
  }
};

const inProgressComparison = cloneDeep(queuedComparison);
inProgressComparison.status = {
  label: 'In progress',
  value: 'in_progress'
};

const endedComparison = cloneDeep(queuedComparison);
endedComparison.status = {
  label: 'Ended',
  value: 'ended'
};

describe('Comparison info', () => {
  const interactor = new ComparisonsInfoInteractor();

  describe('Comparison queued', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Router context={{}}>
          <ComparisonInfo
            comparison={queuedComparison}
            onViewReport={() => {}}
          />
        </Router>
      );
    });

    describe('Render tests', () => {
      it('renders correct comparison name', () => {
        expect(interactor.comparisonName).to.equal(queuedComparison.name);
      });

      it('renders correct comparison status', () => {
        expect(interactor.comparisonStatus).to.equal(queuedComparison.status.label);
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

      it('\'view report\' button is disabled', () => {
        expect(interactor.isviewReportButtonDisabled).to.be.true;
      });
    });
  });

  describe('Comparison in progress', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Router context={{}}>
          <ComparisonInfo
            comparison={inProgressComparison}
            isComparisonNotQueued
            onViewReport={() => {}}
          />
        </Router>
      );
    });

    describe('Render tests', () => {
      it('renders correct comparison name', () => {
        expect(interactor.comparisonName).to.equal(inProgressComparison.name);
      });

      it('renders correct comparison status', () => {
        expect(interactor.comparisonStatus).to.equal(inProgressComparison.status.label);
      });

      it('renders correct comparison result', () => {
        expect(interactor.comparisonResult).to.equal(inProgressComparison.result.label);
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

      it('\'view report\' button is disabled', () => {
        expect(interactor.isviewReportButtonDisabled).to.be.true;
      });
    });
  });

  describe('Comparison ended', () => {
    let viewButtonClicked = false;
    beforeEach(async function () {
      await mountWithContext(
        <Router context={{}}>
          <ComparisonInfo
            comparison={endedComparison}
            isComparisonNotQueued
            onViewReport={() => { viewButtonClicked = true; }}
          />
        </Router>
      );
    });

    describe('Render tests', () => {
      it('renders correct comparison name', () => {
        expect(interactor.comparisonName).to.equal(endedComparison.name);
      });

      it('renders correct comparison status', () => {
        expect(interactor.comparisonStatus).to.equal(endedComparison.status.label);
      });

      it('renders correct comparison result', () => {
        expect(interactor.comparisonResult).to.equal(endedComparison.result.label);
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

      it('\'view report\' button is not disabled', () => {
        expect(interactor.isviewReportButtonDisabled).to.be.false;
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
});
