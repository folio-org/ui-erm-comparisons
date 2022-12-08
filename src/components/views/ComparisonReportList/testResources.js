const sourceData = {
  'comparisonPointData': {
    'id': '7b96d8a2-c235-414a-a4a8-99f3b56b3f90',
    'dateCreated': 1670338125134,
    'ended': 1670338151571,
    'result': {
      'id': '2c9180b07f436083017f436310b40023',
      'value': 'success',
      'label': 'Success'
    },
    'name': 'CM test comparison',
    'runnerId': 'b96145e9-c687-48aa-b83b-1bff51134b2a',
    'comparisonPoints': [
      {
        'id': 'b37f7792-eade-4c3f-9c7c-dbc25f4abdd6',
        'date': '2022-12-06',
        'job': {
          'id': '7b96d8a2-c235-414a-a4a8-99f3b56b3f90'
        },
        'titleList': {
          'id': 'ed5df163-aaf8-4648-bb38-86e99bbacb3e',
          'name': 'K-Int Test Package 001',
          'class': 'org.olf.kb.Pkg'
        }
      },
      {
        'id': '1c9f4ff3-2b25-44b4-8e5d-1cc523a1dff9',
        'date': '2022-12-06',
        'job': {
          'id': '7b96d8a2-c235-414a-a4a8-99f3b56b3f90'
        },
        'titleList': {
          'id': '308a3ec3-bedc-4f7f-a50d-bc410793fa91',
          'name': 'Active Agreement LR 002',
          'class': 'org.olf.erm.SubscriptionAgreement'
        }
      }
    ],
    'started': 1670338150252,
    'status': {
      'id': '2c9180b07f436083017f43631123002a',
      'value': 'ended',
      'label': 'Ended'
    },
    'class': 'org.olf.general.jobs.ComparisonJob',
    'fullLogCount': 0,
    'errorLogCount': 0,
    'infoLogCount': 0
  },
  'report': [
    {
      'overlap': 'full',
      'availability': {
        '021961de-a39e-46dc-95ce-0e8b3095b0f8': {
          'coverage': {
            'b8e7c6ee-d6f8-4e3c-9837-ef339db0ff46': {
              'statements': [
                {
                  'startDate': '2014-01-01',
                  'endDate': '2014-12-31',
                  'startVolume': '1',
                  'startIssue': '1',
                  'endVolume': '1',
                  'endIssue': '4'
                },
                {
                  'startDate': '2015-01-01',
                  'endDate': null,
                  'startVolume': '2',
                  'startIssue': '1',
                  'endVolume': null,
                  'endIssue': null
                }
              ],
              'occurrences': {
                '1c9f4ff3-2b25-44b4-8e5d-1cc523a1dff9': true,
                'b37f7792-eade-4c3f-9c7c-dbc25f4abdd6': true
              }
            }
          },
          'platform': 'Bentham Science',
          'url': 'https://benthamscience.com/journal/index.php?journalID=ccand',
          'name': "'Clinical Cancer Drugs' on Platform 'Bentham Science'",
          'longName': "'Clinical Cancer Drugs' on Platform 'Bentham Science'"
        }
      },
      'name': 'Clinical Cancer Drugs8c936e43-8757-41f0-811d-7ee3b91815dd',
      'id': '8c936e43-8757-41f0-811d-7ee3b91815dd',
      'longName': 'Clinical Cancer Drugs',
      'type': {
        'id': '2c9180b07f436083017f43630f94000f',
        'value': 'serial',
        'label': 'Serial'
      },
      'subType': {
        'id': '2c9180b07f436083017f43630f6b000c',
        'value': 'electronic',
        'label': 'Electronic'
      },
      'identifiers': [
        {
          'dateCreated': '2022-10-27T13:30:20Z',
          'lastUpdated': '2022-10-27T13:30:20Z',
          'status': {
            'id': '2c9180b07f436083017f43632855005c',
            'value': 'approved',
            'label': 'approved'
          },
          'resource': {
            'id': '8c936e43-8757-41f0-811d-7ee3b91815dd'
          },
          'identifier': {
            'value': '2212-6988',
            'ns': {
              'value': 'issn'
            }
          }
        }
      ]
    }
  ]
};

export default sourceData;
