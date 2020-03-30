/*
 ** Copyright 2020 Bloomberg Finance L.P.
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 **     http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */

/* eslint-disable no-useless-escape */
import * as _monaco from "monaco-editor";

export const conf = {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

    comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"],
    },

    brackets: [
        ["#{", "}"],
        ["{", "}"],
        ["{|", "|}"],
        ["[", "]"],
        ["#[", "]"],
        ["[|", "|]"],
        ["(", ")"],
    ],

    onEnterRules: [
        {
            // e.g. /** | */
            beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
            afterText: /^\s*\*\/$/,
            action: {
                indentAction: _monaco.languages.IndentAction.IndentOutdent,
                appendText: " * ",
            },
        },
        {
            // e.g. /** ...|
            beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
            action: {
                indentAction: _monaco.languages.IndentAction.None,
                appendText: " * ",
            },
        },
        {
            // e.g.  * ...|
            beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
            action: {
                indentAction: _monaco.languages.IndentAction.None,
                appendText: "* ",
            },
        },
        {
            // e.g.  */|
            beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
            action: {
                indentAction: _monaco.languages.IndentAction.None,
                removeText: 1,
            },
        },
    ],

    autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: "|", close: "|" },
        { open: '"', close: '"', notIn: ["string"] },
        { open: "'", close: "'", notIn: ["string", "comment"] },
        { open: "`", close: "`", notIn: ["string", "comment"] },
        { open: "/**", close: " */", notIn: ["string"] },
    ],

    folding: {
        markers: {
            start: new RegExp("^\\s*//\\s*#?region\\b"),
            end: new RegExp("^\\s*//\\s*#?endregion\\b"),
        },
    },
};

