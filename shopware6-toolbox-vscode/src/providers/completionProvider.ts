import * as vscode from 'vscode';
import { SnippetParser } from '../parsers/snippetParser';

export class SnippetCompletionProvider implements vscode.CompletionItemProvider {
    private snippetParser: SnippetParser;

    constructor(snippetParser: SnippetParser) {
        this.snippetParser = snippetParser;
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // Check different contexts
        if (this.shouldProvideCompletion(linePrefix, document.languageId)) {
            return this.getSnippetCompletions();
        }

        return [];
    }

    private shouldProvideCompletion(linePrefix: string, languageId: string): boolean {
        // PHP: $this->trans('...') or $this->translator->trans('...')
        if (languageId === 'php') {
            return /->trans\(['"]/.test(linePrefix);
        }

        // Twig: {{ '...'|trans }} or {% trans %}...{% endtrans %}
        if (languageId === 'twig') {
            return /['"].*\|trans/.test(linePrefix) || /\{%\s*trans/.test(linePrefix);
        }

        // JavaScript/Vue: $tc('...') or $t('...')
        if (languageId === 'javascript' || languageId === 'vue') {
            return /\$t[c]?\(['"]/.test(linePrefix);
        }

        return false;
    }

    private getSnippetCompletions(): vscode.CompletionItem[] {
        const snippets = this.snippetParser.getSnippets();
        
        return snippets.map(snippet => {
            const item = new vscode.CompletionItem(snippet.key, vscode.CompletionItemKind.Value);
            
            // Get first available translation for documentation
            const translation = Array.from(snippet.translations.values())[0] || '';
            item.documentation = new vscode.MarkdownString(
                `**Translation:** ${translation}\n\n**File:** ${snippet.file}`
            );
            
            item.detail = translation.substring(0, 100);
            item.insertText = snippet.key;
            
            return item;
        });
    }
}

export class TwigFunctionCompletionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // Check if we're in a Twig expression
        if (!this.isInTwigContext(linePrefix)) {
            return [];
        }

        const completionItems: vscode.CompletionItem[] = [];

        // theme_config
        const themeConfigItem = new vscode.CompletionItem('theme_config', vscode.CompletionItemKind.Function);
        themeConfigItem.insertText = new vscode.SnippetString('theme_config(\'${1:key}\')');
        themeConfigItem.documentation = 'Get theme configuration value';
        completionItems.push(themeConfigItem);

        // config
        const configItem = new vscode.CompletionItem('config', vscode.CompletionItemKind.Function);
        configItem.insertText = new vscode.SnippetString('config(\'${1:key}\')');
        configItem.documentation = 'Get system configuration value';
        completionItems.push(configItem);

        // seoUrl
        const seoUrlItem = new vscode.CompletionItem('seoUrl', vscode.CompletionItemKind.Function);
        seoUrlItem.insertText = new vscode.SnippetString('seoUrl(\'${1:route}\', ${2:params})');
        seoUrlItem.documentation = 'Generate SEO-friendly URL';
        completionItems.push(seoUrlItem);

        // sw_include
        const swIncludeItem = new vscode.CompletionItem('sw_include', vscode.CompletionItemKind.Function);
        swIncludeItem.insertText = new vscode.SnippetString('sw_include \'${1:template.html.twig}\'');
        swIncludeItem.documentation = 'Include a Shopware template';
        completionItems.push(swIncludeItem);

        // sw_extends
        const swExtendsItem = new vscode.CompletionItem('sw_extends', vscode.CompletionItemKind.Function);
        swExtendsItem.insertText = new vscode.SnippetString('sw_extends \'${1:@Storefront/storefront/base.html.twig}\'');
        swExtendsItem.documentation = 'Extend a Shopware template';
        completionItems.push(swExtendsItem);

        return completionItems;
    }

    private isInTwigContext(linePrefix: string): boolean {
        return /\{\{|\{%/.test(linePrefix);
    }
}

export class RepositoryCompletionProvider implements vscode.CompletionItemProvider {
    private entities = [
        'product', 'category', 'customer', 'order', 'order_line_item',
        'sales_channel', 'shipping_method', 'payment_method', 'country',
        'currency', 'language', 'tax', 'rule', 'property_group',
        'property_group_option', 'media', 'cms_page', 'cms_section',
        'cms_block', 'promotion', 'product_stream', 'customer_group',
        'manufacturer', 'delivery_time', 'unit'
    ];

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // Check if we're in repositoryFactory.create context
        if (!/repositoryFactory\.create\(['"]/.test(linePrefix)) {
            return [];
        }

        return this.entities.map(entity => {
            const item = new vscode.CompletionItem(entity, vscode.CompletionItemKind.Value);
            item.detail = `Entity: ${entity}`;
            item.insertText = entity;
            return item;
        });
    }
}

export class FeatureFlagCompletionProvider implements vscode.CompletionItemProvider {
    private featureFlags = [
        'FEATURE_NEXT_1797',
        'FEATURE_NEXT_6040',
        'FEATURE_NEXT_10549',
        'FEATURE_NEXT_10555',
        'FEATURE_NEXT_12455',
        'FEATURE_NEXT_13504',
        'FEATURE_NEXT_14114',
        'FEATURE_NEXT_14408',
        'FEATURE_NEXT_15053',
        'FEATURE_NEXT_15815',
        'FEATURE_NEXT_16710',
        'FEATURE_NEXT_17261',
        'FEATURE_NEXT_18215',
        'FEATURE_NEXT_19048',
        'FEATURE_NEXT_19822',
        'FEATURE_NEXT_20598',
        'FEATURE_NEXT_21547',
        'FEATURE_NEXT_22900'
    ];

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // Check if we're in a feature flag context
        if (!this.isFeatureFlagContext(linePrefix, document.languageId)) {
            return [];
        }

        return this.featureFlags.map(flag => {
            const item = new vscode.CompletionItem(flag, vscode.CompletionItemKind.Constant);
            item.detail = 'Feature Flag';
            item.documentation = `Shopware feature flag: ${flag}`;
            item.insertText = flag;
            return item;
        });
    }

    private isFeatureFlagContext(linePrefix: string, languageId: string): boolean {
        // PHP: Feature::isActive('...')
        if (languageId === 'php') {
            return /Feature::isActive\(['"]/.test(linePrefix) ||
                   /->isActive\(['"]/.test(linePrefix);
        }

        // JavaScript/Vue: Feature.isActive('...') or this.feature.isActive('...')
        if (languageId === 'javascript' || languageId === 'vue') {
            return /Feature\.isActive\(['"]/.test(linePrefix) ||
                   /feature\.isActive\(['"]/.test(linePrefix);
        }

        // Twig: feature('...')
        if (languageId === 'twig') {
            return /feature\(['"]/.test(linePrefix);
        }

        return false;
    }
}
