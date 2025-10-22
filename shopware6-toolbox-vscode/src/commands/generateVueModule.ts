import * as vscode from 'vscode';
import * as path from 'path';
import { 
    getWorkspaceRoot, 
    ensureDirectoryExists, 
    showError, 
    showSuccess 
} from '../utils/fileUtils';
import {
    getVueModuleIndexTemplate,
    getVueModuleListPageTemplate,
    getVueModuleListPageTwigTemplate,
    getVueModuleDetailPageTemplate,
    getVueModuleDetailPageTwigTemplate
} from '../templates/vueModule.template';

export async function generateVueModule(): Promise<void> {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
        showError('No workspace folder open');
        return;
    }

    // Ask for module name
    const moduleName = await vscode.window.showInputBox({
        prompt: 'Enter module name (e.g., my-module)',
        placeHolder: 'my-module',
        validateInput: (value) => {
            if (!value) {
                return 'Module name is required';
            }
            if (!/^[a-z][a-z0-9-]*$/.test(value)) {
                return 'Module name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens';
            }
            return null;
        }
    });

    if (!moduleName) {
        return;
    }

    // Ask for base path
    const basePath = await vscode.window.showInputBox({
        prompt: 'Enter base path for the module',
        placeHolder: 'src/Resources/app/administration/src/module',
        value: 'src/Resources/app/administration/src/module'
    });

    if (!basePath) {
        return;
    }

    const modulePath = path.join(workspaceRoot, basePath, moduleName);

    try {
        // Create module structure
        await ensureDirectoryExists(modulePath);
        await ensureDirectoryExists(path.join(modulePath, 'page', `${moduleName}-list`));
        await ensureDirectoryExists(path.join(modulePath, 'page', `${moduleName}-detail`));

        // Create main index.js
        const indexContent = getVueModuleIndexTemplate(moduleName);
        const indexPath = path.join(modulePath, 'index.js');
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(indexPath),
            Buffer.from(indexContent, 'utf8')
        );

        // Create list page index.js
        const listIndexContent = getVueModuleListPageTemplate(moduleName);
        const listIndexPath = path.join(modulePath, 'page', `${moduleName}-list`, 'index.js');
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(listIndexPath),
            Buffer.from(listIndexContent, 'utf8')
        );

        // Create list page template
        const listTemplateContent = getVueModuleListPageTwigTemplate(moduleName);
        const listTemplatePath = path.join(modulePath, 'page', `${moduleName}-list`, `${moduleName}-list.html.twig`);
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(listTemplatePath),
            Buffer.from(listTemplateContent, 'utf8')
        );

        // Create detail page index.js
        const detailIndexContent = getVueModuleDetailPageTemplate(moduleName);
        const detailIndexPath = path.join(modulePath, 'page', `${moduleName}-detail`, 'index.js');
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(detailIndexPath),
            Buffer.from(detailIndexContent, 'utf8')
        );

        // Create detail page template
        const detailTemplateContent = getVueModuleDetailPageTwigTemplate(moduleName);
        const detailTemplatePath = path.join(modulePath, 'page', `${moduleName}-detail`, `${moduleName}-detail.html.twig`);
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(detailTemplatePath),
            Buffer.from(detailTemplateContent, 'utf8')
        );

        // Open the main index.js
        const document = await vscode.workspace.openTextDocument(indexPath);
        await vscode.window.showTextDocument(document);

        showSuccess(`Vue module "${moduleName}" created successfully!`);
    } catch (error) {
        showError(`Failed to create Vue module: ${error}`);
    }
}
