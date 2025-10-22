import * as vscode from 'vscode';
import { generateAdminComponent } from './commands/generateAdminComponent';
import { generateConfig } from './commands/generateConfig';
import { generateScheduledTask } from './commands/generateScheduledTask';
import { generateChangelog } from './commands/generateChangelog';
import { createPlugin } from './commands/createPlugin';
import { generateVueModule } from './commands/generateVueModule';

export function activate(context: vscode.ExtensionContext) {
    console.log('Shopware 6 Toolbox is now active!');

    // Register commands
    const commands = [
        vscode.commands.registerCommand('shopware6.generateAdminComponent', generateAdminComponent),
        vscode.commands.registerCommand('shopware6.generateConfig', generateConfig),
        vscode.commands.registerCommand('shopware6.generateVueModule', generateVueModule),
        vscode.commands.registerCommand('shopware6.generateScheduledTask', generateScheduledTask),
        vscode.commands.registerCommand('shopware6.generateChangelog', generateChangelog),
        vscode.commands.registerCommand('shopware6.createPlugin', createPlugin)
    ];

    commands.forEach(command => context.subscriptions.push(command));

    // Register providers here (Phase 4)
    // registerProviders(context);

    console.log('Shopware 6 Toolbox: All commands registered');
}

export function deactivate() {
    console.log('Shopware 6 Toolbox is now deactivated!');
}
