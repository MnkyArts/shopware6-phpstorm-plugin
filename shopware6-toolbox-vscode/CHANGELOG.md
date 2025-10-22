# Changelog

All notable changes to the Shopware 6 Toolbox VSCode extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-10-22

### Added

#### Admin Component Navigation
- Admin component parser that indexes Shopware admin components
- "Go to Definition" for admin components (Ctrl+Click on component names)
- Autocompletion for admin component names in JavaScript/Vue files
- Component props information in hover documentation
- File watcher for automatic component re-indexing

#### Twig Block Versioning (CodeLens)
- CodeLens provider showing Shopware version information for Twig blocks
- Visual indicators for when blocks were introduced, deprecated, or removed
- Click on CodeLens to see detailed version information
- Helps developers understand block compatibility across Shopware versions

#### Code Diagnostics and Inspections
- Real-time code diagnostics for PHP files
- Detection of abstract class instantiation errors
- Warnings for deprecated method usage
- Checks for container service locator anti-patterns
- Configurable via `shopware6.enableDiagnostics` setting
- Diagnostics update on file open, save, and change (debounced)

#### Feature Flag Autocompletion
- Autocompletion for Shopware feature flags
- Works in PHP (`Feature::isActive()`), JavaScript/Vue (`Feature.isActive()`), and Twig (`feature()`)
- Includes 20+ common Shopware feature flags
- Shows flag name and description on hover

### Changed
- Updated extension version to 0.2.0
- Enhanced completion providers with additional context-aware suggestions
- Improved file watchers to include admin component files

### Technical Details
- Added `AdminComponentParser` for parsing Vue.js admin components
- Added `AdminComponentDefinitionProvider` for component navigation
- Added `AdminComponentCompletionProvider` for component suggestions
- Added `TwigBlockCodeLensProvider` for Twig block versioning
- Added `ShopwareDiagnosticsProvider` for code inspections
- Added `FeatureFlagCompletionProvider` for feature flag suggestions
- All new features integrate seamlessly with existing providers

## [0.1.0] - 2025-10-22

### Added

#### Snippets
- PHP deprecation snippet (`sw-php-deprecation`)
- UUID generator snippet for all languages (`sw-uuid`)
- Complete config.xml snippet library (15+ element types)
- Automatic snippet expansion via IntelliSense

#### Code Generators
- Generate Admin Component command with Vue.js and Twig templates
- Generate Config XML command with proper schema
- Generate Vue Module command with list and detail pages
- Generate Scheduled Task command with task and handler classes
- Generate Changelog command with Keep a Changelog format
- Create New Plugin command with full scaffolding wizard

#### Autocompletion
- Snippet key autocompletion in PHP (`$this->trans()`)
- Snippet key autocompletion in Twig (`{{ 'key'|trans }}`)
- Snippet key autocompletion in JavaScript/Vue (`$tc()`, `$t()`)
- Twig function autocompletion (`theme_config`, `config`, `seoUrl`, etc.)
- Repository entity name autocompletion (`repositoryFactory.create()`)
- Automatic snippet file parsing and indexing
- File watcher for automatic snippet reloading

#### Navigation
- Go to Definition for snippet keys (Ctrl+Click or F12)
- Jump to snippet definition files from code

#### Configuration
- `shopware6.enableAutocompletion` setting
- `shopware6.enableDiagnostics` setting
- `shopware6.snippetPaths` setting for custom snippet locations
- `shopware6.pluginDirectory` setting for plugin generation

#### Developer Experience
- Comprehensive TypeScript-based implementation
- Modular architecture with separate parsers, providers, and templates
- Extensive inline documentation
- README with examples and usage instructions

### Technical Details
- Built with TypeScript 5.x
- Supports VSCode 1.80.0+
- Uses fast-xml-parser for XML handling
- Uses glob for file pattern matching
- Implements VSCode's Completion, Definition, and other provider APIs

[0.2.0]: https://github.com/MnkyArts/shopware6-phpstorm-plugin/releases/tag/vscode-0.2.0
[0.1.0]: https://github.com/MnkyArts/shopware6-phpstorm-plugin/releases/tag/vscode-0.1.0
