import * as vscode from 'vscode';
import * as path from 'path';
import { 
    getWorkspaceRoot, 
    showError, 
    showSuccess 
} from '../utils/fileUtils';
import { getChangelogTemplate } from '../templates/changelog.template';

export async function generateChangelog(): Promise<void> {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
        showError('No workspace folder open');
        return;
    }

    // Ask for initial version
    const version = await vscode.window.showInputBox({
        prompt: 'Enter initial version',
        placeHolder: '1.0.0',
        value: '1.0.0',
        validateInput: (value) => {
            if (!value) {
                return 'Version is required';
            }
            if (!/^\d+\.\d+\.\d+/.test(value)) {
                return 'Version should follow semver format (e.g., 1.0.0)';
            }
            return null;
        }
    });

    if (!version) {
        return;
    }

    const changelogPath = path.join(workspaceRoot, 'CHANGELOG.md');

    try {
        // Check if file already exists
        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(changelogPath));
            const overwrite = await vscode.window.showWarningMessage(
                'CHANGELOG.md already exists. Overwrite?',
                'Yes',
                'No'
            );
            if (overwrite !== 'Yes') {
                return;
            }
        } catch {
            // File doesn't exist, proceed
        }

        // Create CHANGELOG.md
        const changelogContent = getChangelogTemplate(version);
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(changelogPath),
            Buffer.from(changelogContent, 'utf8')
        );

        // Open the file
        const document = await vscode.workspace.openTextDocument(changelogPath);
        await vscode.window.showTextDocument(document);

        showSuccess('CHANGELOG.md created successfully!');
    } catch (error) {
        showError(`Failed to create CHANGELOG.md: ${error}`);
    }
}
