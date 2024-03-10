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
function activate(context) {
    let latestRequestId = 0;
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('tsdoc-generator.apiKey')) {
            vscode.window.showInformationMessage(`API 키가 변경되었습니다, 확장 프로그램 재시동시 적용됩니다.`);
        }
    }));
    if (apiKey === '') {
        vscode.window
            .showInformationMessage('API 키가 설정되어 있지 않습니다. 확장 프로그램을 사용하려면 API 키를 설정해주세요.', '설정으로 이동')
            .then(selection => {
            if (selection === '설정으로 이동') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'tsdoc-generator.apiKey');
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
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '분석 중...',
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
                const errorCode = error.error.code ?? '알 수 없는 에러';
                vscode.window.showErrorMessage(`문서 포맷팅 중 오류가 발생했습니다. 에러 코드: ${errorCode}. 다시 시도해주세요.`);
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map