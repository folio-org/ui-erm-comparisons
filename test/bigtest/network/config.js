import { get, isEmpty } from 'lodash';
import parseQueryString from './util';

export default function config() {
  this.get('erm/jobs/type/comparison', (schema, request) => {
    const queryString = request.url.split('?')[1];
    const params = parseQueryString(queryString);
    let { filters } = params;

    // when there is only one filter and its not an array
    if (filters && !isEmpty(filters) && !Array.isArray(filters)) filters = [filters];

    // returns a flattened array of { name, value } pairs of filter name and its value
    const parsed = filters && filters.map((filter) => {
      return filter.split('||').map(f => {
        const [name, value] = f.split('==');
        return { name, value };
      });
    }).flat();

    if (parsed) {
      return {
        results: schema.jobs.where((job) => {
          return parsed.reduce((acc, { name, value }) => {
            return acc || get(job, name) === value;
          }, false);
        }).models
      };
    } else {
      return { results: schema.jobs.all().models };
    }
  });

  this.get('/erm/refdata/persistentJob/result', () => {
    return [
      { 'id': '2c9d81916c044334016c0444659b0032', 'value': 'success', 'label': 'Success' },
      { 'id': '2c9d81916c044334016c044465a90033', 'value': 'partial_success', 'label': 'Partial success' },
      { 'id': '2c9d81916c044334016c044465ba0034', 'value': 'failure', 'label': 'Failure' },
      { 'id': '2c9d81916c044334016c044465c10035', 'value': 'interrupted', 'label': 'Interrupted' }
    ];
  });

  this.get('/erm/refdata/persistentJob/status', () => {
    return [
      { 'id': '2c9d81916c044334016c04445e310008', 'value': 'queued', 'label': 'Queued' },
      { 'id': '2c9d81916c044334016c0444657d002f', 'value': 'in_progress', 'label': 'In progress' },
      { 'id': '2c9d81916c044334016c044465880030', 'value': 'ended', 'label': 'Ended' }
    ];
  });
}
