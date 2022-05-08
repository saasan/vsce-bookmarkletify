import * as vscode from 'vscode';
import { minify } from 'terser';
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

async function bookmarkletify() {
    const input = getText();
    let output = removeProtocol(input);
    const minifyOutput = await minify(output);
    output = minifyOutput.code ?? output;

    return PROTOCOL + encodeURIComponent('(()=>{' + output + '})();');
}

export function activate(context: vscode.ExtensionContext) {
    const disposableCopy = vscode.commands.registerCommand(`${EXT_ID}.copyToClipboard`, async () => {
        const output = await bookmarkletify();

        vscode.env.clipboard.writeText(output);
        vscode.window.showInformationMessage('Bookmarkletify: Copied!');
	});

    const disposableNewFile = vscode.commands.registerCommand(`${EXT_ID}.newFile`, async () => {
        const output = await bookmarkletify();

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
