import * as vscode from 'vscode';
import { generateAdminComponent } from './commands/generateAdminComponent';
import { generateConfig } from './commands/generateConfig';
import { generateScheduledTask } from './commands/generateScheduledTask';
import { generateChangelog } from './commands/generateChangelog';
import { createPlugin } from './commands/createPlugin';
import { generateVueModule } from './commands/generateVueModule';
import { SnippetParser } from './parsers/snippetParser';
import { 
    SnippetCompletionProvider, 
    TwigFunctionCompletionProvider,
    RepositoryCompletionProvider 
} from './providers/completionProvider';
import { SnippetDefinitionProvider } from './providers/definitionProvider';
import { getWorkspaceRoot } from './utils/fileUtils';

let snippetParser: SnippetParser | undefined;

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

    // Initialize snippet parser if in a workspace
    const workspaceRoot = getWorkspaceRoot();
    if (workspaceRoot) {
        snippetParser = new SnippetParser(workspaceRoot);
        
        // Parse snippets on activation
        snippetParser.parse().catch(err => {
            console.error('Error parsing snippets:', err);
        });

        // Re-parse when snippet files change
        const snippetWatcher = vscode.workspace.createFileSystemWatcher('**/snippet/**/*.json');
        snippetWatcher.onDidChange(() => snippetParser?.parse());
        snippetWatcher.onDidCreate(() => snippetParser?.parse());
        snippetWatcher.onDidDelete(() => snippetParser?.parse());
        context.subscriptions.push(snippetWatcher);

        // Register completion providers
        const config = vscode.workspace.getConfiguration('shopware6');
        if (config.get('enableAutocompletion', true)) {
            // Snippet completion for PHP, Twig, JavaScript, Vue
            const snippetCompletion = new SnippetCompletionProvider(snippetParser);
            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider('php', snippetCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('twig', snippetCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('javascript', snippetCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('vue', snippetCompletion, "'", '"')
            );

            // Twig function completion
            const twigFunctionCompletion = new TwigFunctionCompletionProvider();
            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider('twig', twigFunctionCompletion)
            );

            // Repository completion for JavaScript/Vue
            const repositoryCompletion = new RepositoryCompletionProvider();
            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider('javascript', repositoryCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('vue', repositoryCompletion, "'", '"')
            );

            // Definition providers for snippets
            const snippetDefinition = new SnippetDefinitionProvider(snippetParser);
            context.subscriptions.push(
                vscode.languages.registerDefinitionProvider('php', snippetDefinition),
                vscode.languages.registerDefinitionProvider('twig', snippetDefinition),
                vscode.languages.registerDefinitionProvider('javascript', snippetDefinition),
                vscode.languages.registerDefinitionProvider('vue', snippetDefinition)
            );
        }
    }

    console.log('Shopware 6 Toolbox: All features registered');
}

export function deactivate() {
    console.log('Shopware 6 Toolbox is now deactivated!');
}
