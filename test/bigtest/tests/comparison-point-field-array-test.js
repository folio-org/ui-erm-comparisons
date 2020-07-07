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

// This checks the correct id is being passed through onEResourceAdded/onEResourceRemoved
let addPackageId;
let removedPackageId;

describe.only('Comparison point field array', () => {
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
            onEResourceAdded: (id) => { addPackageId = id; },
            onEResourceRemoved: (id) => { removedPackageId = id; }
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

      it('recieves the correct package id', () => {
        expect(addPackageId).to.equal(packages[0].id);
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

      it('does not render the package entitlements table', () => {
        expect(interactor.packagesList.items(0).isEntitlementsTablePresent).to.be.false;
      });

      describe('Replacing the first package', () => {
        beforeEach(async () => {
          await interactor.packagesList.items(0).linkPackageButton();
        });

        it('recieves the correct package id', () => {
          expect(addPackageId).to.equal(packages[1].id);
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

        it('renders the package entitlements table', () => {
          expect(interactor.packagesList.items(0).isEntitlementsTablePresent).to.be.true;
        });

        describe('Clicking the add button again', () => {
          beforeEach(async () => {
            await interactor.addPackageButton.click();
          });

          it('has a field count of two', () => {
            expect(interactor.packagesList.size).to.equal(2);
          });

          it('renders the date field', () => {
            expect(interactor.packagesList.items(1).isOnDateFieldPresent).to.be.true;
          });

          describe('Linking the second package', () => {
            beforeEach(async () => {
              await interactor.packagesList.items(1).linkPackageButton();
            });

            it('recieves the correct package id', () => {
              expect(addPackageId).to.equal(packages[2].id);
            });

            it('renders the second package name', () => {
              expect(interactor.packagesList.items(1).packageName).to.have.string(packages[2].name);
            });

            it('renders the second package count', () => {
              expect(interactor.packagesList.items(1).packageCount).to.have.string(packages[2]._object.resourceCount);
            });

            it('renders the second package provider', () => {
              expect(interactor.packagesList.items(1).packageProvider).to.have.string(packages[2]._object.vendor.name);
            });

            it('renders the second package entitlements table', () => {
              expect(interactor.packagesList.items(1).isEntitlementsTablePresent).to.be.true;
            });

            describe('Deleting the first package', () => {
              beforeEach(async () => {
                await interactor.packagesList.items(0).clickDeleteButton();
              });

              it('recieves the correct package id', () => {
                expect(removedPackageId).to.equal(packages[1].id);
              });

              it('has a field count of one', () => {
                expect(interactor.packagesList.size).to.equal(1);
              });

              it('renders the second package name', () => {
                expect(interactor.packagesList.items(0).packageName).to.have.string(packages[2].name);
              });

              it('renders the second package count', () => {
                expect(interactor.packagesList.items(0).packageCount).to.have.string(packages[2]._object.resourceCount);
              });

              it('renders the second package provider', () => {
                expect(interactor.packagesList.items(0).packageProvider).to.have.string(packages[2]._object.vendor.name);
              });

              it('renders the second package entitlements table', () => {
                expect(interactor.packagesList.items(0).isEntitlementsTablePresent).to.be.true;
              });
            });
          });
        });
      });
    });
  });

  describe('Adding agreements', () => {
    beforeEach(async function () {
      await interactor.addAgreementButton.click();
    });

    it('adds an agreement card', () => {
      expect(interactor.agreementsList.size).to.equal(1);
    });

    it('renders the link agreement button', () => {
      expect(interactor.agreementsList.items(0).isLinkAgreementButtonPresent).to.be.true;
    });

    it('renders the date field', () => {
      expect(interactor.agreementsList.items(0).isOnDateFieldPresent).to.be.true;
    });

    describe('Linking an agreement', () => {
      beforeEach(async () => {
        await interactor.agreementsList.items(0).linkAgreementButton();
      });

      it('renders the agreement name', () => {
        expect(interactor.agreementsList.items(0).agreementName).to.have.string(agreements[0].name);
      });

      it('renders the agreement start date', () => {
        expect(interactor.agreementsList.items(0).agreementStartDate).to.have.string('10/10/1996');
      });

      it('renders the agreement end date', () => {
        expect(interactor.agreementsList.items(0).agreementEndDate).to.have.string('2/6/1999');
      });

      it('renders the agreement status', () => {
        expect(interactor.agreementsList.items(0).agreementStatus).to.have.string(agreements[0].agreementStatus.label);
      });

      it('renders the agreement reasonForClosure', () => {
        expect(interactor.agreementsList.items(0).agreementReasonForClosure).to.have.string(agreements[0].reasonForClosure.label);
      });

      describe('Replacing the first agreement', () => {
        beforeEach(async () => {
          await interactor.agreementsList.items(0).linkAgreementButton();
        });

        it('renders the new agreement name', () => {
          expect(interactor.agreementsList.items(0).agreementName).to.have.string(agreements[1].name);
        });

        it('renders the new agreement start date', () => {
          expect(interactor.agreementsList.items(0).agreementStartDate).to.have.string('3/19/1970');
        });

        it('renders the empty new agreement end date', () => {
          expect(interactor.agreementsList.items(0).agreementEndDate).to.have.string('-');
        });

        it('renders the new agreement status', () => {
          expect(interactor.agreementsList.items(0).agreementStatus).to.have.string(agreements[1].agreementStatus.label);
        });

        it('does not render the agreement reasonForClosure', () => {
          expect(interactor.agreementsList.items(0).isAgreementReasonForClosurePresent).to.be.false;
        });

        describe('Clicking the add button again', () => {
          beforeEach(async () => {
            await interactor.addAgreementButton.click();
          });

          it('has a field count of two', () => {
            expect(interactor.agreementsList.size).to.equal(2);
          });

          it('renders the date field', () => {
            expect(interactor.agreementsList.items(1).isOnDateFieldPresent).to.be.true;
          });

          describe('Linking the second agreement', () => {
            beforeEach(async () => {
              await interactor.agreementsList.items(1).linkAgreementButton();
            });

            it('renders the second agreement name', () => {
              expect(interactor.agreementsList.items(1).agreementName).to.have.string(agreements[2].name);
            });

            it('renders the second agreement start date', () => {
              expect(interactor.agreementsList.items(1).agreementStartDate).to.have.string('7/24/1968');
            });

            it('renders the empty second agreement end date', () => {
              expect(interactor.agreementsList.items(1).agreementEndDate).to.have.string('-');
            });

            it('renders the second agreement status', () => {
              expect(interactor.agreementsList.items(1).agreementStatus).to.have.string(agreements[2].agreementStatus.label);
            });

            it('does not render the agreement reasonForClosure', () => {
              expect(interactor.agreementsList.items(1).isAgreementReasonForClosurePresent).to.be.false;
            });

            describe('Deleting the first agreement', () => {
              beforeEach(async () => {
                await interactor.agreementsList.items(0).clickDeleteButton();
              });

              it('has a field count of one', () => {
                expect(interactor.agreementsList.size).to.equal(1);
              });

              it('renders the second agreement name', () => {
                expect(interactor.agreementsList.items(0).agreementName).to.have.string(agreements[2].name);
              });

              it('renders the second agreement start date', () => {
                expect(interactor.agreementsList.items(0).agreementStartDate).to.have.string('7/24/1968');
              });

              it('renders the empty second agreement end date', () => {
                expect(interactor.agreementsList.items(0).agreementEndDate).to.have.string('-');
              });

              it('renders the second agreement status', () => {
                expect(interactor.agreementsList.items(0).agreementStatus).to.have.string(agreements[2].agreementStatus.label);
              });

              it('does not render the agreement reasonForClosure', () => {
                expect(interactor.agreementsList.items(0).isAgreementReasonForClosurePresent).to.be.false;
              });
            });
          });
        });
      });
    });
  });
});
