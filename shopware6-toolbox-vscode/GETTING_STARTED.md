# Getting Started with Shopware 6 Toolbox for VSCode

This guide will help you get started with the Shopware 6 Toolbox extension for Visual Studio Code.

## Installation

### From VSCode Marketplace (Recommended)

1. Open Visual Studio Code
2. Click on the Extensions icon in the sidebar (or press `Ctrl+Shift+X`)
3. Search for "Shopware 6 Toolbox"
4. Click "Install"

### From VSIX File

If you have a `.vsix` file:

1. Open Visual Studio Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Click the "..." menu at the top right
4. Select "Install from VSIX..."
5. Choose the downloaded `.vsix` file

## Quick Start

### 1. Open a Shopware 6 Project

The extension activates automatically when you open a folder containing a Shopware 6 project (detected by `composer.json` with Shopware dependencies).

### 2. Try the Snippets

Open a PHP file and type:
```php
sw-php-deprecation
```
Press `Tab` to expand the deprecation annotation snippet.

Open an XML file and type:
```xml
sw-config-base
```
Press `Tab` to create a complete config.xml structure.

### 3. Generate Your First Component

1. Press `Ctrl+Shift+P` to open the Command Palette
2. Type "Shopware 6: Generate Admin Component"
3. Follow the prompts:
   - Enter component name (e.g., `sw-my-component`)
   - Choose location (Administration/Storefront/Custom)
4. The component files will be created and opened

### 4. Create a New Plugin

1. Press `Ctrl+Shift+P`
2. Type "Shopware 6: Create New Plugin"
3. Answer the wizard questions:
   - Plugin name
   - Author
   - Description
   - Namespace
   - License
   - Version
   - Plugin directory
4. A complete plugin structure will be created!

## Features Overview

### 📝 Snippets

Type these prefixes and press `Tab` to expand:

**PHP:**
- `sw-php-deprecation` - Deprecation annotation

**XML (config.xml):**
- `sw-config-base` - Base config structure
- `sw-config-element-text` - Text input field
- `sw-config-element-bool` - Boolean field
- `sw-config-element-int` - Integer field
- ...and many more

**Universal (all languages):**
- `sw-uuid` - Generate a UUID

### 🛠️ Code Generators

Access via Command Palette (`Ctrl+Shift+P`):

1. **Generate Admin Component**
   - Creates Vue.js component with template
   - Proper file structure
   
2. **Generate Config XML**
   - Plugin configuration file
   - Pre-filled with examples

3. **Generate Vue Module**
   - Complete admin module
   - List and detail pages
   - Navigation registration

4. **Generate Scheduled Task**
   - Task class
   - Handler class
   - Proper namespace

5. **Generate Changelog**
   - CHANGELOG.md
   - Keep a Changelog format

6. **Create New Plugin**
   - Complete plugin scaffolding
   - All necessary files

### 🔍 Autocompletion

Autocompletion works automatically as you type:

**Snippet Keys:**

In PHP:
```php
$this->trans('my-plugin.') // Shows available snippet keys
```

In Twig:
```twig
{{ 'my-plugin.'|trans }} // Shows available snippet keys
```

In JavaScript/Vue:
```javascript
this.$tc('my-plugin.') // Shows available snippet keys
```

**Twig Functions:**

In Twig templates:
```twig
{{ theme_config( }} // Autocomplete shows theme_config function
{{ config( }}       // Autocomplete shows config function
{{ seoUrl( }}       // Autocomplete shows seoUrl function
```

**Repository Entities:**

In JavaScript/Vue:
```javascript
this.repositoryFactory.create(' // Shows entity names
```

### 🔗 Go to Definition

- **Ctrl+Click** (or **F12**) on a snippet key to jump to its definition
- Works in PHP, Twig, JavaScript, and Vue files

## Configuration

Customize the extension via VSCode settings:

1. Open Settings (`Ctrl+,`)
2. Search for "Shopware 6"
3. Configure:

**Available Settings:**

```json
{
  // Enable/disable autocompletion
  "shopware6.enableAutocompletion": true,
  
  // Enable/disable diagnostics (future feature)
  "shopware6.enableDiagnostics": true,
  
  // Paths where snippet files are located
  "shopware6.snippetPaths": [
    "**/snippet/**/*.json",
    "**/Resources/snippet/**/*.json"
  ],
  
  // Default directory for new plugins
  "shopware6.pluginDirectory": "custom/plugins"
}
```

