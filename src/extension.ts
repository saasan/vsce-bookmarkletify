import * as vscode from 'vscode';
import { minify } from 'uglify-js';
import { EXT_ID, SUPPORTED_FILES } from './utils';

function getJavaScript() {
    const doc = vscode.window.activeTextEditor?.document;
    if (doc === undefined || !SUPPORTED_FILES.includes(doc.languageId)) {
        return '';
    }

    let text = doc.getText();
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
    const disposableCopy = vscode.commands.registerCommand(`${EXT_ID}.copyToClipboard`, () => {
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

    const disposableNewFile = vscode.commands.registerCommand(`${EXT_ID}.newFile`, () => {
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
        }).then((doc) => {
            vscode.window.showTextDocument(doc);
        });
	});

	context.subscriptions.push(disposableCopy);
	context.subscriptions.push(disposableNewFile);
}

export function deactivate() {}
