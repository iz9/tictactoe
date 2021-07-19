const fs = require('fs')
const path = require('path')

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
)

module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier', '@typescript-eslint/eslint-plugin'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'prettier/prettier': ['warn', prettierOptions],
      },
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
    },
  ],
}
