import { translationsProperties as coreTranslations } from '@folio/stripes-erm-testing';

// Direct import is a bit gross, but so is exposing the translations file...
// no super great way to do this so this will do for now.
import ermTranslations from '@folio/stripes-erm-components/translations/stripes-erm-components/en';

import translations from '../../../translations/ui-erm-comparisons/en';

const translationsProperties = [
  {
    prefix: 'ui-erm-comparisons',
    translations,
  },
  {
    prefix: 'stripes-erm-components',
    translations: ermTranslations
  },
  ...coreTranslations
];

export default translationsProperties;
