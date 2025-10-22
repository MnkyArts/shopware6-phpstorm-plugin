import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Get the workspace root path
 */
export function getWorkspaceRoot(): string | undefined {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    return undefined;
}

/**
 * Check if current workspace is a Shopware 6 project
 */
export async function isShopwareProject(): Promise<boolean> {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
        return false;
    }

    const composerJsonPath = path.join(workspaceRoot, 'composer.json');
    
    try {
        if (fs.existsSync(composerJsonPath)) {
            const content = fs.readFileSync(composerJsonPath, 'utf8');
            const composerJson = JSON.parse(content);
            
            // Check if shopware/core or shopware/platform is in dependencies
            const deps = { ...composerJson.require, ...composerJson['require-dev'] };
            return Object.keys(deps).some(dep => 
                dep.includes('shopware/core') || 
                dep.includes('shopware/platform') ||
                dep.includes('shopware/storefront') ||
                dep.includes('shopware/administration')
            );
        }
    } catch (error) {
        console.error('Error checking Shopware project:', error);
    }
    
    return false;
}

/**
 * Get plugin directory from configuration or default
 */
export function getPluginDirectory(): string {
    const config = vscode.workspace.getConfiguration('shopware6');
    return config.get('pluginDirectory', 'custom/plugins');
}

/**
 * Ensure directory exists, create if it doesn't
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
    const uri = vscode.Uri.file(dirPath);
    try {
        await vscode.workspace.fs.stat(uri);
    } catch {
        await vscode.workspace.fs.createDirectory(uri);
    }
}

/**
 * Convert kebab-case to PascalCase
 */
export function kebabToPascalCase(str: string): string {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

/**
 * Convert PascalCase to kebab-case
 */
export function pascalToKebabCase(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

/**
 * Convert string to snake_case
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .toLowerCase();
}

/**
 * Show error message
 */
export function showError(message: string): void {
    vscode.window.showErrorMessage(`Shopware 6: ${message}`);
}

/**
 * Show info message
 */
export function showInfo(message: string): void {
    vscode.window.showInformationMessage(`Shopware 6: ${message}`);
}

/**
 * Show success message
 */
export function showSuccess(message: string): void {
    vscode.window.showInformationMessage(`✓ Shopware 6: ${message}`);
}
