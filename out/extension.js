"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const api_1 = require("./api");
const config = vscode.workspace.getConfiguration('tsdoc-generator');
const apiKey = config.get('apiKey');
const language = config.get('language') || 'english';
function activate(context) {
    let latestRequestId = 0;
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        const settings = [
            'tsdoc-generator.apiKey',
            'tsdoc-generator.language',
            'tsdoc-generator.documentationStyle',
        ];
        const isRelevantChange = settings.some(setting => e.affectsConfiguration(setting));
        if (isRelevantChange) {
            const message = language === 'korean'
                ? `설정이 변경되었습니다, 확장 프로그램 재시동시 적용됩니다.`
                : `The setting has been changed, and will take effect on extension restart.`;
            vscode.window.showInformationMessage(message, 'Restart').then(selection => {
                if (selection === 'Restart') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        }
    }));
    if (apiKey === '') {
        vscode.window
            .showInformationMessage('No API key is set, please set an API key to use the extension.🌟', 'Go to Settings')
            .then(selection => {
            if (selection === 'Go to Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'tsdoc-generator');
            }
        });
        return;
    }
    let disposable = vscode.commands.registerCommand('tsdoc-generator.activate', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const requestId = ++latestRequestId;
        const progressTitle = language === 'korean' ? '분석 중...' : 'Analyzing...';
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: progressTitle,
            cancellable: false,
        }, async () => {
            try {
                const formattedText = await (0, api_1.generateTsDocComment)(selectedText);
                if (formattedText && requestId === latestRequestId) {
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, formattedText);
                    });
                }
                else if (requestId !== latestRequestId) {
                    // 요청 ID가 변경되었을 때의 처리 로직
                }
            }
            catch (error) {
                const errorMessage = language === 'korean'
                    ? `문서 포맷팅 중 오류가 발생했습니다. 에러 코드: ${error.error.code ?? '알 수 없는 에러'}. 다시 시도해주세요.`
                    : `An error occurred while formatting the document. Error code: ${error.error.code ?? 'unknown error'}. Please try again.`;
                vscode.window.showErrorMessage(errorMessage);
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map