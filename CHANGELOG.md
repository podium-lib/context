# Changelog

Notable changes to this project will be documented in this file.

The latest version of this document is always available in [releases][releases-url].

## [unreleased]

## [2.2.3] - 2018-12-18

-   Replaced @podium/metrics with @metrics/client

## [2.2.2] - 2018-18-14

-   Changed default locale from en-EN to en-US - #20

## [2.2.1] - 2018-07-18

-   Reverted a change causing .middleware() to not honor additional parsers which is added when the @podium/layout class is extended - #18

## [2.2.0] - 2018-07-17

-   Align constructor arguments on mount origin parser with other parsers - #11
-   Align constructor arguments on mount pathname parser with other parsers + remove autodetection of mount pathname - #12
-   Align constructor arguments on public pathname parser with other parsers + remove autodetection of public pathname #13
-   Simplify parsers #16
-   Align constructor arguments #17
-   Documentation #14

## [2.1.0] - 2018-07-10

-   First argument, name, on the constructor is now moved to the options object of the constructor. See: #10

[unreleased]: https://github.com/podium-lib/context/compare/v2.2.3...HEAD
[2.2.3]: https://github.com/podium-lib/context/compare/v2.2.2...v2.2.3
[2.2.2]: https://github.com/podium-lib/context/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/podium-lib/context/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/podium-lib/context/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/podium-lib/context/compare/v2.0.0...v2.1.0
[releases-url]: https://github.com/podium-lib/context/blob/master/CHANGELOG.md
