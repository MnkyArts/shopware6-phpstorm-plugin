import * as vscode from 'vscode';

export class ShopwareDiagnosticsProvider {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('shopware6');
    }

    async provideDiagnostics(document: vscode.TextDocument): Promise<void> {
        if (document.languageId !== 'php') {
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();

        // Check for abstract class misuse in constructors
        diagnostics.push(...this.checkAbstractClassMisuse(document, text));

        // Check for other common issues
        diagnostics.push(...this.checkDeprecatedMethods(document, text));

        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    private checkAbstractClassMisuse(document: vscode.TextDocument, text: string): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];

        // Pattern: new SomeAbstractClass()
        // This is a simplified check - a real implementation would use AST parsing
        const abstractClassRegex = /new\s+(Abstract[A-Z][a-zA-Z0-9_]*)\s*\(/g;
        let match;

        while ((match = abstractClassRegex.exec(text)) !== null) {
            const className = match[1];
            const position = document.positionAt(match.index);
            const range = new vscode.Range(
                position,
                new vscode.Position(position.line, position.character + match[0].length)
            );

            const diagnostic = new vscode.Diagnostic(
                range,
                `Cannot instantiate abstract class '${className}'. Abstract classes should be extended, not instantiated.`,
                vscode.DiagnosticSeverity.Error
            );

            diagnostic.code = 'abstract-class-instantiation';
            diagnostic.source = 'Shopware 6';

            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }

    private checkDeprecatedMethods(document: vscode.TextDocument, text: string): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];

        // Check for common deprecated patterns
        const deprecatedPatterns = [
            {
                pattern: /\$this->container->get\(/g,
                message: 'Using container->get() is deprecated. Use dependency injection instead.',
                severity: vscode.DiagnosticSeverity.Warning
            },
            {
                pattern: /EntityRepository::class/g,
                message: 'Direct use of EntityRepository may be deprecated. Consider using specific repository.',
                severity: vscode.DiagnosticSeverity.Information
            }
        ];

        for (const { pattern, message, severity } of deprecatedPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const position = document.positionAt(match.index);
                const range = new vscode.Range(
                    position,
                    new vscode.Position(position.line, position.character + match[0].length)
                );

                const diagnostic = new vscode.Diagnostic(range, message, severity);
                diagnostic.source = 'Shopware 6';
                diagnostics.push(diagnostic);
            }
        }

        return diagnostics;
    }

    clear(): void {
        this.diagnosticCollection.clear();
    }

    dispose(): void {
        this.diagnosticCollection.dispose();
    }
}

export function registerDiagnostics(context: vscode.ExtensionContext): ShopwareDiagnosticsProvider {
    const diagnosticsProvider = new ShopwareDiagnosticsProvider();

    // Analyze document on open
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(doc => {
            diagnosticsProvider.provideDiagnostics(doc);
        })
    );

    // Analyze document on save
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(doc => {
            diagnosticsProvider.provideDiagnostics(doc);
        })
    );

    // Analyze document on change (with debounce)
    let timeout: NodeJS.Timeout | undefined;
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                diagnosticsProvider.provideDiagnostics(event.document);
            }, 500);
        })
    );

    // Analyze all open documents on activation
    vscode.workspace.textDocuments.forEach(doc => {
        diagnosticsProvider.provideDiagnostics(doc);
    });

    context.subscriptions.push(diagnosticsProvider);

    return diagnosticsProvider;
}
