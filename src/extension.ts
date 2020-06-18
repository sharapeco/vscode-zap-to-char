// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Register a text editor command
	const register = (command: string, callback: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => void) => {
		context.subscriptions.push(
			vscode.commands.registerTextEditorCommand(`zaptochar.${command}`, callback)
		);
	};

	register('forward', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
		const toFind = await inputChar({ prompt: 'Zap to char:' });
		if (toFind === undefined) {
			return;
		}
		const foundPosition = findTextFromCursorPosition(textEditor, toFind);
		if (!foundPosition) {
			return;
		}
		textEditor.selections = [
			new vscode.Selection(foundPosition, foundPosition)
		];
	});

	register('backward', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
		const toFind = await inputChar({ prompt: 'Zap to backward char:' });
		if (toFind === undefined) {
			return;
		}
		const foundPosition = findTextFromCursorPosition(textEditor, toFind, true);
		if (!foundPosition) {
			return;
		}
		textEditor.selections = [
			new vscode.Selection(foundPosition, foundPosition)
		];
	});

	register('deleteForward', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
		const toFind = await inputChar({ prompt: 'Delete to char:' });
		if (toFind === undefined) {
			return;
		}
		const currentPosition = textEditor.selection.active;
		const foundPosition = findTextFromCursorPosition(textEditor, toFind);
		if (!foundPosition) {
			return;
		}
		textEditor.selections = [
			new vscode.Selection(currentPosition, foundPosition)
		];
		vscode.commands.executeCommand('editor.action.clipboardCutAction');
	});

	register('deleteBackward', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
		const toFind = await inputChar({ prompt: 'Delete to backward char:' });
		if (toFind === undefined) {
			return;
		}
		const currentPosition = textEditor.selection.active;
		const foundPosition = findTextFromCursorPosition(textEditor, toFind, true);
		if (!foundPosition) {
			return;
		}
		textEditor.selections = [
			new vscode.Selection(currentPosition, foundPosition)
		];
		vscode.commands.executeCommand('editor.action.clipboardCutAction');
	});
}

/**
 * Input single character
 * @param options
 */
function inputChar (options: vscode.InputBoxOptions): Promise<string> {
	return new Promise((resolve: (value?: string) => void) => {
		const dialog = vscode.window.createInputBox();
		Object.assign(dialog, options);

		let resolved = false;
		dialog.onDidChangeValue(() => {
			resolve(dialog.value);
			resolved = true;
			dialog.hide();
		});
		dialog.onDidHide(() => {
			if (!resolved) {
				resolve();
			}
		});
		dialog.show();
	});
}

function findTextFromCursorPosition (textEditor: vscode.TextEditor, toFind: string, backward: boolean = false): vscode.Position | null {
	const { document } = textEditor;
	const activePosition = textEditor.selection.active;
	const activeOffset = document.offsetAt(activePosition);
	const text = document.getText();
	const foundOffset = backward ?
		text.lastIndexOf(toFind, activeOffset - 1) :
		text.indexOf(toFind, activeOffset);
	if (foundOffset < 0) {
		return null;
	}

	const adjustment = backward ? 0 : 1;
	return document.positionAt(foundOffset + adjustment);
}

// this method is called when your extension is deactivated
export function deactivate() {}
