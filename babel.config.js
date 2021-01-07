module.exports = function (api) {
  api.cache(false)

  const presets = [
    [
      "@babel/preset-env", {
        modules: false
      }
    ],
    '@babel/preset-react',
  ]
  const plugins = [
    '@babel/plugin-syntax-dynamic-import'
  ]

  return {
    presets,
    plugins
  }
}