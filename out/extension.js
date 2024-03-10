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
function activate(context) {
    // 설정 변경 감지 리스너 등록
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("tsdoc-generator.apiKey")) {
            // API 키 설정이 변경되었을 때 수행할 작업
            const config = vscode.workspace.getConfiguration("tsdoc-generator");
            const apiKey = config.get("apiKey");
            vscode.window.showInformationMessage(`API 키가 변경되었습니다, 확장 프로그램 재시동시 적용됩니다.`);
            //TODO: API 키 변경시 리로드 UI 추가
        }
    }));
    // API 키 읽어오기
    const config = vscode.workspace.getConfiguration("tsdoc-generator");
    const apiKey = config.get("apiKey");
    // API 키가 설정되어 있으면 메시지로 표시
    if (!apiKey) {
        vscode.window.showInformationMessage("API 키가 설정되어 있지 않습니다.");
        return;
    }
    // 커맨드 등록
    let disposable = vscode.commands.registerCommand("tsdoc-generator.helloWorld", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            const formattedText = `/**
* 해당 내용은 입니다.
*/
${selectedText}`;
            // 선택한 텍스트를 새로운 포맷의 텍스트로 대체
            editor.edit((editBuilder) => {
                editBuilder.replace(selection, formattedText);
            });
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map