import * as vscode from 'vscode';
import * as path from 'path';
import { 
    getWorkspaceRoot, 
    getPluginDirectory,
    ensureDirectoryExists, 
    showError, 
    showSuccess 
} from '../utils/fileUtils';
import { 
    getPluginBaseClassTemplate, 
    getComposerJsonTemplate,
    getServicesXmlTemplate,
    PluginMetadata 
} from '../templates/plugin.template';
import { getConfigXmlTemplate } from '../templates/configXml.template';

export async function createPlugin(): Promise<void> {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
        showError('No workspace folder open');
        return;
    }

    // Collect plugin metadata through a series of input prompts
    const pluginName = await vscode.window.showInputBox({
        prompt: 'Enter plugin name (e.g., MyAwesomePlugin)',
        placeHolder: 'MyAwesomePlugin',
        validateInput: (value) => {
            if (!value) {
                return 'Plugin name is required';
            }
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
                return 'Plugin name must start with uppercase letter and contain only alphanumeric characters';
            }
            return null;
        }
    });

    if (!pluginName) {
        return;
    }

    const author = await vscode.window.showInputBox({
        prompt: 'Enter author name',
        placeHolder: 'YourName',
        validateInput: (value) => {
            if (!value) {
                return 'Author name is required';
            }
            return null;
        }
    });

    if (!author) {
        return;
    }

    const description = await vscode.window.showInputBox({
        prompt: 'Enter plugin description',
        placeHolder: 'A great Shopware 6 plugin'
    });

    if (!description) {
        return;
    }

    const namespace = await vscode.window.showInputBox({
        prompt: 'Enter plugin namespace',
        placeHolder: `${author}\\${pluginName}`,
        value: `${author}\\${pluginName}`,
        validateInput: (value) => {
            if (!value) {
                return 'Namespace is required';
            }
            return null;
        }
    });

    if (!namespace) {
        return;
    }

    const licenseOptions = [
        { label: 'MIT', value: 'MIT' },
        { label: 'GPL-3.0', value: 'GPL-3.0' },
        { label: 'Apache-2.0', value: 'Apache-2.0' },
        { label: 'BSD-3-Clause', value: 'BSD-3-Clause' },
        { label: 'Proprietary', value: 'proprietary' }
    ];

    const selectedLicense = await vscode.window.showQuickPick(licenseOptions, {
        placeHolder: 'Select license'
    });

    if (!selectedLicense) {
        return;
    }

    const version = await vscode.window.showInputBox({
        prompt: 'Enter initial version',
        placeHolder: '1.0.0',
        value: '1.0.0'
    });

    if (!version) {
        return;
    }

    const metadata: PluginMetadata = {
        name: pluginName,
        namespace: namespace,
        description: description,
        author: author,
        license: selectedLicense.value,
        version: version
    };

    // Determine plugin directory
    const defaultPluginDir = getPluginDirectory();
    const pluginBaseDir = await vscode.window.showInputBox({
        prompt: 'Enter plugin directory',
        placeHolder: defaultPluginDir,
        value: defaultPluginDir
    });

    if (!pluginBaseDir) {
        return;
    }

    const pluginPath = path.join(workspaceRoot, pluginBaseDir, pluginName);

    try {
        // Check if plugin directory already exists
        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(pluginPath));
            showError(`Plugin directory already exists: ${pluginPath}`);
            return;
        } catch {
            // Directory doesn't exist, proceed
        }

        // Create plugin structure
        await ensureDirectoryExists(pluginPath);
        await ensureDirectoryExists(path.join(pluginPath, 'src'));
        await ensureDirectoryExists(path.join(pluginPath, 'src', 'Resources'));
        await ensureDirectoryExists(path.join(pluginPath, 'src', 'Resources', 'config'));

        // Create plugin base class
        const pluginClassContent = getPluginBaseClassTemplate(metadata);
        const pluginClassPath = path.join(pluginPath, 'src', `${pluginName}.php`);
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(pluginClassPath),
            Buffer.from(pluginClassContent, 'utf8')
        );

        // Create composer.json
        const composerContent = getComposerJsonTemplate(metadata);
        const composerPath = path.join(pluginPath, 'composer.json');
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(composerPath),
            Buffer.from(composerContent, 'utf8')
        );

        // Create services.xml
        const servicesContent = getServicesXmlTemplate(metadata);
        const servicesPath = path.join(pluginPath, 'src', 'Resources', 'config', 'services.xml');
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(servicesPath),
            Buffer.from(servicesContent, 'utf8')
        );

        // Create config.xml
        const configContent = getConfigXmlTemplate(pluginName);
        const configPath = path.join(pluginPath, 'src', 'Resources', 'config', 'config.xml');
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(configPath),
            Buffer.from(configContent, 'utf8')
        );

        // Create README.md
        const readmeContent = `# ${pluginName}\n\n${description}\n\n## Installation\n\n1. Clone this repository into your Shopware plugin directory\n2. Run \`bin/console plugin:refresh\`\n3. Install and activate the plugin: \`bin/console plugin:install --activate ${pluginName}\`\n\n## License\n\n${selectedLicense.value}\n`;
        const readmePath = path.join(pluginPath, 'README.md');
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(readmePath),
            Buffer.from(readmeContent, 'utf8')
        );

        // Open composer.json
        const document = await vscode.workspace.openTextDocument(composerPath);
        await vscode.window.showTextDocument(document);

        showSuccess(`Plugin "${pluginName}" created successfully at ${pluginPath}!`);
        
        // Show next steps
        vscode.window.showInformationMessage(
            `Next steps:\n1. Run "bin/console plugin:refresh"\n2. Run "bin/console plugin:install --activate ${pluginName}"`,
            'OK'
        );
    } catch (error) {
        showError(`Failed to create plugin: ${error}`);
    }
}
