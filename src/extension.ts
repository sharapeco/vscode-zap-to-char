// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "zaptochar" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const register = (command: string, callback: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => void) => {
		context.subscriptions.push(
			vscode.commands.registerTextEditorCommand(`zaptochar.${command}`, callback)
		);
	};

	register('forward', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
		// Display a message box to the user
		vscode.window.showInformationMessage('zap-to-char: forward!');

		const { document } = textEditor;
		const activePoint = textEditor.selection.active;
		const activeOffset = document.offsetAt(activePoint);
		const text = document.getText();
		const pos = text.indexOf('r', activeOffset);
		if (pos < 0) {
			return;
		}

		console.log(textEditor.selection)
	});

	register('backward', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
		// Display a message box to the user
		vscode.window.showInformationMessage('zap-to-char: backward!');
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
