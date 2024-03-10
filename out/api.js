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
exports.main = void 0;
const vscode = __importStar(require("vscode"));
const openai_1 = __importDefault(require("openai"));
const config = vscode.workspace.getConfiguration('tsdoc-generator');
const apiKey = config.get('apiKey');
const openai = new openai_1.default({
    apiKey,
});
const main = async (selectedText) => {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `
            You are an assistant who creates tsDocs for types in a VSCode Extension.
            When you receive a type definition, you must generate a tsDoc comment for that type. Directly after generating the tsDoc, append the user's original type definition at the end of your response. Do not add any greetings or additional messages, just provide the tsDoc followed by the original type definition. Write in Korean. Ensure proper application of line breaks and whitespace. Adjust automatically to any type structure and descriptions provided by the user.
            Here are some examples with the expected tsDoc and the user's original type definition included at the end:
            
            Example 1: Simple Type
            Type definition: const MAX_LOGIN_ATTEMPTS: number = 5;
            Expected tsDoc: 
            /** 사용 가능한 최대 로그인 시도 횟수 */
            const MAX_LOGIN_ATTEMPTS: number = 5;
            
            Example 2: Interface
            Type definition: interface IUser { id: number; name: string; email: string; }
            Expected tsDoc: 
            /**
            * 사용자 인터페이스입니다.
            * @property {number} id - 사용자의 고유 ID입니다.
            * @property {string} name - 사용자의 이름입니다.
            * @property {string} email - 사용자의 이메일 주소입니다.
            */
            interface IUser { 
                id: number; 
                name: string; 
                email: string; 
            }
            
            Example 3: Class
            Type definition: class User { constructor(public id: number, public name: string, public email: string) {} }
            Expected tsDoc: 
            /**
            * 사용자를 나타내는 클래스입니다.
            * @param {number} id - 사용자의 고유 ID입니다.
            * @param {string} name - 사용자의 이름입니다.
            * @param {string} email - 사용자의 이메일 주소입니다.
            */
            class User { 
                constructor(public id: number, public name: string, public email: string) {} 
            }
            
            Example 4: Enum
            Type definition: enum UserRole { Admin, Editor, User }
            Expected tsDoc: 
            /**
            * 사용자의 역할을 나타내는 열거형입니다.
            * @enum {number} UserRole
            * @property {number} Admin - 관리자 역할
            * @property {number} Editor - 에디터 역할
            * @property {number} User - 일반 사용자 역할
            */
            enum UserRole { 
                Admin, 
                Editor, 
                User 
            }
            
            Example 5: Interface Extension
            Type definition: export interface HostManagementEventListViewModel extends HostManagementEventListModel { filterOptions: FilterOptions; limit: Limit; status: Status; };
            Expected tsDoc: 
            /**
            * 관리 보드 리스트 뷰 모델 인터페이스입니다. HostManagementEventListModel 인터페이스를 확장하며, 추가적인 필터 옵션을 제공합니다.
            * @extends {HostManagementEventListModel} - 기본 이벤트 리스트 모델을 확장합니다.
            * @property {FilterOptions} filterOptions - 사용 가능한 필터 옵션을 나타냅니다.
            * @property {Limit} limit - 한 번에 표시할 항목 수의 제한입니다.
            * @property {Status} status - 현재 선택된 참가자 상태 필터입니다.
            */
            
            Example 6: 타입 별칭과 유니온 타입
            Type definition: type WindowState = 'open' | 'closed' | 'minimized';
            Expected tsDoc:
            /**
            * 윈도우의 상태를 나타내는 타입입니다. '열림', '닫힘', '최소화' 중 하나의 상태를 가집니다.
            */
            
            Example 7: 복합 타입(인터섹션 타입)
            Type definition: type ProjectManager = Person & Employee & { projectIds: number[]; };
            Expected tsDoc:
            /**
            * 프로젝트 매니저를 나타내는 타입입니다. 사람(Person)과 직원(Employee)의 속성을 모두 가지며, 추가로 프로젝트 관리에 필요한 속성들을 포함합니다.
            */
            
            Example 8: 제네릭 인터페이스와 타입
            Type definition: interface GenericResponse<T, E> { success: boolean; data?: T; error?: E; }
            Expected tsDoc:
            /**
            * 데이터와 함께 응답을 나타내는 제네릭 인터페이스입니다. 성공 또는 실패 여부에 따라 다른 타입의 데이터를 포함할 수 있습니다.
            * @template T - 성공시 포함할 데이터의 타입
            * @template E - 실패시 포함할 에러의 타입
            * @property {boolean} success - 응답의 성공 여부
            * @property {T} [data] - 성공시 응답에 포함될 데이터
            * @property {E} [error] - 실패시 응답에 포함될 에러 정보
            */
            
            Write without {"""${'```typescript```'}"""}
            `,
            },
            {
                role: 'user',
                content: selectedText,
            },
        ],
        model: 'gpt-3.5-turbo',
    });
    console.log(completion.choices[0]);
    console.log(`prompt_tokens used: ${completion.usage?.prompt_tokens}`);
    console.log(`completion_tokens used: ${completion.usage?.completion_tokens}`);
    console.log(`total_tokens used: ${completion.usage?.total_tokens}`);
    return completion.choices[0].message.content;
};
exports.main = main;
//# sourceMappingURL=api.js.map