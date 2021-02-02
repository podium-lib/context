## [4.1.16](https://github.com/podium-lib/context/compare/v4.1.15...v4.1.16) (2021-02-02)


### Bug Fixes

* **deps:** update dependency @podium/utils to v4.4.4 ([2b91d11](https://github.com/podium-lib/context/commit/2b91d11ae4d3d8ab818e779fb1abb784c2234507))

## [4.1.15](https://github.com/podium-lib/context/compare/v4.1.14...v4.1.15) (2021-02-01)


### Bug Fixes

* **deps:** update dependency @podium/schemas to v4.1.1 ([3084a0b](https://github.com/podium-lib/context/commit/3084a0b9dc880c8f49e6865aee74e3dc5a12c755))

## [4.1.14](https://github.com/podium-lib/context/compare/v4.1.13...v4.1.14) (2021-01-22)


### Bug Fixes

* **deps:** update dependency @podium/utils to v4.4.3 ([54b259d](https://github.com/podium-lib/context/commit/54b259d5f25ac47dfd99f8d7411f5849af3c2bf3))

## [4.1.13](https://github.com/podium-lib/context/compare/v4.1.12...v4.1.13) (2021-01-22)


### Bug Fixes

* **deps:** update dependency @podium/schemas to v4.1.0 ([ab54e6f](https://github.com/podium-lib/context/commit/ab54e6f8807129c81ce8e780cc4d836ab187bcd2))

## [4.1.12](https://github.com/podium-lib/context/compare/v4.1.11...v4.1.12) (2020-10-29)


### Bug Fixes

* **deps:** update dependency @podium/utils to v4.4.1 ([bc74ebd](https://github.com/podium-lib/context/commit/bc74ebdb17b21b97f9edaf8ad32d154ce7e0f72b))

## [4.1.11](https://github.com/podium-lib/context/compare/v4.1.10...v4.1.11) (2020-10-12)


### Bug Fixes

* **deps:** update dependency @podium/utils to v4.4.0 ([adc868d](https://github.com/podium-lib/context/commit/adc868d6eb489386a7357ea16c36d536b168e8b6))

## [4.1.10](https://github.com/podium-lib/context/compare/v4.1.9...v4.1.10) (2020-10-10)


### Bug Fixes

* **deps:** update dependency @podium/utils to v4.3.3 ([8c72923](https://github.com/podium-lib/context/commit/8c72923d55e0811452e47abeb0009c3e1af52781))

## [4.1.9](https://github.com/podium-lib/context/compare/v4.1.8...v4.1.9) (2020-10-10)


### Bug Fixes

* **deps:** update dependency @podium/schemas to v4.0.5 ([423be1a](https://github.com/podium-lib/context/commit/423be1a163740c7bb3005a67cf39c48fa90f25d6))

## [4.1.8](https://github.com/podium-lib/context/compare/v4.1.7...v4.1.8) (2020-09-13)


### Bug Fixes

* **deps:** update dependency @podium/utils to v4.3.1 ([bec5c9b](https://github.com/podium-lib/context/commit/bec5c9be228b6de122daf76340afa50a7d474873))

## [4.1.7](https://github.com/podium-lib/context/compare/v4.1.6...v4.1.7) (2020-09-13)


### Bug Fixes

* **deps:** update dependency @podium/schemas to v4.0.4 ([406197e](https://github.com/podium-lib/context/commit/406197e3c643b1736678b848e35f4f627bbbd43b))

# Changelog

Notable changes to this project will be documented in this file.

The latest version of this document is always available in [releases][releases-url].

## [unreleased]

## [3.0.3] - 2019-03-27

-   Updated @podium/utils to version 3.1.2 - [#14](https://github.com/podium-lib/context/pull/14)
-   Updated other dependencies

## [3.0.2] - 2019-03-10

-   Updated @metrics/client to version 2.4.1 - [#13](https://github.com/podium-lib/context/pull/13)
-   Updated other dependencies

## [3.0.1] - 2019-03-05

-   Add error event listeners on all metric streams - [#10](https://github.com/podium-lib/context/pull/10)

## [3.0.0] - 2019-02-20

-   Initial open source release. Module is made http framework free and open source - [#6](https://github.com/podium-lib/context/pull/6)

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

[unreleased]: https://github.com/podium-lib/context/compare/v3.0.3...HEAD
[3.0.3]: https://github.com/podium-lib/context/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/podium-lib/context/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/podium-lib/context/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/podium-lib/context/compare/v2.2.3...v3.0.0
[2.2.3]: https://github.com/podium-lib/context/compare/v2.2.2...v2.2.3
[2.2.2]: https://github.com/podium-lib/context/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/podium-lib/context/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/podium-lib/context/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/podium-lib/context/compare/v2.0.0...v2.1.0
[releases-url]: https://github.com/podium-lib/context/blob/master/CHANGELOG.md
