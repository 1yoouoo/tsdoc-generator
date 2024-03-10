import * as vscode from 'vscode';
import { main } from './api';

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
  let disposable = vscode.commands.registerCommand('tsdoc-generator.helloWorld', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: '분석 중...',
          cancellable: false,
        },
        async (progress, token) => {
          // 선택한 텍스트에 대해 포맷팅 함수를 비동기적으로 호출
          const formattedText = await main(selectedText);

          if (formattedText) {
            editor.edit(editBuilder => {
              editBuilder.replace(selection, formattedText);
            });
          } else {
            vscode.window.showInformationMessage('포맷팅 실패');
          }
        },
      );
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
