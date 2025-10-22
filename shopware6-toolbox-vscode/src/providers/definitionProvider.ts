import * as vscode from 'vscode';
import { SnippetParser } from '../parsers/snippetParser';

export class SnippetDefinitionProvider implements vscode.DefinitionProvider {
    private snippetParser: SnippetParser;

    constructor(snippetParser: SnippetParser) {
        this.snippetParser = snippetParser;
    }

    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Location | vscode.Location[] | undefined> {
        const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9._-]+/);
        if (!wordRange) {
            return undefined;
        }

        const word = document.getText(wordRange);
        const line = document.lineAt(position).text;

        // Check if this is a snippet key
        if (this.isSnippetKey(line, document.languageId)) {
            const snippet = this.snippetParser.getSnippet(word);
            if (snippet) {
                const uri = vscode.Uri.file(snippet.file);
                // Return the location - in a real implementation, we'd find the exact position
                return new vscode.Location(uri, new vscode.Position(0, 0));
            }
        }

        return undefined;
    }

    private isSnippetKey(line: string, languageId: string): boolean {
        if (languageId === 'php') {
            return /->trans\(['"]/.test(line);
        }
        if (languageId === 'twig') {
            return /['"].*\|trans/.test(line);
        }
        if (languageId === 'javascript' || languageId === 'vue') {
            return /\$t[c]?\(['"]/.test(line);
        }
        return false;
    }
}
