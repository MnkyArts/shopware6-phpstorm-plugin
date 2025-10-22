import * as vscode from 'vscode';
import { AdminComponentParser } from '../parsers/adminComponentParser';

export class AdminComponentDefinitionProvider implements vscode.DefinitionProvider {
    private componentParser: AdminComponentParser;

    constructor(componentParser: AdminComponentParser) {
        this.componentParser = componentParser;
    }

    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Location | vscode.Location[] | undefined> {
        const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9-_]+/);
        if (!wordRange) {
            return undefined;
        }

        const word = document.getText(wordRange);
        const line = document.lineAt(position).text;

        // Check if this looks like a component reference
        if (this.isComponentReference(line, word)) {
            const component = this.componentParser.getComponent(word);
            if (component) {
                const uri = vscode.Uri.file(component.file);
                return new vscode.Location(uri, new vscode.Position(0, 0));
            }
        }

        return undefined;
    }

    private isComponentReference(line: string, word: string): boolean {
        // Check for common component reference patterns
        const patterns = [
            /Component\.(extend|override|register)\(['"]([^'"]+)['"]/,
            /<([a-z-]+)/,  // Twig/HTML tag
            /this\.\$parent\s*===\s*['"]([^'"]+)['"]/,
            /component:\s*['"]([^'"]+)['"]/
        ];

        return patterns.some(pattern => {
            const match = line.match(pattern);
            return match && (match[1] === word || match[2] === word);
        });
    }
}

export class AdminComponentCompletionProvider implements vscode.CompletionItemProvider {
    private componentParser: AdminComponentParser;

    constructor(componentParser: AdminComponentParser) {
        this.componentParser = componentParser;
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // Check if we should provide component completions
        if (!this.shouldProvideCompletion(linePrefix)) {
            return [];
        }

        const components = this.componentParser.getComponents();
        
        return components.map(component => {
            const item = new vscode.CompletionItem(component.name, vscode.CompletionItemKind.Class);
            
            let documentation = `**Component:** ${component.name}\n\n`;
            documentation += `**File:** ${component.file}\n\n`;
            
            if (component.extends) {
                documentation += `**Extends:** ${component.extends}\n\n`;
            }
            
            if (component.props && component.props.length > 0) {
                documentation += `**Props:**\n`;
                component.props.forEach(prop => {
                    documentation += `- ${prop}\n`;
                });
            }
            
            item.documentation = new vscode.MarkdownString(documentation);
            item.detail = component.extends ? `extends ${component.extends}` : 'Component';
            item.insertText = component.name;
            
            return item;
        });
    }

    private shouldProvideCompletion(linePrefix: string): boolean {
        // Provide completions in various contexts
        return /Component\.(extend|override|register)\(['"]/.test(linePrefix) ||
               /component:\s*['"]/.test(linePrefix) ||
               /<[a-z-]*$/.test(linePrefix) ||
               /this\.\$parent\s*===\s*['"]/.test(linePrefix);
    }
}
