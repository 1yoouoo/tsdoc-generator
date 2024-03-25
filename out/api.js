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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTsDocComment = void 0;
const vscode = __importStar(require("vscode"));
const openai_1 = __importDefault(require("openai"));
const korean_1 = __importDefault(require("./prompts/BlockPrompts/korean"));
const english_1 = __importDefault(require("./prompts/BlockPrompts/english"));
const korean_2 = __importDefault(require("./prompts/InlinePrompts/korean"));
const english_2 = __importDefault(require("./prompts/InlinePrompts/english"));
const config = vscode.workspace.getConfiguration('tsdoc-generator');
const apiKey = config.get('apiKey');
const openai = new openai_1.default({
    apiKey,
});
const language = config.get('language') || 'english';
const documentationStyle = config.get('documentationStyle') || 'inline';
let prompt;
if (language === 'korean') {
    prompt = documentationStyle === 'inline' ? korean_2.default : korean_1.default;
}
else {
    prompt = documentationStyle === 'inline' ? english_2.default : english_1.default;
}
const generateTsDocComment = async (selectedText) => {
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
    }
    catch (error) {
        throw error;
    }
};
exports.generateTsDocComment = generateTsDocComment;
//# sourceMappingURL=api.js.map