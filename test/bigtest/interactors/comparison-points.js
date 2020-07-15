import {
  collection,
  count,
  isPresent,
  text,
  interactor
} from '@bigtest/interactor';

@interactor class ComparisonPointInteractor {
  comparisonPointName = text('[data-test-comparison-point-name]');
}

export default @interactor class ComparisonPointsInteractor {
  comparisonPoints = collection('#comparison-point', ComparisonPointInteractor);
  comparisonPointsCount = count('#comparison-point', ComparisonPointInteractor);
  isListPresent= isPresent('[data-test-comparison-points-list]');
}
