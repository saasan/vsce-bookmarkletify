import * as vscode from 'vscode';
import { minify } from 'uglify-js';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('bookmarkletify.copyBookmarklet', () => {
		const editor = vscode.window.activeTextEditor;
        if (editor?.document?.languageId !== 'javascript') {
            return;
        }

        let text = editor.document.getText();
        text = text.trim();
        if (text.length === 0) {
            return;
        }

        if (text.startsWith('javascript:')) {
            text = text.substring('javascript:'.length);
        }

        const minified = minify(text);
        if(minified.error) {
            vscode.window.showErrorMessage(minified.error.message);
            return;
        }

        text = 'javascript:' + encodeURIComponent('(()=>{' + minified.code + '})();');

        vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage('Bookmarkletify: Copied!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
