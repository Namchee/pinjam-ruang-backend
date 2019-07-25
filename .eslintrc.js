module.exports = {
  'env': {
    'node': true,
    'es6': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'google',
    'prettier'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    // let babel handle this
    'node/no-unsupported-features/es-syntax': 'off',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    '@typescript-eslint/indent': [
      'error',
      2,
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-invalid-this': 'off',
    // in favor of jsdoc plugin
    'valid-jsdoc': 'off',
  },
  'settings': {
    'jsdoc': {
      'tagNamePreference': {
        'returns': 'return',
        'augments': 'extends',
      }
    }
  },
};
