// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    ['@babel/preset-typescript', { 
      isTSX: true, 
      allExtensions: true,
      allowDeclareFields: true,
      allowNamespaces: true,
      onlyRemoveTypeImports: true
    }]
  ],
};