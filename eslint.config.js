import perfectionist from "eslint-plugin-perfectionist"
import reactHooks from "eslint-plugin-react-hooks"
import stylistic from "@stylistic/eslint-plugin"
import babelParser from "@babel/eslint-parser"
import globals from "globals"
import js from "@eslint/js"

const noComments = {
  meta: { type: "suggestion", messages: { forbidden: "Comentários são proibidos: o código precisa ser autoexplicativo." }, schema: [] },
  create: (context) => ({
    Program: () => context.sourceCode.getAllComments().forEach((comment) => context.report({ loc: comment.loc, messageId: "forbidden" }))
  })
}

const internalFolders = "assets|components|hooks|pages|providers|routes|stores|styles|utils"

export default [
  { ignores: ["build", "dist", "node_modules"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          parserOpts: { plugins: ["typescript", "jsx"] }
        }
      },
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: {
      "@stylistic": stylistic,
      local: { rules: { "no-comments": noComments } },
      perfectionist,
      "react-hooks": reactHooks
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-redeclare": "off",
      "no-console": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "no-restricted-syntax": [
        "error",
        { selector: "VariableDeclaration[kind='let']", message: "Use const: sem let." },
        { selector: "VariableDeclaration[kind='var']", message: "Use const: sem var." },
        { selector: "ForStatement, ForInStatement, ForOfStatement", message: "Sem for: use map, filter, reduce e spread." },
        { selector: "WhileStatement, DoWhileStatement", message: "Sem while: use map, filter, reduce e spread." },
        { selector: "TSAnyKeyword", message: "any é proibido." }
      ],
      "local/no-comments": "error",
      "@stylistic/semi": ["error", "never"],
      "@stylistic/quotes": ["error", "double", { allowTemplateLiterals: "avoidEscape" }],
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0, maxBOF: 0 }],
      "@stylistic/object-curly-newline": ["error", { ImportDeclaration: "never", ExportDeclaration: "never", ObjectPattern: "never" }],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "line-length",
          order: "desc",
          internalPattern: [`^@(${internalFolders})(/.*)?$`],
          groups: [
            ["value-builtin", "value-external", "side-effect", "side-effect-style", "unknown"],
            ["value-internal", "value-parent", "value-sibling", "value-index"],
            "type-import"
          ],
          sortSideEffects: true,
          newlinesBetween: 1
        }
      ],
      ...reactHooks.configs.recommended.rules
    }
  },
  {
    files: ["src/utils/functions/logger/**"],
    rules: { "no-console": "off" }
  }
]
