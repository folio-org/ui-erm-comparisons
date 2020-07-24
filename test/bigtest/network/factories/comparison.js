import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  class: () => 'org.olf.general.jobs.ComparisonJob',
  comparisonPoints: () => [{
    id: () => faker.random.uuid(),
    date: () => faker.date.recent().toISOString(),
    titleList: () => faker.random.uuid()
  }, {
    id: () => faker.random.uuid(),
    date: () => faker.date.recent().toISOString(),
    titleList: () => faker.random.uuid()
  }],
  dateCreated: () => faker.date.recent().toISOString(),
  name: () => faker.random.words(),
  ended: () => faker.date.recent().getTime(),
  started: () => faker.date.recent().getTime(),
  status: () => {
    const val = faker.random.arrayElement(['Queued', 'In progress', 'Ended']);
    return {
      id: () => faker.random.uuid(),
      value: val,
      label: val,
    };
  },
  result: () => {
    const val = faker.random.arrayElement(['Success', 'Partial success', 'Failure', 'Interrupted']);
    return {
      id: () => faker.random.uuid(),
      value: val,
      label: val,
    };
  },
});
