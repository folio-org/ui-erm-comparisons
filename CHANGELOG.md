# Change history for ui-erm-comparisons

## 6.0.0 In progress
* ERM-1026 Capitalise Full, Partial and None
* STRIPES-870 BREAKING upgrade react to v18
  * ERM-2997 upgrade ui-erm-comparisons React to v18
* ERM-3026 *BREAKING* bump `react-intl` to `v6.4.4`

## 5.0.0 2023-02-22
* ERM-2620 move typescript to dev-deps
* ERM-2564 Increment ui-erm-comparisons to Stripes v8
* ERM-2555 Clicking "Reset all" in ERM Comparison search does not clear comparison point names
* ERM-2554 Option+N keyboard shortcut fails in ERM Comparisons
* ERM-2515 Refactor erm-comparison routes
* ERM-2484 Refactor Log Containers to react-query in erm-comparisons
* ERM-2483 use registry for creating package link
* ERM-2467 use registry for creating package link
* ERM-2456 Bump ui-erm-comparisons erm-components dep
* ERM-2416 Separate title search and package search in local KB e-resource searching
* ERM-2296 Remove BigTest/Nightmare dependencies and tests (ui-erm-comparisons)
* FAT-142 ui-erm-comparisons: UI tests replacement with RTL/Jest
  * ERM-2430 Add test coverage for ui-erm-comparisons view <ComparisonView>
  * ERM-2429 Add test coverage for ui-erm-comparisons view <ComparisonView>
  * ERM-2428 Add test coverage for ui-erm-comparisons view <Comparisons>
  * ERM-2427 Add test coverage for ui-erm-comparisons views <ComparisonReportList>
  * ERM-2426 Add test coverage for ui-erm-comparisons views <ComparisonReport>
  * ERM-2425 Add test coverage for ui-erm-comparisons views <ComparisonReport>
  * ERM-1525 Add test coverage for ui-erm-comparisons <ComparisonRoutes>
  * ERM-1524 Add test coverage for ui-erm-comparisons <ComparisonViewRoute>
  * ERM-1523 Add test coverage for ui-erm-comparisons <ComparisonReportViewRoute>
  * ERM-1522 Add test coverage for ui-erm-comparisons <ComparisonCreateRoute>
  * ERM-1312 Add test coverage for ui-erm-comparisons <TitleInfoPopover>
  * ERM-1311 Add test coverage for ui-erm-comparisons <Logs>
  * ERM-1310 Add test coverage for ui-erm-comparisons <EntitlementAgreementsList>
  * ERM-1309 Add test coverage for ui-erm-comparisons <ComparisonSections>
    * ERM-1447 Add test coverage for <ComparisonPoints.js>
    * ERM-1446 Add test coverage for <ComparisonInfo.js>
  * ERM-1308 Add test coverage for ui-erm-comparisons <ComparisonPointFieldArray>
    * ERM-1445 Add test coverage for <PackageField.js>
    * ERM-1444 Add test coverage for <ComparisonPointFieldArray.js>
    * ERM-1443 Add test coverage for <ComparisonPointField.js>
    * ERM-1442 Add test coverage for <AgreementField.js>
  * ERM-1307 Add test coverage for ui-erm-comparisons <ComparisonFilters>
    * ERM-1441 Add test coverage for <ComparisonPointFilter.js>
    * ERM-1440 Add test coverage for <ComparisonFilters.js>


## 4.3.0 2022-10-27
* ERM-2380 favicons is incorrectly listed as a peer-dependency
* ERM-2373 @folio/stripes-testing is incorrectly listed as a direct dependency
* ERM-2337 Error on attempting to create new ERM comparison
* ERM-2320 stripes-erm-components should be a peer
* ERM-2277 Karma tests fail on Github Actions CI with Node v14 and v16 LTS
* ERM-2234 Replace withKiwtFieldArray with useKiwtFieldArray
* Bump to stripes-erm-components ^7.0.0

## 4.2.1 2022-07-05
* ERM-2108 / ERM-2085 Refactor away from react-intl-safe-html
* ERM-2098 Replace babel-eslint with @babel/eslint-parser
* ERM-2073 Agreement/license links missing in Dashboard widgets.
* ERM-1971 Bump eslint-config stripes version

## 4.1.2 2022-03-03
* ERM-1993 Prepare ERM Comparisons for RTL development
* ERM-1990 Add hyperlink to ERM Comparison comparison points
* ERM-1980 Non-scrolling column headings in ERM Comparisons report view
* ERM-1895 Upgrade `@folio/react-intl-safe-html` for compatibility with `@folio/stripes` `v7`.
* ERM-1759 Apply keyboard shortcuts modal guidelines

## 4.0.0 2021-10-07
* Upgrade to stripes v7
* Display keyboard shortcuts modal. ERM-1737
* Included interface dependency for erm 5.0. ERM-1747

## 2.1.0 2021-06-16
 * ERM-1596 Add descriptions to visible permission set in ui-erm-comparison
 * ERM-1557 ERM comparisons: Give focus to the Name field on opening the "New" pane
 * bumped babel-eslint dep to 10.0.0

## 2.0.0 2021-03-17
* ERM Comparisons: filters for Running status and Result use labels not values. ERM-1553
* Upgrade to stripes-cli v2 ERM-1550
* Added keyboard shortcuts. ERM-1241
* Action button should not show if user would see no options in Action dropdown. ERM-1225
* Upgrade to Stripes 6.0

## 1.1.1 2020-11-05
* Fixes bug where incorrect Dates are saved when tenant timezone is ahead of UTC. ERM-1202

## 1.1.0 2020-10-15

* New app created
* Added Package/Agreement comparison selection UI. erm-950
* Added Package/Agreement comparison output UI. ERM-951
* Added tests for the app.
* Added comparison icon to the app. ERM-1011
* Upgrade Stripes to v5. ERM-1138
* Replace `bigtest/mirage` with `miragejs`.

