import * as vscode from 'vscode';
import * as path from 'path';

export interface AdminComponent {
    name: string;
    file: string;
    extends?: string;
    props?: string[];
}

export class AdminComponentParser {
    private components: Map<string, AdminComponent> = new Map();
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
    }

    async parse(): Promise<void> {
        this.components.clear();

        const files = await vscode.workspace.findFiles(
            '**/src/Resources/app/administration/src/**/*.js',
            '**/node_modules/**'
        );

        for (const file of files) {
            await this.parseFile(file.fsPath);
        }
    }

    private async parseFile(filePath: string): Promise<void> {
        try {
            const content = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
            const text = Buffer.from(content).toString('utf8');

            // Match Shopware.Component.register calls
            const registerRegex = /Shopware\.Component\.register\(['"]([^'"]+)['"]/g;
            let match;

            while ((match = registerRegex.exec(text)) !== null) {
                const componentName = match[1];
                
                // Check for extends
                const extendsRegex = new RegExp(`Shopware\\.Component\\.(?:extend|override)\\(['"]([^'"]+)['"]`);
                const extendsMatch = text.match(extendsRegex);

                this.components.set(componentName, {
                    name: componentName,
                    file: filePath,
                    extends: extendsMatch ? extendsMatch[1] : undefined,
                    props: this.extractProps(text)
                });
            }

            // Also match Component.extend and Component.override
            const extendRegex = /Component\.(?:extend|override)\(['"]([^'"]+)['"]/g;
            while ((match = extendRegex.exec(text)) !== null) {
                const componentName = match[1];
                
                if (!this.components.has(componentName)) {
                    this.components.set(componentName, {
                        name: componentName,
                        file: filePath,
                        props: this.extractProps(text)
                    });
                }
            }
        } catch (error) {
            console.error(`Error parsing admin component file ${filePath}:`, error);
        }
    }

    private extractProps(content: string): string[] {
        const props: string[] = [];
        
        // Try to find props object
        const propsMatch = content.match(/props\s*:\s*\{([^}]+)\}/);
        if (propsMatch) {
            const propsContent = propsMatch[1];
            const propNames = propsContent.match(/['"]?([a-zA-Z0-9_]+)['"]?\s*:/g);
            
            if (propNames) {
                propNames.forEach(prop => {
                    const name = prop.replace(/['"]?([a-zA-Z0-9_]+)['"]?\s*:/, '$1');
                    props.push(name);
                });
            }
        }

        return props;
    }

    getComponents(): AdminComponent[] {
        return Array.from(this.components.values());
    }

    getComponent(name: string): AdminComponent | undefined {
        return this.components.get(name);
    }

    findComponents(query: string): AdminComponent[] {
        const lowerQuery = query.toLowerCase();
        return this.getComponents().filter(component => 
            component.name.toLowerCase().includes(lowerQuery)
        );
    }
}
