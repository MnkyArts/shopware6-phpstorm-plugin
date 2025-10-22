import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Shopware 6 Toolbox is now active!');

    // Register commands here
    // registerCommands(context);

    // Register providers here
    // registerProviders(context);

    vscode.window.showInformationMessage('Shopware 6 Toolbox activated!');
}

export function deactivate() {
    console.log('Shopware 6 Toolbox is now deactivated!');
}
