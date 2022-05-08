import * as vscode from 'vscode';
import { minify } from 'uglify-js';
import { EXT_ID, SUPPORTED_FILES, PROTOCOL } from './utils';

function getText() {
    const doc = vscode.window.activeTextEditor?.document;
    if (doc === undefined || !SUPPORTED_FILES.includes(doc.languageId)) {
        return '';
    }

    let text = doc.getText();
    text = text.trim();

    return text;
}

function removeProtocol(input: string) {
    if (input.startsWith(PROTOCOL)) {
        return input.substring(PROTOCOL.length);
    }

    return input;
}

function bookmarkletify(input: string) {
    const minified = minify(input);
    if(minified.error) {
        throw minified.error;
    }

    return PROTOCOL + encodeURIComponent('(()=>{' + minified.code + '})();');
}

export function activate(context: vscode.ExtensionContext) {
    const disposableCopy = vscode.commands.registerCommand(`${EXT_ID}.copyToClipboard`, () => {
        const input = getText();
        if (input.length === 0) {
            return;
        }

        let output = removeProtocol(input);

        try {
            output = bookmarkletify(output);
        }
        catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            }
            return;
        }

        vscode.env.clipboard.writeText(output);
        vscode.window.showInformationMessage('Bookmarkletify: Copied!');
	});

    const disposableNewFile = vscode.commands.registerCommand(`${EXT_ID}.newFile`, () => {
        const input = getText();
        if (input.length === 0) {
            return;
        }

        let output = removeProtocol(input);

        try {
            output = bookmarkletify(output);
        }
        catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            }
            return;
        }

        vscode.workspace.openTextDocument({
            language: 'javascript',
            content: output,
        }).then((doc) => {
            vscode.window.showTextDocument(doc);
        });
	});

	context.subscriptions.push(disposableCopy);
	context.subscriptions.push(disposableNewFile);
}

export function deactivate() {}
