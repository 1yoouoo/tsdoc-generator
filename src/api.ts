import * as vscode from 'vscode';
import OpenAI from 'openai';
import koreanPrompt from './prompts/korean';
import englishPrompt from './prompts/english';

const config = vscode.workspace.getConfiguration('tsdoc-generator');
const apiKey = config.get<string>('apiKey');
const openai = new OpenAI({
  apiKey,
});
const language = config.get<string>('language') || 'korean';

let prompt: string;
switch (language) {
  case 'korean':
    prompt = koreanPrompt;
    break;
  case 'english':
  default:
    prompt = englishPrompt;
    break;
}

export const generateTsDocComment = async (selectedText: string) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: selectedText,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};
