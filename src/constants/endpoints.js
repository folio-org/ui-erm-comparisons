// These are the same as ui-agreements, because they share a backend module

export const REFDATA_ENDPOINT = 'erm/refdata';
export const CUSTPROP_ENDPOINT = 'erm/custprops';
export const SETTINGS_ENDPOINT = 'erm/settings/appSettings';

export const COMPARISONS_ENDPOINT = 'erm/jobs/type/comparison';
export const COMPARISON_ENDPOINT = (id) => `erm/jobs/${id}`;
