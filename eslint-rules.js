module.exports = {
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  "@typescript-eslint/no-unused-vars": ["error", { "ignoreRestSiblings": true }],
  "prefer-const": ["error", {
    "destructuring": "any",
    "ignoreReadBeforeAssign": true
  }],
  "no-object-constructor": "error",
  "object-shorthand": ["error", "always"],
  // { "keywords": true } not used because it conflicts with current code
  "quote-props": ["error", "as-needed", { "numbers": true }],
  "no-prototype-builtins": "error",
  "prefer-object-spread": "error",
  "no-array-constructor": "error",
  "array-callback-return": ["error", { checkForEach: true }],
  //"prefer-destructuring": DISABLED - Causes more complexity than it solves
  "quotes": ["error", "single", {
    "avoidEscape": true // Enable to use double quotes for strings with single quotes inside
  }],
  "prefer-template": "error",
  "template-curly-spacing": "error",
  "no-eval": "error",
  "no-useless-escape": "error",
  //"func-style": NOT USED - Both style can be used depending the context, newer ESCMA version auto name lambda functions, causes more complexity.
  "no-loop-func": "error",
  // !prefer-rest-params should not be used in ES3/5 environments!
  "prefer-rest-params": "error",
  "default-param-last": ["error"],
  "no-new-func": "error",
  "space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
  "space-before-blocks": "error",
  // props: false should be kept, otherwise the rule is very strict and dissalow some common patterns (express req, ..;) like req.body = {something}
  "no-param-reassign": ["error", { "props": false }],
  // !prefer-spread should not be used in ES3/5 environments!
  "prefer-spread": "error",
  // function-paren-newline: Not use as it conflics with prettier line length that auto line break.
  "prefer-arrow-callback": "error",
  "arrow-spacing": "error",
  // "arrow-parens": already present from prettier
  // "no-confusing-arrow": already present from prettier
  // implicit-arrow-linebreak: already present from prettier
  // "no-useless-constructor": Can't be used because of conflict with NestJs dependency injection
  // no-dupe-class-members: Already handled by TypeScript
  // class-methods-use-this Can't be used because NestJs way of doing everything with classes, controller have function that do not use this keyword!
  // Can be helpful to activcate some time to imrove code
  //"class-methods-use-this": ["warn", { "enforceForClassFields": true }],
  "no-duplicate-imports": ["error", { "includeExports": true }],
  "no-restricted-imports": [
    "error",
    {
      "patterns": [
        {
          "group": ["../"],
          "message": "Only import ./ , or typescript alias, or absolute path allowed"
        }
      ]
    }
  ],
  "no-iterator": "error",
  "generator-star-spacing": ["error", {
    "before": false,
    "after": true,
    "method": { "before": true, "after": false }
  }],
  "dot-notation": "error",
  "prefer-exponentiation-operator": "error",
  "one-var": ["error", "never"],
  "no-multi-assign": "error",
  "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
  // "operator-linebreak": conflict with prettier
  "no-use-before-define": ["error", {
    "functions": true,
    "classes": true,
    "variables": true,
    "allowNamedExports": false
  }],
  eqeqeq: ["error", "always"],
  "no-case-declarations": "error",
  "no-nested-ternary": "error",
  "no-unneeded-ternary": ["error", { "defaultAssignment": false }],
  "no-mixed-operators": [
    "error",
    {
      /**
       * @description
       * Custom configuration for the 'no-mixed-operators' rule:
       * - Rules for bitwise, comparison, and logical operators remain unchanged from ESLint defaults.
       * - Rules for arithmetic operators are more permissive, specifically targeting cases involving '**' and '%'.
       * 
       * @see https://github.com/airbnb/javascript/issues/1071
       * 
       * @rationale
       * This configuration was implemented because:
       * 1. Prettier was automatically removing necessary parentheses, causing conflicts.
       * 2. Excessive use of '// prettier-ignore' comments was required to maintain desired behavior.
       * 
       * @benefit
       * This setup allows for handling more complex cases while reducing the need for '// prettier-ignore' comments.
       * It strikes a balance between code clarity and practical formatting concerns.
       */
        "groups": [
          ["%", "**"],
          ["%", "+"],
          ["%", "-"],
          ["%", "*"],
          ["%", "/"],
          ["**", "+"],
          ["**", "-"],
          ["**", "*"],
          ["**", "/"],
          ["&", "|", "^", "~", "<<", ">>", ">>>"], // Bitwise operators
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="], // Comparison operators
          ["&&", "||"], // Logical operators
          ["in", "instanceof"],
        ],
        "allowSamePrecedence": true
    }
],
  // "nonblock-statement-body-position": Conflict/Already managed by eslint/prettier plugin
  // brace-style: Already managed by prettier
  "no-else-return": "error",
  "spaced-comment": ["error", "always"],
  // "indent": Conflict, Managed by prettier
  "no-new-wrappers": "error",
  "radix": "error",
  "camelcase": ["error", {
    "properties": "always",
    "ignoreDestructuring": true,
    "ignoreImports": true,
    "ignoreGlobals": false,
    "allow": []
  }],
  // Only require that function called with new must start with capital letter
  // If capIsNew is set to true then major part of the code will be flagged as error because of @Decorator, @Injectable, @Module, ...
  "new-cap": ["error", { "capIsNew": false }],
  "no-underscore-dangle": "error",
  "no-restricted-globals": [
    "error",
    {
      "name": "isNaN",
      "message": "Use Number.isNaN instead of isNaN."
    },
    {
      "name": "isFinite",
      "message": "Use Number.isFinite instead of isFinite."
    }
  ]
};
