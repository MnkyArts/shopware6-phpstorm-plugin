import * as vscode from 'vscode';
import * as path from 'path';
import { 
    getWorkspaceRoot, 
    ensureDirectoryExists, 
    showError, 
    showSuccess 
} from '../utils/fileUtils';
import { getConfigXmlTemplate } from '../templates/configXml.template';

export async function generateConfig(): Promise<void> {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
        showError('No workspace folder open');
        return;
    }

    // Ask for plugin name or use current folder
    const pluginName = await vscode.window.showInputBox({
        prompt: 'Enter plugin name (or leave empty to use current folder)',
        placeHolder: 'MyPlugin'
    });

    // Determine config path
    let configPath: string;

    if (pluginName) {
        const pluginDir = await vscode.window.showInputBox({
            prompt: 'Enter plugin directory path',
            placeHolder: 'custom/plugins/MyPlugin',
            value: `custom/plugins/${pluginName}`
        });

        if (!pluginDir) {
            return;
        }

        configPath = path.join(workspaceRoot, pluginDir, 'src', 'Resources', 'config');
    } else {
        // Try to detect current plugin structure
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const currentFile = activeEditor.document.uri.fsPath;
            const relativePath = path.relative(workspaceRoot, currentFile);
            const pathParts = relativePath.split(path.sep);
            
            // Try to find the plugin root
            let pluginRoot = '';
            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i] === 'plugins' && i + 1 < pathParts.length) {
                    pluginRoot = pathParts.slice(0, i + 2).join(path.sep);
                    break;
                }
            }

            if (pluginRoot) {
                configPath = path.join(workspaceRoot, pluginRoot, 'src', 'Resources', 'config');
            } else {
                configPath = path.join(workspaceRoot, 'src', 'Resources', 'config');
            }
        } else {
            configPath = path.join(workspaceRoot, 'src', 'Resources', 'config');
        }
    }

    try {
        // Create config directory
        await ensureDirectoryExists(configPath);

        // Create config.xml
        const configContent = getConfigXmlTemplate(pluginName || 'Plugin');
        const configFilePath = path.join(configPath, 'config.xml');
        
        // Check if file already exists
        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(configFilePath));
            const overwrite = await vscode.window.showWarningMessage(
                'config.xml already exists. Overwrite?',
                'Yes',
                'No'
            );
            if (overwrite !== 'Yes') {
                return;
            }
        } catch {
            // File doesn't exist, proceed
        }

        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(configFilePath),
            Buffer.from(configContent, 'utf8')
        );

        // Open the file
        const document = await vscode.workspace.openTextDocument(configFilePath);
        await vscode.window.showTextDocument(document);

        showSuccess('config.xml created successfully!');
    } catch (error) {
        showError(`Failed to create config.xml: ${error}`);
    }
}
