import {
  clickable,
  interactor,
  isPresent,
  property,
  text
} from '@bigtest/interactor';


export default @interactor class ComparisonsInfoInteractor {
  comparisonName = text('[data-test-comparison-name]');
  comparisonStatus = text('[data-test-comparison-status]');

  isComparisonResultPresent = isPresent('[data-test-comparison-result]');
  comparisonResult = text('[data-test-comparison-result]');

  isComparisonErrorsPresent = isPresent('[data-test-comparison-errors]');
  comparisonErrors = text('[data-test-comparison-errors]');

  isComparisonStartedPresent = isPresent('[data-test-comparison-started]');
  comparisonStarted = text('[data-test-comparison-started]');

  isComparisonEndedPresent = isPresent('[data-test-comparison-ended]');
  comparisonEnded = text('[data-test-comparison-ended]');

  isViewReportButtonPresent = isPresent('[data-test-comparison-report-view]');
  viewReportButton = clickable('[data-test-comparison-report-view]');
  isviewReportButtonDisabled = property('[data-test-comparison-report-view]', 'disabled');
}
