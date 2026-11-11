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

const oneLineDestructuring = {
  meta: { type: "layout", fixable: "whitespace", messages: { multiline: "Desestruturação sempre em uma linha." }, schema: [] },
  create: (context) => {
    const source = context.sourceCode
    const check = (items) => {
      if (items.length === 0) return
      const open = source.getTokenBefore(items[0], { filter: (token) => token.value === "{" })
      const close = source.getTokenAfter(items.at(-1), { filter: (token) => token.value === "}" })
      if (open.loc.start.line === close.loc.end.line) return
      const isFixable = items.every((item) => item.loc.start.line === item.loc.end.line)
      const text = `{ ${items.map((item) => source.getText(item)).join(", ")} }`
      context.report({ loc: { start: open.loc.start, end: close.loc.end }, messageId: "multiline", fix: isFixable ? (fixer) => fixer.replaceTextRange([open.range[0], close.range[1]], text) : null })
    }
    return {
      ImportDeclaration: (node) => check(node.specifiers.filter((specifier) => specifier.type === "ImportSpecifier")),
      ExportNamedDeclaration: (node) => check(node.specifiers),
      ObjectPattern: (node) => check(node.properties)
    }
  }
}

const internalFolders = "assets|components|hooks|pages|providers|routes|stores|styles|utils"

const babelOptions = (plugins) => ({ requireConfigFile: false, babelOptions: { babelrc: false, configFile: false, parserOpts: { plugins } } })

export default [
  { ignores: ["build", "dist", "node_modules", ".example-project"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: babelOptions(["typescript", "jsx"]),
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: {
      "@stylistic": stylistic,
      local: { rules: { "no-comments": noComments, "one-line-destructuring": oneLineDestructuring } },
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
        { selector: "TSAnyKeyword", message: "any é proibido." },
        { selector: "ImportSpecifier[importKind='type']", message: "Tipos vão no bloco de import type." }
      ],
      "local/no-comments": "error",
      "local/one-line-destructuring": "error",
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
    files: ["**/*.ts"],
    languageOptions: { parserOptions: babelOptions(["typescript"]) }
  },
  {
    files: ["src/utils/functions/logger/**"],
    rules: { "no-console": "off" }
  }
]
