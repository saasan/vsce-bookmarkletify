import * as vscode from 'vscode';
import { minify } from 'terser';
import { config, reloadConfig } from './config';
import { EXT_ID, SUPPORTED_FILES } from './utils';

function getText() {
    const doc = vscode.window.activeTextEditor?.document;
    if (doc == null || !SUPPORTED_FILES.includes(doc.languageId)) {
        return '';
    }

    let text = doc.getText();
    text = text.trim();

    return text;
}

function removeProtocol(input: string) {
    if (input.startsWith(config.protocol)) {
        return input.substring(config.protocol.length);
    }

    return input;
}

async function bookmarkletify(input: string) {
    let output = removeProtocol(input);
    const minifyOutput = await minify(output);
    output = minifyOutput.code ?? output;

    return config.protocol + encodeURIComponent(config.prefix + output + config.suffix);
}

export function activate(context: vscode.ExtensionContext) {
    reloadConfig();

    context.subscriptions.push(
        vscode.commands.registerCommand(`${EXT_ID}.copyToClipboard`, async () => {
            const input = getText();
            if (input.length === 0) {
                vscode.window.showErrorMessage('JavaScript file is not open.');
                return;
            }

            const output = await bookmarkletify(input);

            vscode.env.clipboard.writeText(output);
            vscode.window.showInformationMessage('Bookmarkletify: Copied!');
        }),

        vscode.commands.registerCommand(`${EXT_ID}.newFile`, async () => {
            const input = getText();
            if (input.length === 0) {
                vscode.window.showErrorMessage('JavaScript file is not open.');
                return;
            }

            const output = await bookmarkletify(input);

            vscode.workspace.openTextDocument({
                language: 'javascript',
                content: output,
            }).then((doc) => {
                vscode.window.showTextDocument(doc);
            });
        }),

        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(EXT_ID)) {
                reloadConfig();
            }
        })
    );
}

export function deactivate() {}
