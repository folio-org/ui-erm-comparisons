import {
  collection,
  interactor,
  isPresent,
  text
} from '@bigtest/interactor';

@interactor class reportMCLRowsInteractor {
  title = text('[data-test-title');
  overlap = text('[data-test-overlap]');
}

@interactor class availabilityMCLRowsInteractor {
  platform = text('[data-test-platform]');
}

@interactor class coverageMCLRowsInteractor {
  coverage = text('[data-test-coverage]');
}

export default @interactor class ComparisonReportInteractor {
  reportMCLRows = collection('[data-test-report-mcl-row]', reportMCLRowsInteractor)
  availabilityMCLRows = collection('[data-test-availability-mcl-row]', availabilityMCLRowsInteractor)
  coverageMCLRows = collection('[data-test-coverage-mcl-row]', coverageMCLRowsInteractor)

  isReportMCLPresent = isPresent('#comparison-report-mcl');
  isCoverageMCLPresent = isPresent('#coverage-mcl');
  isAvailabilityMCLPresent = isPresent('#availability-mcl');

  title = text('[data-test-title');
}
