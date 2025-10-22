import * as vscode from 'vscode';
import * as path from 'path';

interface BlockVersionInfo {
    version?: string;
    hash?: string;
    deprecated?: string;
    deprecationMessage?: string;
}

export class TwigBlockCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;
    private blockVersionCache: Map<string, Map<string, BlockVersionInfo>> = new Map();

    constructor() {
        this.indexShopwareBlocks();
    }

    /**
     * Index Shopware blocks from vendor/src directories
     * This mimics the JetBrains plugin's FileBasedIndex approach
     */
    private async indexShopwareBlocks(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return;
        }

        // Find Twig files in Shopware storefront
        const twigFiles = await vscode.workspace.findFiles(
            '**/vendor/shopware/storefront/Resources/views/**/*.twig',
            '**/node_modules/**'
        );

        // Also check src/Storefront for project files
        const srcFiles = await vscode.workspace.findFiles(
            '**/src/Storefront/Resources/views/**/*.twig',
            '**/node_modules/**'
        );

        const allFiles = [...twigFiles, ...srcFiles];

        for (const file of allFiles) {
            await this.parseBlockVersions(file);
        }
    }

    /**
     * Parse Twig blocks and their versioning comments from a file
     * Looks for patterns like: {# shopware-block: hash@version #}
     * and {# @deprecated tag:v6.x.0 - message #}
     */
    private async parseBlockVersions(file: vscode.Uri): Promise<void> {
        try {
            const content = await vscode.workspace.fs.readFile(file);
            const text = Buffer.from(content).toString('utf8');
            const relativePath = this.getRelativePath(file.fsPath);

            if (!this.blockVersionCache.has(relativePath)) {
                this.blockVersionCache.set(relativePath, new Map());
            }

            const fileBlocks = this.blockVersionCache.get(relativePath)!;

            // Match blocks with their preceding comments
            // Pattern: optional comment, then {% block name %}
            const blockPattern = /(?:\{#([^}]*?)#\}\s*)?\{%\s*block\s+([a-zA-Z0-9_]+)\s*%\}/g;
            let match;

            while ((match = blockPattern.exec(text)) !== null) {
                const comment = match[1];
                const blockName = match[2];

                const versionInfo: BlockVersionInfo = {};

                if (comment) {
                    // Check for shopware-block versioning comment
                    const versionMatch = comment.match(/shopware-block:\s*([a-f0-9]+)@([\d.]+)/);
                    if (versionMatch) {
                        versionInfo.hash = versionMatch[1];
                        versionInfo.version = versionMatch[2];
                    }

                    // Check for deprecation
                    const deprecatedMatch = comment.match(/@deprecated\s+tag:v([\d.]+)(?:\s+-\s+(.*))?/);
                    if (deprecatedMatch) {
                        versionInfo.deprecated = deprecatedMatch[1];
                        versionInfo.deprecationMessage = deprecatedMatch[2]?.trim() || '';
                    }
                }

                fileBlocks.set(blockName, versionInfo);
            }
        } catch (error) {
            console.error(`Error parsing block versions from ${file.fsPath}:`, error);
        }
    }

    private getRelativePath(filePath: string): string {
        // Extract path relative to Resources/views/
        const match = filePath.match(/Resources\/views\/(.+)/);
        return match ? match[1] : filePath;
    }

    async provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();
        const relativePath = this.getRelativePath(document.uri.fsPath);

        // Match Twig block definitions: {% block block_name %}
        const blockRegex = /\{%\s*block\s+([a-zA-Z0-9_]+)\s*%\}/g;
        let match;

        while ((match = blockRegex.exec(text)) !== null) {
            const blockName = match[1];
            
            // Look for version info in the indexed blocks
            let versionInfo: BlockVersionInfo | undefined;
            
            // First check the current file
            const fileBlocks = this.blockVersionCache.get(relativePath);
            if (fileBlocks) {
                versionInfo = fileBlocks.get(blockName);
            }

            // If not found, search all indexed blocks for this block name
            if (!versionInfo) {
                for (const [path, blocks] of this.blockVersionCache) {
                    if (blocks.has(blockName)) {
                        versionInfo = blocks.get(blockName);
                        break;
                    }
                }
            }

            if (versionInfo && (versionInfo.version || versionInfo.deprecated)) {
                const position = document.positionAt(match.index);
                const range = new vscode.Range(position, position);

                let versionText = '';
                const versionParts: string[] = [];

                if (versionInfo.version) {
                    versionParts.push(`v${versionInfo.version}`);
                }
                if (versionInfo.deprecated) {
                    versionParts.push(`⚠️ deprecated in v${versionInfo.deprecated}`);
                }

                versionText = versionParts.join(', ');

                const codeLens = new vscode.CodeLens(range, {
                    title: `📦 ${blockName} (${versionText})`,
                    command: 'shopware6.showBlockInfo',
                    arguments: [blockName, versionInfo]
                });

                codeLenses.push(codeLens);
            }
        }

        return codeLenses;
    }

    refresh(): void {
        this.blockVersionCache.clear();
        this.indexShopwareBlocks();
        this._onDidChangeCodeLenses.fire();
    }
}

export function registerShowBlockInfoCommand(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'shopware6.showBlockInfo',
            (blockName: string, versionInfo: any) => {
                let message = `**Twig Block: ${blockName}**\n\n`;

                if (versionInfo.version) {
                    message += `📦 Version: Shopware v${versionInfo.version}\n`;
                }
                if (versionInfo.hash) {
                    message += `🔑 Hash: ${versionInfo.hash.substring(0, 8)}...\n`;
                }
                if (versionInfo.deprecated) {
                    message += `⚠️ **Deprecated** in v${versionInfo.deprecated}\n`;
                    if (versionInfo.deprecationMessage) {
                        message += `   ${versionInfo.deprecationMessage}\n`;
                    }
                }

                if (!versionInfo.version && !versionInfo.deprecated) {
                    message += `ℹ️ No version information available for this block.\n`;
                }

                vscode.window.showInformationMessage(message);
            }
        )
    );
}
