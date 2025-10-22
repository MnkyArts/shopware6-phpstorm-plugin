import * as vscode from 'vscode';

// Twig block version data - this would ideally come from Shopware's version data
// For now, we'll use a sample dataset
const BLOCK_VERSIONS: Record<string, { introduced?: string; deprecated?: string; removed?: string }> = {
    'base_main': { introduced: '6.0.0' },
    'base_header': { introduced: '6.0.0' },
    'base_navigation': { introduced: '6.0.0' },
    'page_checkout_cart': { introduced: '6.1.0' },
    'page_checkout_confirm': { introduced: '6.1.0' },
    'component_product_box': { introduced: '6.0.0', deprecated: '6.5.0' },
    // Add more blocks as needed
};

export class TwigBlockCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    async provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();

        // Match Twig block definitions: {% block block_name %}
        const blockRegex = /\{%\s*block\s+([a-zA-Z0-9_]+)\s*%\}/g;
        let match;

        while ((match = blockRegex.exec(text)) !== null) {
            const blockName = match[1];
            const versionInfo = BLOCK_VERSIONS[blockName];

            if (versionInfo) {
                const position = document.positionAt(match.index);
                const range = new vscode.Range(position, position);

                let versionText = '';
                const versionParts: string[] = [];

                if (versionInfo.introduced) {
                    versionParts.push(`introduced in v${versionInfo.introduced}`);
                }
                if (versionInfo.deprecated) {
                    versionParts.push(`deprecated in v${versionInfo.deprecated}`);
                }
                if (versionInfo.removed) {
                    versionParts.push(`removed in v${versionInfo.removed}`);
                }

                versionText = versionParts.join(', ');

                const codeLens = new vscode.CodeLens(range, {
                    title: `📦 Block: ${blockName} (${versionText})`,
                    command: 'shopware6.showBlockInfo',
                    arguments: [blockName, versionInfo]
                });

                codeLenses.push(codeLens);
            }
        }

        return codeLenses;
    }

    refresh(): void {
        this._onDidChangeCodeLenses.fire();
    }
}

export function registerShowBlockInfoCommand(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'shopware6.showBlockInfo',
            (blockName: string, versionInfo: any) => {
                let message = `**Twig Block: ${blockName}**\n\n`;

                if (versionInfo.introduced) {
                    message += `✅ Introduced in Shopware v${versionInfo.introduced}\n`;
                }
                if (versionInfo.deprecated) {
                    message += `⚠️ Deprecated in Shopware v${versionInfo.deprecated}\n`;
                }
                if (versionInfo.removed) {
                    message += `❌ Removed in Shopware v${versionInfo.removed}\n`;
                }

                vscode.window.showInformationMessage(message);
            }
        )
    );
}
