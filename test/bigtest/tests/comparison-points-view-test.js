/* eslint-disable no-irregular-whitespace */
import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { StaticRouter as Router } from 'react-router-dom';
import { mountWithContext } from '../helpers/mountWithContext';

import { ComparisonPoints } from '../../../src/components/ComparisonSections';
import ComparisonPointsInteractor from '../interactors/comparison-points';

const comparison = {
  class: 'org.olf.general.jobs.ComparisonJob',
  comparisonPoints: [
    {
      date: '2017-05-13',
      id: 'comparison-point-1',
      titleList: {
        class: 'org.olf.erm.SubscriptionAgreement',
        id: 'titleList1',
        name: 'Some agreement'
      }
    },
    {
      date: '2004-11-08',
      id: 'comparison-point-2',
      titleList: {
        class: 'org.olf.kb.Pkg',
        id: 'titleList2',
        name: 'Some package'
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

describe('Comparison points view', () => {
  const interactor = new ComparisonPointsInteractor();

  beforeEach(async function () {
    await mountWithContext(
      <Router context={{}}>
        <ComparisonPoints
          comparison={comparison}
          id="12345"
        />
      </Router>
    );
  });

  it('should render the list', () => {
    expect(interactor.isListPresent).to.be.true;
  });

  it(`should contain ${comparison.comparisonPoints.length} entries`, () => {
    expect(interactor.comparisonPointsCount).to.equal(comparison.comparisonPoints.length);
  });

  describe('Rendering each comparison point', () => {
    comparison.comparisonPoints.forEach((cp, index) => {
      it(`should render comparison point ${index + 1}'s name correctly`, () => {
        expect(interactor.comparisonPoints(index).comparisonPointName).to.equal(cp.titleList.name);
      });
    });
  });
});
