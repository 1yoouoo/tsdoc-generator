import * as vscode from 'vscode';
import { generateTsDocComment } from './api';

const config = vscode.workspace.getConfiguration('tsdoc-generator');
const apiKey = config.get<string>('apiKey');
const language = config.get<string>('language') || 'korean';

export function activate(context: vscode.ExtensionContext) {
  let latestRequestId = 0;

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('tsdoc-generator.apiKey')) {
        vscode.window.showInformationMessage(
          `API 키가 변경되었습니다, 확장 프로그램 재시동시 적용됩니다.`,
        );
      }
    }),
  );

  if (apiKey === '') {
    vscode.window
      .showInformationMessage(
        'API 키가 설정되어 있지 않습니다. 확장 프로그램을 사용하려면 API 키를 설정해주세요.',
        '설정으로 이동',
      )
      .then(selection => {
        if (selection === '설정으로 이동') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'tsdoc-generator.apiKey');
        }
      });
    return;
  }

  let disposable = vscode.commands.registerCommand('tsdoc-generator.activate', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    const requestId = ++latestRequestId;

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: language === 'korean' ? '분석 중...' : 'Analyzing...',
        cancellable: false,
      },
      async () => {
        try {
          const formattedText = await generateTsDocComment(selectedText);

          if (formattedText && requestId === latestRequestId) {
            editor.edit(editBuilder => {
              editBuilder.replace(selection, formattedText);
            });
          } else if (requestId !== latestRequestId) {
            // 요청 ID가 변경되었을 때의 처리 로직
          }
        } catch (error: any) {
          const errorCode = error.error.code ?? '알 수 없는 에러';
          vscode.window.showErrorMessage(
            `문서 포맷팅 중 오류가 발생했습니다. 에러 코드: ${errorCode}. 다시 시도해주세요.`,
          );
        }
      },
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
