import OpenAI from 'openai';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // 설정 변경 감지 리스너 등록
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('tsdoc-generator.apiKey')) {
        // API 키 설정이 변경되었을 때 수행할 작업
        const config = vscode.workspace.getConfiguration('tsdoc-generator');
        const apiKey = config.get<string>('apiKey');
        vscode.window.showInformationMessage(
          `API 키가 변경되었습니다, 확장 프로그램 재시동시 적용됩니다.`,
        );
        //TODO: API 키 변경시 리로드 UI 추가
      }
    }),
  );
  // API 키 읽어오기
  const config = vscode.workspace.getConfiguration('tsdoc-generator');
  const apiKey = config.get<string>('apiKey');

  // API 키가 설정되어 있으면 메시지로 표시
  if (!apiKey) {
    vscode.window.showInformationMessage('API 키가 설정되어 있지 않습니다.');
    return;
  }

  // 커맨드 등록
  let disposable = vscode.commands.registerCommand('tsdoc-generator.helloWorld', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      const formattedText = `/**
* 해당 내용은 입니다.
*/
${selectedText}`;

      // 선택한 텍스트를 새로운 포맷의 텍스트로 대체
      editor.edit(editBuilder => {
        editBuilder.replace(selection, formattedText);
      });
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
