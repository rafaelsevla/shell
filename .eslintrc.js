module.exports = {
  root: true,
  extends: [ '@react-native-community' ],
  parser: '@typescript-eslint/parser',
  plugins: [ '@typescript-eslint' ],
  rules: {
    quotes: [ 'error', 'single' ],
    'jsx-quotes': [ 'error', 'prefer-single' ],
    'prettier/prettier': 0,
    'comma-dangle': [ 'error', 'only-multiline' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'arrow-parens': [ 'error', 'always' ],
    curly: [ 'error', 'multi-line' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    'space-before-function-paren': [ 'error', 'always' ],
    radix: [ 'error', 'as-needed' ],
    'react/react-in-jsx-scope': 'off'
  },
};
