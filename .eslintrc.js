// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //不检测文件末尾是否有空行
    'eol-last': 0,
    //不检测函数左括号前面的空格
    'space-before-function-paren': 0,
    'arrow-parens': 0,
    //不检测注释空格
    "spaced-comment": 0,
    //可以使用拖尾逗号
    "comma-dangle": 0,
    // "indent": [2, "tab"],
    "keyword-spacing": 0, 
    "no-unused-vars": 0,
    "no-trailing-spaces": 0
  }
}
