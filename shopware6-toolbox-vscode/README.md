# Shopware 6 Toolbox for VSCode

A comprehensive VSCode extension that provides development tools, autocompletion, snippets, and code generators for Shopware 6 development.

## Features

### Snippets (Live Templates)

Quick code snippets for common Shopware 6 patterns:

- **PHP**: `sw-php-deprecation` - Add deprecation annotations
- **XML Config**: Various config.xml element snippets (e.g., `sw-config-element-text`, `sw-config-element-bool`)
- **UUID Generator**: `sw-uuid` - Generate valid UUIDs (available in PHP, JavaScript, Vue, Twig)

### Code Generators

Generate boilerplate code with simple commands:

- **Generate Admin Component**: Create Vue.js admin components
- **Generate Config XML**: Create plugin configuration files
- **Generate Vue Module**: Create complete Vue module structures
- **Generate Scheduled Task**: Create scheduled task classes
- **Generate Changelog**: Create CHANGELOG.md files
- **Create New Plugin**: Full plugin scaffolding wizard

### IntelliSense & Autocompletion

Smart autocompletion for:

- Admin component names and properties
- Snippet keys in PHP, Twig, and Vue.js
- Storefront Twig functions (`theme_config`, `config`, `seoUrl`, etc.)
- Repository factory entity names
- Feature flags
- Module.register labels

### Navigation

- Go to Definition for components, snippets, and config keys
- Find references across the project

### Code Inspections

- Detect abstract class misuse
- Twig block versioning support
- Common Shopware 6 anti-patterns

## Requirements

- VSCode 1.80.0 or higher
- A Shopware 6 project (detected by composer.json with Shopware dependencies)

## Extension Settings

This extension contributes the following settings:

- `shopware6.enableAutocompletion`: Enable/disable autocompletion features (default: `true`)
- `shopware6.enableDiagnostics`: Enable/disable code inspections (default: `true`)
- `shopware6.snippetPaths`: Glob patterns for snippet files
- `shopware6.pluginDirectory`: Default directory for plugins (default: `custom/plugins`)

## Usage

### Using Snippets

1. Start typing a snippet prefix (e.g., `sw-config-base`)
2. Press `Tab` or `Enter` to expand
3. Fill in the placeholder values

### Generating Code

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Shopware 6:" to see available commands
3. Select the generator you want to use
4. Follow the prompts

### Autocompletion

Autocompletion works automatically when you're editing:
- PHP files with Shopware code
- Twig templates
- Vue.js components
- JavaScript files in admin context

## Known Issues

This is an initial release. Please report issues on GitHub.

## Release Notes

### 0.1.0

Initial release with:
- Basic snippets for PHP, XML, and general use
- Extension structure and configuration
- Command placeholders for generators

## Contributing

Contributions are welcome! Please visit the GitHub repository.

## License

MIT
