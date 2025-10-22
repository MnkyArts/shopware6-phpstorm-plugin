import * as vscode from 'vscode';
import * as path from 'path';
import { 
    getWorkspaceRoot, 
    ensureDirectoryExists, 
    showError, 
    showSuccess,
    kebabToPascalCase,
    toSnakeCase
} from '../utils/fileUtils';
import { 
    getScheduledTaskTemplate, 
    getScheduledTaskHandlerTemplate 
} from '../templates/scheduledTask.template';

export async function generateScheduledTask(): Promise<void> {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
        showError('No workspace folder open');
        return;
    }

    // Ask for task name
    const taskName = await vscode.window.showInputBox({
        prompt: 'Enter task name (e.g., MyCleanupTask)',
        placeHolder: 'MyCleanupTask',
        validateInput: (value) => {
            if (!value) {
                return 'Task name is required';
            }
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
                return 'Task name must start with uppercase letter and contain only alphanumeric characters';
            }
            return null;
        }
    });

    if (!taskName) {
        return;
    }

    // Ask for namespace
    const namespace = await vscode.window.showInputBox({
        prompt: 'Enter namespace (e.g., MyPlugin\\ScheduledTask)',
        placeHolder: 'MyPlugin\\ScheduledTask',
        validateInput: (value) => {
            if (!value) {
                return 'Namespace is required';
            }
            return null;
        }
    });

    if (!namespace) {
        return;
    }

    // Generate task identifier
    const taskIdentifier = toSnakeCase(taskName);

    // Ask for file location
    const basePath = await vscode.window.showInputBox({
        prompt: 'Enter base path for the task files',
        placeHolder: 'src/ScheduledTask',
        value: 'src/ScheduledTask'
    });

    if (!basePath) {
        return;
    }

    const taskDir = path.join(workspaceRoot, basePath);

    try {
        // Create directory
        await ensureDirectoryExists(taskDir);

        // Create Task class
        const taskContent = getScheduledTaskTemplate(
            namespace,
            taskName,
            taskIdentifier
        );
        const taskPath = path.join(taskDir, `${taskName}.php`);
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(taskPath),
            Buffer.from(taskContent, 'utf8')
        );

        // Create TaskHandler class
        const handlerName = `${taskName}Handler`;
        const handlerContent = getScheduledTaskHandlerTemplate(
            namespace,
            taskName,
            handlerName,
            taskName
        );
        const handlerPath = path.join(taskDir, `${handlerName}.php`);
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(handlerPath),
            Buffer.from(handlerContent, 'utf8')
        );

        // Open the task file
        const document = await vscode.workspace.openTextDocument(taskPath);
        await vscode.window.showTextDocument(document);

        showSuccess(`Scheduled task "${taskName}" created successfully!`);
        
        // Show additional info
        vscode.window.showInformationMessage(
            `Don't forget to register the task handler in your services.xml with the tag "messenger.message_handler"`,
            'OK'
        );
    } catch (error) {
        showError(`Failed to create scheduled task: ${error}`);
    }
}
