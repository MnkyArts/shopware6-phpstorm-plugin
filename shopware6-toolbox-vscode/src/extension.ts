import * as vscode from 'vscode';
import { generateAdminComponent } from './commands/generateAdminComponent';
import { generateConfig } from './commands/generateConfig';
import { generateScheduledTask } from './commands/generateScheduledTask';
import { generateChangelog } from './commands/generateChangelog';
import { createPlugin } from './commands/createPlugin';
import { generateVueModule } from './commands/generateVueModule';
import { SnippetParser } from './parsers/snippetParser';
import { AdminComponentParser } from './parsers/adminComponentParser';
import { 
    SnippetCompletionProvider, 
    TwigFunctionCompletionProvider,
    RepositoryCompletionProvider,
    FeatureFlagCompletionProvider
} from './providers/completionProvider';
import { 
    SystemConfigCompletionProvider,
    ThemeConfigCompletionProvider,
    AdminMixinCompletionProvider
} from './providers/advancedCompletionProvider';
import { SnippetDefinitionProvider } from './providers/definitionProvider';
import { 
    AdminComponentDefinitionProvider,
    AdminComponentCompletionProvider 
} from './providers/adminComponentProvider';
import { TwigBlockCodeLensProvider, registerShowBlockInfoCommand } from './providers/codeLensProvider';
import { registerDiagnostics } from './providers/diagnosticProvider';
import { getWorkspaceRoot } from './utils/fileUtils';

let snippetParser: SnippetParser | undefined;
let adminComponentParser: AdminComponentParser | undefined;

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
        adminComponentParser = new AdminComponentParser(workspaceRoot);
        
        // Parse snippets on activation
        snippetParser.parse().catch(err => {
            console.error('Error parsing snippets:', err);
        });

        // Parse admin components on activation
        adminComponentParser.parse().catch(err => {
            console.error('Error parsing admin components:', err);
        });

        // Re-parse when snippet files change
        const snippetWatcher = vscode.workspace.createFileSystemWatcher('**/snippet/**/*.json');
        snippetWatcher.onDidChange(() => snippetParser?.parse());
        snippetWatcher.onDidCreate(() => snippetParser?.parse());
        snippetWatcher.onDidDelete(() => snippetParser?.parse());
        context.subscriptions.push(snippetWatcher);

        // Re-parse when admin component files change
        const componentWatcher = vscode.workspace.createFileSystemWatcher('**/src/Resources/app/administration/src/**/*.js');
        componentWatcher.onDidChange(() => adminComponentParser?.parse());
        componentWatcher.onDidCreate(() => adminComponentParser?.parse());
        componentWatcher.onDidDelete(() => adminComponentParser?.parse());
        context.subscriptions.push(componentWatcher);

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

            // Feature flag completion for PHP, JavaScript, Vue, Twig
            const featureFlagCompletion = new FeatureFlagCompletionProvider();
            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider('php', featureFlagCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('javascript', featureFlagCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('vue', featureFlagCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('twig', featureFlagCompletion, "'", '"')
            );

            // Admin component completion for JavaScript/Vue
            const adminComponentCompletion = new AdminComponentCompletionProvider(adminComponentParser);
            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider('javascript', adminComponentCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('vue', adminComponentCompletion, "'", '"')
            );

            // SystemConfig completion for PHP and Twig
            const systemConfigCompletion = new SystemConfigCompletionProvider();
            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider('php', systemConfigCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('twig', systemConfigCompletion, "'", '"')
            );

            // ThemeConfig completion for Twig
            const themeConfigCompletion = new ThemeConfigCompletionProvider();
            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider('twig', themeConfigCompletion, "'", '"')
            );

            // AdminMixin completion for JavaScript/Vue
            const adminMixinCompletion = new AdminMixinCompletionProvider();
            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider('javascript', adminMixinCompletion, "'", '"'),
                vscode.languages.registerCompletionItemProvider('vue', adminMixinCompletion, "'", '"')
            );

            // Definition providers for snippets
            const snippetDefinition = new SnippetDefinitionProvider(snippetParser);
            context.subscriptions.push(
                vscode.languages.registerDefinitionProvider('php', snippetDefinition),
                vscode.languages.registerDefinitionProvider('twig', snippetDefinition),
                vscode.languages.registerDefinitionProvider('javascript', snippetDefinition),
                vscode.languages.registerDefinitionProvider('vue', snippetDefinition)
            );

            // Definition providers for admin components
            const adminComponentDefinition = new AdminComponentDefinitionProvider(adminComponentParser);
            context.subscriptions.push(
                vscode.languages.registerDefinitionProvider('javascript', adminComponentDefinition),
                vscode.languages.registerDefinitionProvider('vue', adminComponentDefinition)
            );
        }

        // Register CodeLens provider for Twig block versioning
        const twigBlockCodeLens = new TwigBlockCodeLensProvider();
        context.subscriptions.push(
            vscode.languages.registerCodeLensProvider('twig', twigBlockCodeLens)
        );
        registerShowBlockInfoCommand(context);

        // Register diagnostics provider
        if (config.get('enableDiagnostics', true)) {
            registerDiagnostics(context);
        }
    }

    console.log('Shopware 6 Toolbox: All features registered');
}

export function deactivate() {
    console.log('Shopware 6 Toolbox is now deactivated!');
}
