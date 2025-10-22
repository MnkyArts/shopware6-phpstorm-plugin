import * as vscode from 'vscode';

/**
 * Provides completion for system configuration keys
 * Matches SystemConfigUtil from JetBrains plugin
 */
export class SystemConfigCompletionProvider implements vscode.CompletionItemProvider {
    private configCache: Map<string, { namespace: string; name: string; label?: string }> = new Map();

    constructor() {
        this.indexSystemConfigs();
    }

    private async indexSystemConfigs(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return;
        }

        // Find config.xml files
        const configFiles = await vscode.workspace.findFiles(
            '**/Resources/config/config.xml',
            '**/node_modules/**'
        );

        for (const file of configFiles) {
            await this.parseConfigFile(file);
        }
    }

    private async parseConfigFile(file: vscode.Uri): Promise<void> {
        try {
            const content = await vscode.workspace.fs.readFile(file);
            const text = Buffer.from(content).toString('utf8');

            // Parse XML for card elements with their inputs
            const cardRegex = /<card>[\s\S]*?<\/card>/g;
            let cardMatch;

            while ((cardMatch = cardRegex.exec(text)) !== null) {
                const cardContent = cardMatch[0];
                
                // Extract namespace from card
                const titleMatch = cardContent.match(/<title>([^<]+)<\/title>/);
                const title = titleMatch ? titleMatch[1] : '';

                // Extract all input elements
                const inputRegex = /<input-field[^>]*name="([^"]+)"[^>]*>[\s\S]*?(?:<label(?:[^>]*)>([^<]*)<\/label>)?[\s\S]*?<\/input-field>/g;
                let inputMatch;

                while ((inputMatch = inputRegex.exec(cardContent)) !== null) {
                    const configName = inputMatch[1];
                    const label = inputMatch[2] || '';

                    // Parse namespace from title or use filename
                    const namespace = title.replace(/\s+/g, '') || 'Config';
                    const fullKey = `${namespace}.config.${configName}`;

                    this.configCache.set(fullKey, {
                        namespace: namespace,
                        name: configName,
                        label: label
                    });
                }
            }
        } catch (error) {
            console.error(`Error parsing config file ${file.fsPath}:`, error);
        }
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);

        // Check for SystemConfigService patterns
        const isPhpConfig = /SystemConfigService::(?:get|getDomain)\(['"]/.test(linePrefix);
        const isTwigConfig = /config\(['"]/.test(linePrefix) && document.languageId === 'twig';

        if (!isPhpConfig && !isTwigConfig) {
            return [];
        }

        const items: vscode.CompletionItem[] = [];

        for (const [key, config] of this.configCache) {
            const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Value);
            item.detail = config.label || `${config.namespace}.${config.name}`;
            item.documentation = new vscode.MarkdownString(
                `**System Config**\n\nNamespace: ${config.namespace}\nName: ${config.name}`
            );
            item.insertText = key;
            items.push(item);
        }

        return items;
    }

    refresh(): void {
        this.configCache.clear();
        this.indexSystemConfigs();
    }
}

/**
 * Provides completion for theme configuration keys
 * Matches ThemeConfigUtil from JetBrains plugin
 */
export class ThemeConfigCompletionProvider implements vscode.CompletionItemProvider {
    private themeConfigCache: Map<string, { name: string; label?: string; value?: string }> = new Map();

    constructor() {
        this.indexThemeConfigs();
    }

    private async indexThemeConfigs(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return;
        }

        // Find theme.json files
        const themeFiles = await vscode.workspace.findFiles(
            '**/src/Resources/theme.json',
            '**/node_modules/**'
        );

        for (const file of themeFiles) {
            await this.parseThemeFile(file);
        }
    }

    private async parseThemeFile(file: vscode.Uri): Promise<void> {
        try {
            const content = await vscode.workspace.fs.readFile(file);
            const text = Buffer.from(content).toString('utf8');
            const themeConfig = JSON.parse(text);

            if (themeConfig.config) {
                for (const [key, value] of Object.entries(themeConfig.config)) {
                    const config = value as any;
                    this.themeConfigCache.set(key, {
                        name: key,
                        label: config.label || key,
                        value: config.value
                    });
                }
            }
        } catch (error) {
            console.error(`Error parsing theme file ${file.fsPath}:`, error);
        }
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);

        // Check for theme_config pattern in Twig
        if (!/theme_config\(['"]/.test(linePrefix) || document.languageId !== 'twig') {
            return [];
        }

        const items: vscode.CompletionItem[] = [];

        for (const [key, config] of this.themeConfigCache) {
            const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Value);
            item.detail = config.label || key;
            const docValue = config.value ? `Default: ${JSON.stringify(config.value)}` : '';
            item.documentation = new vscode.MarkdownString(
                `**Theme Config**\n\n${config.label}\n\n${docValue}`
            );
            item.insertText = key;
            items.push(item);
        }

        return items;
    }

    refresh(): void {
        this.themeConfigCache.clear();
        this.indexThemeConfigs();
    }
}

/**
 * Provides completion for admin mixins
 * Matches AdminMixinUtil from JetBrains plugin
 */
export class AdminMixinCompletionProvider implements vscode.CompletionItemProvider {
    private mixinCache: Map<string, { name: string; file: string }> = new Map();

    constructor() {
        this.indexMixins();
    }

    private async indexMixins(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return;
        }

        // Find mixin JavaScript files in admin
        const mixinFiles = await vscode.workspace.findFiles(
            '**/src/Resources/app/administration/src/**/*mixin*.js',
            '**/node_modules/**'
        );

        for (const file of mixinFiles) {
            await this.parseMixinFile(file);
        }
    }

    private async parseMixinFile(file: vscode.Uri): Promise<void> {
        try {
            const content = await vscode.workspace.fs.readFile(file);
            const text = Buffer.from(content).toString('utf8');

            // Match Mixin.register calls
            const mixinRegex = /Mixin\.register\(['"]([^'"]+)['"]/g;
            let match;

            while ((match = mixinRegex.exec(text)) !== null) {
                const mixinName = match[1];
                this.mixinCache.set(mixinName, {
                    name: mixinName,
                    file: file.fsPath
                });
            }
        } catch (error) {
            console.error(`Error parsing mixin file ${file.fsPath}:`, error);
        }
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);

        // Check for Mixin.getByName pattern
        if (!/Mixin\.getByName\(['"]/.test(linePrefix)) {
            return [];
        }

        const items: vscode.CompletionItem[] = [];

        for (const [name, mixin] of this.mixinCache) {
            const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Module);
            item.detail = 'Admin Mixin';
            item.documentation = new vscode.MarkdownString(`**Mixin:** ${name}\n\n**File:** ${mixin.file}`);
            item.insertText = name;
            items.push(item);
        }

        return items;
    }

    refresh(): void {
        this.mixinCache.clear();
        this.indexMixins();
    }
}