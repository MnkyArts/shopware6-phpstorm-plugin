# Shopware 6 Toolbox for VSCode

A comprehensive VSCode extension that provides development tools, autocompletion, snippets, and code generators for Shopware 6 development. This is a port of the popular [Shopware 6 Toolbox for JetBrains IDEs](https://github.com/shyim/shopware6-phpstorm-plugin).

## Features

### 🎨 Snippets (Live Templates)

Quick code snippets for common Shopware 6 patterns accessible via IntelliSense:

#### PHP Snippets
- `sw-php-deprecation` - Add deprecation annotations to functions/methods/classes

#### XML Config Snippets
- `sw-config-base` - Complete config.xml structure with card
- `sw-config-element-text` - Text input field
- `sw-config-element-bool` - Boolean/switch field
- `sw-config-element-checkbox` - Checkbox field
- `sw-config-element-textarea` - Textarea field
- `sw-config-element-int` - Integer input field
- `sw-config-element-float` - Float input field
- `sw-config-element-date` - Date picker
- `sw-config-element-colorpicker` - Color picker
- `sw-config-element-single-select` - Single select dropdown
- `sw-config-element-multi-select` - Multi select dropdown
- And more...

#### Universal Snippets
- `sw-uuid` - Generate valid UUIDs (works in PHP, JavaScript, Vue, Twig)

### ⚡ Code Generators

Generate boilerplate code with simple commands (access via Command Palette `Ctrl+Shift+P`):

#### `Shopware 6: Generate Admin Component`
Creates a complete Vue.js admin component with:
- Component index.js with Shopware.Component.register
- Twig template file
- Proper directory structure
- Choice of Administration or Storefront location

#### `Shopware 6: Generate Config XML`
Creates a plugin configuration file with:
- Proper XML schema reference
- Example configuration fields
- Multi-language support templates

#### `Shopware 6: Generate Vue Module`
Creates a complete admin module structure with:
- Module registration with routes
- List page component and template
- Detail page component and template
- Navigation menu registration
- Proper folder structure

#### `Shopware 6: Generate Scheduled Task`
Generates PHP classes for scheduled tasks:
- Task class extending ScheduledTask
- TaskHandler class
- Configurable namespace and intervals

#### `Shopware 6: Generate Changelog`
Creates a CHANGELOG.md file following:
- [Keep a Changelog](https://keepachangelog.com/) format
- Semantic versioning structure
- Pre-filled sections (Added, Changed, Fixed, etc.)

#### `Shopware 6: Create New Plugin`
Full plugin scaffolding wizard that creates:
- Plugin base class
- composer.json with proper autoloading
- services.xml configuration
- config.xml for plugin settings
- README.md
- Complete directory structure
- Interactive prompts for metadata (name, author, license, etc.)

### 🔍 IntelliSense & Autocompletion

Smart autocompletion for Shopware 6 development:

#### Snippet Keys
Autocomplete snippet keys in:
- **PHP**: `$this->trans('snippet.key')`
- **Twig**: `{{ 'snippet.key'|trans }}`
- **Vue.js/JavaScript**: `$tc('snippet.key')`

The extension automatically parses your project's snippet JSON files and provides suggestions.

#### Storefront Twig Functions
Autocomplete for common Twig functions:
- `theme_config('key')` - Get theme configuration
- `config('key')` - Get system configuration
- `seoUrl('route', params)` - Generate SEO URLs
- `sw_include` - Include templates
- `sw_extends` - Extend templates

#### Repository Factory
Autocomplete entity names in:
- `this.repositoryFactory.create('entity_name')`

Common entities included: product, category, customer, order, sales_channel, etc.

### 🔗 Navigation

- **Go to Definition** for snippet keys (Ctrl+Click or F12)
- Jump to snippet definition files
- Quick navigation between related files

## Requirements

- VSCode 1.80.0 or higher
- A Shopware 6 project (detected by composer.json with Shopware dependencies)

## Installation

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Shopware 6 Toolbox"
4. Click Install

Or install from .vsix file:
1. Download the latest .vsix from releases
2. In VSCode: Extensions → ... → Install from VSIX

## Extension Settings

Configure the extension via VSCode Settings:

- `shopware6.enableAutocompletion`: Enable/disable autocompletion features (default: `true`)
- `shopware6.enableDiagnostics`: Enable/disable code inspections (default: `true`)
- `shopware6.snippetPaths`: Glob patterns for snippet files (default: `["**/snippet/**/*.json"]`)
- `shopware6.pluginDirectory`: Default directory for plugins (default: `custom/plugins`)

## Usage

### Using Snippets

1. Start typing a snippet prefix (e.g., `sw-config-base`)
2. IntelliSense will show available snippets
3. Select the snippet and press `Tab` or `Enter`
4. Fill in the placeholder values using `Tab` to jump between them

### Generating Code

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
2. Type "Shopware 6:" to see all available commands
3. Select the generator you want to use
4. Follow the interactive prompts
5. Files will be created and opened automatically

### Using Autocompletion

Autocompletion works automatically as you type:

**Snippet completion in Twig:**
```twig
{{ 'my-plugin.general.title'|trans }}
     ^^^^^^^^^^^^^^^^^^^^^^^^
     Autocomplete suggests snippet keys from your project
```

**Repository completion in JavaScript:**
```javascript
this.repositoryFactory.create('product')
                              ^^^^^^^^^
                              Autocomplete suggests entity names
```

**Twig function completion:**
```twig
{{ theme_config('colors.primary') }}
   ^^^^^^^^^^^^
   Autocomplete suggests Shopware functions
```

## Keyboard Shortcuts

- `Ctrl+Shift+P` - Open Command Palette to access generators
- `F12` or `Ctrl+Click` - Go to Definition (for snippets)
- `Tab` - Navigate between snippet placeholders

## Development

### Building from Source

```bash
cd shopware6-toolbox-vscode
npm install
npm run compile
```

### Packaging

```bash
npm install -g vsce
vsce package
```

This creates a `.vsix` file that can be installed in VSCode.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Known Issues

- This is an initial release focused on core functionality
- Some advanced features from the JetBrains plugin are still being ported
- Please report issues on GitHub

## Roadmap

Planned features for future releases:
- [ ] Admin component navigation and "Go to Definition"
- [ ] Code inspections and diagnostics
- [ ] Twig block versioning support (CodeLens)
- [ ] Feature flag autocompletion
- [ ] Context-aware component suggestions
- [ ] More advanced snippet parsing
- [ ] Quick fixes for common issues

## Release Notes

### 0.1.0

Initial release featuring:
- ✅ Comprehensive snippet library (PHP, XML, Universal)
- ✅ 6 code generators (Component, Config, Module, Task, Changelog, Plugin)
- ✅ Snippet key autocompletion for PHP, Twig, Vue, JavaScript
- ✅ Twig function autocompletion
- ✅ Repository entity autocompletion
- ✅ Go to Definition for snippets
- ✅ Configurable settings
- ✅ File watchers for automatic snippet reloading

## Credits

This extension is inspired by and based on the [Shopware 6 Toolbox for JetBrains IDEs](https://github.com/shyim/shopware6-phpstorm-plugin) by [@shyim](https://github.com/shyim).

## License

MIT License - see LICENSE file for details
