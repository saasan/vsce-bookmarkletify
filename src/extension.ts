import * as vscode from 'vscode';
import { minify } from 'uglify-js';

function getJavaScript() {
    const editor = vscode.window.activeTextEditor;
    if (editor?.document?.languageId !== 'javascript') {
        return '';
    }

    let text = editor.document.getText();
    text = text.trim();

    return text;
}

function bookmarkletify(input: string) {
    let code = input;

    if (code.startsWith('javascript:')) {
        code = code.substring('javascript:'.length);
    }

    const minified = minify(code);
    if(minified.error) {
        throw minified.error;
    }

    code = 'javascript:' + encodeURIComponent('(()=>{' + minified.code + '})();');

    return code;
}

export function activate(context: vscode.ExtensionContext) {
    const disposableCopy = vscode.commands.registerCommand('bookmarkletify.copyToClipboard', () => {
        let js = getJavaScript();
        if (js.length === 0) {
            return;
        }

        try {
            js = bookmarkletify(js);
        }
        catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            }
            return;
        }

        vscode.env.clipboard.writeText(js);
        vscode.window.showInformationMessage('Bookmarkletify: Copied!');
	});

    const disposableNewFile = vscode.commands.registerCommand('bookmarkletify.newFile', () => {
        let js = getJavaScript();
        if (js.length === 0) {
            return;
        }

        try {
            js = bookmarkletify(js);
        }
        catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            }
            return;
        }

        vscode.workspace.openTextDocument({
            language: 'javascript',
            content: js,
        }).then((document) => {
            vscode.window.showTextDocument(document);
        });
	});

	context.subscriptions.push(disposableCopy);
	context.subscriptions.push(disposableNewFile);
}

export function deactivate() {}
