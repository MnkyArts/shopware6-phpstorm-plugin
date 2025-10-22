import * as vscode from 'vscode';
import * as path from 'path';
import { 
    getWorkspaceRoot, 
    ensureDirectoryExists, 
    showError, 
    showSuccess,
    pascalToKebabCase 
} from '../utils/fileUtils';
import { 
    getAdminComponentIndexTemplate, 
    getAdminComponentTwigTemplate 
} from '../templates/adminComponent.template';

export async function generateAdminComponent(): Promise<void> {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
        showError('No workspace folder open');
        return;
    }

    // Ask for component name
    const componentName = await vscode.window.showInputBox({
        prompt: 'Enter component name (e.g., sw-my-component)',
        placeHolder: 'sw-my-component',
        validateInput: (value) => {
            if (!value) {
                return 'Component name is required';
            }
            if (!value.startsWith('sw-')) {
                return 'Component name should start with "sw-"';
            }
            return null;
        }
    });

    if (!componentName) {
        return;
    }

    // Ask for location
    const locationOptions = [
        { label: 'Administration', value: 'administration' },
        { label: 'Storefront', value: 'storefront' },
        { label: 'Custom Path', value: 'custom' }
    ];

    const location = await vscode.window.showQuickPick(locationOptions, {
        placeHolder: 'Select component location'
    });

    if (!location) {
        return;
    }

    let componentPath: string;

    if (location.value === 'custom') {
        const customPath = await vscode.window.showInputBox({
            prompt: 'Enter custom path relative to workspace root',
            placeHolder: 'src/Resources/app/administration/src/component'
        });

        if (!customPath) {
            return;
        }
        componentPath = path.join(workspaceRoot, customPath, componentName);
    } else {
        componentPath = path.join(
            workspaceRoot,
            'src',
            'Resources',
            'app',
            location.value,
            'src',
            'component',
            componentName
        );
    }

    try {
        // Create component directory
        await ensureDirectoryExists(componentPath);

        // Create index.js
        const indexContent = getAdminComponentIndexTemplate(componentName);
        const indexPath = path.join(componentPath, 'index.js');
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(indexPath),
            Buffer.from(indexContent, 'utf8')
        );

        // Create template file
        const templateContent = getAdminComponentTwigTemplate(componentName);
        const templatePath = path.join(componentPath, `${componentName}.html.twig`);
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(templatePath),
            Buffer.from(templateContent, 'utf8')
        );

        // Open the files
        const indexDocument = await vscode.workspace.openTextDocument(indexPath);
        await vscode.window.showTextDocument(indexDocument);

        showSuccess(`Component "${componentName}" created successfully!`);
    } catch (error) {
        showError(`Failed to create component: ${error}`);
    }
}
