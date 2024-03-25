import * as vscode from 'vscode';
import OpenAI from 'openai';
import koreanBlockPrompt from './prompts/BlockPrompts/korean';
import englishBlockPrompt from './prompts/BlockPrompts/english';
import koreanInlinePrompt from './prompts/InlinePrompts/korean';
import englishInlinePrompt from './prompts/InlinePrompts/english';

const config = vscode.workspace.getConfiguration('tsdoc-generator');
const apiKey = config.get<string>('apiKey');
const openai = new OpenAI({
  apiKey,
});
const language = config.get<string>('language') || 'english';
const documentationStyle = config.get<string>('documentationStyle') || 'inline';

let prompt: string;
if (language === 'korean') {
  prompt = documentationStyle === 'inline' ? koreanInlinePrompt : koreanBlockPrompt;
} else {
  prompt = documentationStyle === 'inline' ? englishInlinePrompt : englishBlockPrompt;
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
