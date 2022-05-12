import * as vscode from 'vscode';
import { EXT_ID } from './utils';

class Config {
    readonly protocol : string;
    readonly prefix : string;
    readonly suffix : string;

    constructor() {
        const config = vscode.workspace.getConfiguration(EXT_ID);

        this.protocol = config.get<string>('protocol', 'javascript:');
        this.prefix = config.get<string>('prefix', '(()=>{');
        this.suffix = config.get<string>('suffix', '})();');
    }
}

export function reloadConfig(): void {
    config = new Config();
}

export let config = new Config();