## Common Workflows

### Creating a New Admin Component

1. Open Command Palette (`Ctrl+Shift+P`)
2. "Shopware 6: Generate Admin Component"
3. Enter name: `sw-my-feature`
4. Choose: Administration
5. Files created:
   ```
   src/Resources/app/administration/src/component/sw-my-feature/
   ├── index.js
   └── sw-my-feature.html.twig
   ```
6. Edit the files to implement your component

### Adding Configuration to a Plugin

1. Open Command Palette (`Ctrl+Shift+P`)
2. "Shopware 6: Generate Config XML"
3. Enter or leave empty for auto-detection
4. File created: `src/Resources/config/config.xml`
5. Edit to add your configuration fields
6. Use snippet `sw-config-element-text` to add fields quickly

### Creating a Scheduled Task

1. Open Command Palette (`Ctrl+Shift+P`)
2. "Shopware 6: Generate Scheduled Task"
3. Enter task name: `MyCleanupTask`
4. Enter namespace: `MyPlugin\ScheduledTask`
5. Choose path: `src/ScheduledTask`
6. Files created:
   - `MyCleanupTask.php` - Task definition
   - `MyCleanupTaskHandler.php` - Task handler
7. Register in `services.xml`:
   ```xml
   <service id="MyPlugin\ScheduledTask\MyCleanupTaskHandler">
       <tag name="messenger.message_handler"/>
   </service>
   ```

### Working with Snippets

1. Create your snippet files (or use existing):
   ```
   src/Resources/snippet/de_DE/messages.de-DE.json
   src/Resources/snippet/en_GB/messages.en-GB.json
   ```

2. Add translations:
   ```json
   {
     "my-plugin": {
       "general": {
         "title": "My Plugin"
       }
     }
   }
   ```

3. Use in code with autocompletion:
   ```php
   $this->trans('my-plugin.general.title')
   ```

4. **Ctrl+Click** on the key to jump to definition

## Keyboard Shortcuts

- `Ctrl+Shift+P` - Command Palette (access all commands)
- `Tab` - Expand snippet
- `F12` or `Ctrl+Click` - Go to Definition
- `Ctrl+Space` - Trigger autocomplete manually
- `Ctrl+,` - Open Settings

## Tips & Tricks

### 1. Quick Plugin Creation

Use the "Create New Plugin" wizard to scaffold a complete plugin in seconds.

### 2. Snippet Autocomplete

When writing translation keys, start typing and wait for autocomplete to show available keys from your project.

### 3. Navigate Quickly

Use `Ctrl+Click` on snippet keys to quickly jump to their definitions.

### 4. Config XML Templates

Use snippets `sw-config-element-*` to quickly add configuration fields without remembering the XML syntax.

### 5. Module Scaffolding

Use "Generate Vue Module" to create a complete admin module with list and detail pages in one go.

## Troubleshooting

### Autocompletion Not Working

1. Check if enabled in settings:
   ```json
   {
     "shopware6.enableAutocompletion": true
   }
   ```

2. Reload VSCode window: `Ctrl+Shift+P` → "Reload Window"

3. Check if you're in a Shopware project (has `composer.json` with Shopware dependencies)

### Extension Not Activating

1. Check workspace has a `composer.json` file
2. Reload window: `Ctrl+Shift+P` → "Reload Window"
3. Check VSCode version (must be 1.80.0+)

### Commands Not Appearing

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Shopware 6" - all commands should appear
3. If not, reload window

### Snippets Not Found

1. Check snippet paths in settings
2. Ensure snippet files follow the correct structure
3. Reload window to re-parse snippets

## Getting Help

- **Documentation**: See README.md
- **Development Guide**: See DEVELOPMENT.md
- **Issues**: Report on GitHub
- **Changelog**: See CHANGELOG.md for version history

## Next Steps

1. Explore all available commands in Command Palette
2. Try different snippets in various file types
3. Create a test plugin to experiment
4. Customize settings to match your workflow
5. Report any issues or suggestions on GitHub

Enjoy developing with Shopware 6! 🚀
