# Shopware 6 Toolbox VSCode Extension - Development Guide

## Project Structure

```
shopware6-toolbox-vscode/
├── src/
│   ├── commands/           # Command implementations for code generators
│   │   ├── createPlugin.ts
│   │   ├── generateAdminComponent.ts
│   │   ├── generateChangelog.ts
│   │   ├── generateConfig.ts
│   │   ├── generateScheduledTask.ts
│   │   └── generateVueModule.ts
│   ├── parsers/           # File parsers (snippets, components, etc.)
│   │   └── snippetParser.ts
│   ├── providers/         # VSCode providers (completion, definition, etc.)
│   │   ├── completionProvider.ts
│   │   └── definitionProvider.ts
│   ├── templates/         # Code templates for generators
│   │   ├── adminComponent.template.ts
│   │   ├── changelog.template.ts
│   │   ├── configXml.template.ts
│   │   ├── plugin.template.ts
│   │   ├── scheduledTask.template.ts
│   │   └── vueModule.template.ts
│   ├── utils/            # Utility functions
│   │   └── fileUtils.ts
│   └── extension.ts      # Main extension entry point
├── snippets/             # VSCode snippets
│   ├── javascript.json
│   ├── php.json
│   ├── twig.json
│   ├── vue.json
│   └── xml.json
├── out/                  # Compiled JavaScript (generated)
├── node_modules/         # Dependencies (generated)
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
├── README.md            # User documentation
├── CHANGELOG.md         # Version history
└── LICENSE              # MIT License
```

## Building the Extension

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Install Dependencies

```bash
cd shopware6-toolbox-vscode
npm install
```

### Compile TypeScript

```bash
npm run compile
```

This compiles all TypeScript files from `src/` to JavaScript in `out/`.

### Watch Mode (for development)

```bash
npm run watch
```

This watches for file changes and recompiles automatically.

## Testing the Extension Locally

### Method 1: Using F5 in VSCode

1. Open the `shopware6-toolbox-vscode` folder in VSCode
2. Press `F5` to launch Extension Development Host
3. A new VSCode window will open with the extension loaded
4. Test all features in this window

### Method 2: Install from VSIX

1. Package the extension:
   ```bash
   npm install -g vsce
   vsce package
   ```

2. This creates `shopware6-toolbox-0.1.0.vsix`

3. Install in VSCode:
   - Open VSCode
   - Go to Extensions (Ctrl+Shift+X)
   - Click the "..." menu → "Install from VSIX..."
   - Select the .vsix file

## Publishing to VSCode Marketplace

### Prerequisites

1. Create a Microsoft/Azure DevOps account
2. Create a Personal Access Token (PAT):
   - Go to https://dev.azure.com
   - User Settings → Personal Access Tokens
   - Create new token with "Marketplace (Publish)" scope
   - Save the token securely

### Publishing Steps

1. Install vsce:
   ```bash
   npm install -g vsce
   ```

2. Create publisher (first time only):
   ```bash
   vsce create-publisher your-publisher-name
   ```

3. Login:
   ```bash
   vsce login your-publisher-name
   ```
   Enter your PAT when prompted.

4. Update `package.json` with your publisher name:
   ```json
   {
     "publisher": "your-publisher-name"
   }
   ```

5. Publish:
   ```bash
   vsce publish
   ```

   Or publish a specific version:
   ```bash
   vsce publish 0.1.0
   ```

## Version Management

### Updating Version

Update version in `package.json` and `CHANGELOG.md`:

```json
{
  "version": "0.2.0"
}
```

### Semantic Versioning

Follow semantic versioning:
- **Patch** (0.1.1): Bug fixes
- **Minor** (0.2.0): New features, backward compatible
- **Major** (1.0.0): Breaking changes

### Publishing Updates

```bash
# Update patch version (0.1.0 → 0.1.1)
vsce publish patch

# Update minor version (0.1.0 → 0.2.0)
vsce publish minor

# Update major version (0.1.0 → 1.0.0)
vsce publish major
```

## Testing Checklist

Before publishing, test:

- [ ] All 6 commands work correctly
- [ ] Snippets expand properly in all languages
- [ ] Snippet autocompletion shows in PHP
- [ ] Snippet autocompletion shows in Twig
- [ ] Snippet autocompletion shows in JavaScript/Vue
- [ ] Twig function autocompletion works
- [ ] Repository autocompletion works
- [ ] Go to Definition works for snippets
- [ ] Extension activates in Shopware 6 projects
- [ ] No console errors
- [ ] README is accurate
- [ ] CHANGELOG is updated

## Common Development Tasks

### Adding a New Command

1. Create command file in `src/commands/myCommand.ts`
2. Implement the command function
3. Register in `src/extension.ts`:
   ```typescript
   import { myCommand } from './commands/myCommand';
   
   const commands = [
     // ...
     vscode.commands.registerCommand('shopware6.myCommand', myCommand)
   ];
   ```
4. Add to `package.json`:
   ```json
   {
     "contributes": {
       "commands": [
         {
           "command": "shopware6.myCommand",
           "title": "Shopware 6: My Command"
         }
       ]
     }
   }
   ```

### Adding a New Snippet

1. Add to appropriate file in `snippets/`:
   ```json
   {
     "My Snippet": {
       "prefix": "sw-my-snippet",
       "body": [
         "// Your code here",
         "${1:placeholder}"
       ],
       "description": "Description of snippet"
     }
   }
   ```

2. Test by typing the prefix in a file of that language

### Adding Autocompletion

1. Create or extend a provider in `src/providers/`
2. Implement `provideCompletionItems` method
3. Register in `src/extension.ts`:
   ```typescript
   context.subscriptions.push(
     vscode.languages.registerCompletionItemProvider(
       'language-id',
       new MyCompletionProvider(),
       ...triggerCharacters
     )
   );
   ```

## Debugging

### Enable Extension Logs

In the Extension Development Host window:
- Open Developer Tools (Help → Toggle Developer Tools)
- Check Console for logs from `console.log()`

### Debugging TypeScript

1. Set breakpoints in TypeScript files
2. Press F5 to launch debugger
3. Breakpoints will hit in the Extension Development Host

## File Watchers

The extension automatically watches for changes to:
- Snippet files (`**/snippet/**/*.json`)

When these files change, the extension reloads them automatically.

## Performance Considerations

- Snippet parsing happens on activation
- File watchers use VSCode's built-in system
- Completion providers run on-demand
- No heavy background processing

## Troubleshooting

### Extension Not Activating

Check activation events in `package.json`:
```json
{
  "activationEvents": [
    "workspaceContains:**/composer.json",
    "onLanguage:php"
  ]
}
```

### Autocompletion Not Working

1. Check if configuration is enabled:
   ```json
   {
     "shopware6.enableAutocompletion": true
   }
   ```

2. Check console for errors

3. Verify trigger characters are correct

### Commands Not Appearing

1. Reload window (Ctrl+Shift+P → "Reload Window")
2. Check package.json for command registration
3. Verify command is registered in extension.ts

## Additional Resources

- [VSCode Extension API](https://code.visualstudio.com/api)
- [Extension Marketplace](https://marketplace.visualstudio.com/)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
