# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0](https://github.com/GlaivePro/wa-calculator/releases/tag/0.4.0)
### Added
- 2025 edition of WA points. The 2025 edition has no venue splits, some track
  events have `_short` twins (e.g. `200m_short`) which can be selected via the
  new `trackType` option (`'long'`/`'short'`) or requested explicitly.
- Support for Node 24 & Node 26.

### Changed
- Hand time correction logic to match the PHP package: the `_short` twins
  receive the same corrections as their plain counterparts, 300mh receives
  the +0.14 correction, 500m correction only applies up to the 2022 edition.

## 0.3.1
### Added
- Support for Node 22.


## 0.3.0
### Added
- 2022 edition of WA points.
