export function getChangelogTemplate(version: string): string {
    const date = new Date().toISOString().split('T')[0];
    
    return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${version}] - ${date}

### Added
- Initial release

### Changed

### Deprecated

### Removed

### Fixed

### Security
`;
}
