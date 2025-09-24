module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config'],
  rules: {
    // Add any custom rules here
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': 'warn'
  }
}
