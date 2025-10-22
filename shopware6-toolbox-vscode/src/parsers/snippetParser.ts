import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface SnippetData {
    key: string;
    file: string;
    translations: Map<string, string>;
}

export class SnippetParser {
    private snippets: Map<string, SnippetData> = new Map();
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
    }

    async parse(): Promise<void> {
        const config = vscode.workspace.getConfiguration('shopware6');
        const snippetPaths: string[] = config.get('snippetPaths', ['**/snippet/**/*.json']);

        this.snippets.clear();

        for (const pattern of snippetPaths) {
            const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
            
            for (const file of files) {
                await this.parseFile(file.fsPath);
            }
        }
    }

    private async parseFile(filePath: string): Promise<void> {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);

            // Determine locale from filename or path
            const locale = this.extractLocale(filePath);

            this.parseSnippetObject(data, '', filePath, locale);
        } catch (error) {
            console.error(`Error parsing snippet file ${filePath}:`, error);
        }
    }

    private extractLocale(filePath: string): string {
        const match = filePath.match(/([a-z]{2}-[A-Z]{2})\.json$/);
        if (match) {
            return match[1];
        }
        
        // Try to get from path
        const pathMatch = filePath.match(/\/([a-z]{2}-[A-Z]{2})\//);
        if (pathMatch) {
            return pathMatch[1];
        }

        return 'en-GB'; // default
    }

    private parseSnippetObject(obj: any, prefix: string, file: string, locale: string): void {
        for (const key in obj) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];

            if (typeof value === 'string') {
                // This is a snippet
                if (!this.snippets.has(fullKey)) {
                    this.snippets.set(fullKey, {
                        key: fullKey,
                        file,
                        translations: new Map()
                    });
                }

                const snippet = this.snippets.get(fullKey)!;
                snippet.translations.set(locale, value);
            } else if (typeof value === 'object' && value !== null) {
                // Nested object, recurse
                this.parseSnippetObject(value, fullKey, file, locale);
            }
        }
    }

    getSnippets(): SnippetData[] {
        return Array.from(this.snippets.values());
    }

    getSnippet(key: string): SnippetData | undefined {
        return this.snippets.get(key);
    }

    findSnippets(query: string): SnippetData[] {
        const lowerQuery = query.toLowerCase();
        return this.getSnippets().filter(snippet => 
            snippet.key.toLowerCase().includes(lowerQuery)
        );
    }
}