const tsLanguage = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: "invalid",
    tokenPostfix: ".ts",

    keywords: [
        "abstract",
        "as",
        "break",
        "case",
        "catch",
        "class",
        "continue",
        "const",
        "constructor",
        "debugger",
        "declare",
        "default",
        "delete",
        "do",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "from",
        "function",
        "get",
        "if",
        "implements",
        "import",
        "in",
        "infer",
        "instanceof",
        "interface",
        "is",
        "keyof",
        "let",
        "module",
        "namespace",
        "never",
        "new",
        "null",
        "package",
        "private",
        "protected",
        "public",
        "readonly",
        "require",
        "global",
        "return",
        "set",
        "static",
        "super",
        "switch",
        "symbol",
        "this",
        "throw",
        "true",
        "try",
        "type",
        "typeof",
        "unique",
        "var",
        "void",
        "while",
        "with",
        "yield",
        "async",
        "await",
        "of",
    ],

    typeKeywords: ["any", "boolean", "number", "object", "string", "undefined"],

    operators: [
        "<=",
        ">=",
        "==",
        "!=",
        "===",
        "!==",
        "=>",
        "+",
        "-",
        "**",
        "*",
        "/",
        "%",
        "++",
        "--",
        "<<",
        "</",
        ">>",
        ">>>",
        "&",
        "|",
        "^",
        "!",
        "~",
        "&&",
        "||",
        "??",
        "?",
        ":",
        "=",
        "+=",
        "-=",
        "*=",
        "**=",
        "/=",
        "%=",
        "<<=",
        ">>=",
        ">>>=",
        "&=",
        "|=",
        "^=",
        "@",
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [{ include: "common" }],

        common: [
            // identifiers and keywords
            [
                /[a-z_$][\w$]*/,
                {
                    cases: {
                        "@typeKeywords": "keyword",
                        "@keywords": "keyword",
                        "@default": "identifier",
                    },
                },
            ],
            [/[A-Z][\w\$]*/, "type.identifier"], // to show class names nicely
            // [/[A-Z][\w\$]*/, 'identifier'],

            // whitespace
            { include: "@whitespace" },

            // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
            [
                /\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
                { token: "regexp", bracket: "@open", next: "@regexp" },
            ],

            // delimiters and operators
            [/[()]/, "@brackets"],

            // #{
            [
                /(#)({)/,
                [
                    { token: "keyword", bracket: "@open" },
                    { token: "delimiter.curly", bracket: "@open" },
                ],
            ],

            // {| and |}
            [
                /({)(\|)/,
                [
                    { token: "delimiter.curly", bracket: "@open" },
                    { token: "keyword", bracket: "@open" },
                ],
            ],
            [
                /(\|)(})/,
                [
                    { token: "keyword", bracket: "@open" },
                    { token: "delimiter.curly", bracket: "@close" },
                ],
            ],

            // { and }
            [/{/, { token: "delimiter.curly", bracket: "@close" }],
            [/}/, { token: "delimiter.curly", bracket: "@close" }],

            // #[
            [
                /(#)(\[)/,
                [
                    { token: "keyword", bracket: "@open" },
                    { token: "delimiter.square", bracket: "@open" },
                ],
            ],

            // [| and |]
            [
                /(\[)(\|)/,
                [
                    { token: "delimiter.curly", bracket: "@open" },
                    { token: "keyword", bracket: "@open" },
                ],
            ],
            [
                /(\|)(\])/,
                [
                    { token: "keyword", bracket: "@open" },
                    { token: "delimiter.curly", bracket: "@close" },
                ],
            ],

            // [ and ]
            [/\[/, { token: "delimiter.square", bracket: "@open" }],
            [/\]/, { token: "delimiter.square", bracket: "@close" }],

            [/[<>](?!@symbols)/, "@brackets"],
            [/!(?=([^=]|$))/, "delimiter"],
            [
                /@symbols/,
                {
                    cases: {
                        "@operators": "delimiter",
                        "@default": "",
                    },
                },
            ],

            // numbers
            [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
            [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
            [/0[xX](@hexdigits)n?/, "number.hex"],
            [/0[oO]?(@octaldigits)n?/, "number.octal"],
            [/0[bB](@binarydigits)n?/, "number.binary"],
            [/(@digits)n?/, "number"],

            // delimiter: after number because of .\d floats
            [/[;,.]/, "delimiter"],

            // strings
            [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
            [/'([^'\\]|\\.)*$/, "string.invalid"], // non-teminated string
            [/"/, "string", "@string_double"],
            [/'/, "string", "@string_single"],
            [/`/, "string", "@string_backtick"],
        ],

        whitespace: [
            [/[ \t\r\n]+/, ""],
            [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"],
        ],

        comment: [
            [/[^\/*]+/, "comment"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"],
        ],

        jsdoc: [
            [/[^\/*]+/, "comment.doc"],
            [/\*\//, "comment.doc", "@pop"],
            [/[\/*]/, "comment.doc"],
        ],

        // We match regular expression quite precisely
        regexp: [
            [
                /(\{)(\d+(?:,\d*)?)(\})/,
                [
                    "regexp.escape.control",
                    "regexp.escape.control",
                    "regexp.escape.control",
                ],
            ],
            [
                /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
                [
                    "regexp.escape.control",
                    { token: "regexp.escape.control", next: "@regexrange" },
                ],
            ],
            [
                /(\()(\?:|\?=|\?!)/,
                ["regexp.escape.control", "regexp.escape.control"],
            ],
            [/[()]/, "regexp.escape.control"],
            [/@regexpctl/, "regexp.escape.control"],
            [/[^\\\/]/, "regexp"],
            [/@regexpesc/, "regexp.escape"],
            [/\\\./, "regexp.invalid"],
            [
                /(\/)([gimsuy]*)/,
                [
                    { token: "regexp", bracket: "@close", next: "@pop" },
                    "keyword.other",
                ],
            ],
        ],

        regexrange: [
            [/-/, "regexp.escape.control"],
            [/\^/, "regexp.invalid"],
            [/@regexpesc/, "regexp.escape"],
            [/[^\]]/, "regexp"],
            [
                /\]/,
                {
                    token: "regexp.escape.control",
                    next: "@pop",
                    bracket: "@close",
                },
            ],
        ],

        string_double: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"/, "string", "@pop"],
        ],

        string_single: [
            [/[^\\']+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/'/, "string", "@pop"],
        ],

        string_backtick: [
            [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
            [/[^\\`$]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/`/, "string", "@pop"],
        ],

        bracketCounting: [
            [/\{/, "delimiter.bracket", "@bracketCounting"],
            [/\}/, "delimiter.bracket", "@pop"],
            { include: "common" },
        ],
    },
};

export const language = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: "invalid",
    tokenPostfix: ".js",

    keywords: [
        "break",
        "case",
        "catch",
        "class",
        "continue",
        "const",
        "constructor",
        "debugger",
        "default",
        "delete",
        "do",
        "else",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "from",
        "function",
        "get",
        "if",
        "import",
        "in",
        "instanceof",
        "let",
        "new",
        "null",
        "return",
        "set",
        "super",
        "switch",
        "symbol",
        "this",
        "throw",
        "true",
        "try",
        "typeof",
        "undefined",
        "var",
        "void",
        "while",
        "with",
        "yield",
        "async",
        "await",
        "of",
    ],
    typeKeywords: [],

    operators: tsLanguage.operators,
    symbols: tsLanguage.symbols,
    escapes: tsLanguage.escapes,
    digits: tsLanguage.digits,
    octaldigits: tsLanguage.octaldigits,
    binarydigits: tsLanguage.binarydigits,
    hexdigits: tsLanguage.hexdigits,
    regexpctl: tsLanguage.regexpctl,
    regexpesc: tsLanguage.regexpesc,
    tokenizer: tsLanguage.tokenizer,
};
