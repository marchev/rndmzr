module.exports = {
  pages: {
    options: {
      template: 'public/index.html',
      entry: './src/options/main.js',
      title: 'Options'
    },
    standalone: {
      template: 'public/index.html',
      entry: './src/standalone/main.js',
      title: 'rndmzr',
      filename: 'index.html'
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        }
      }
    }
  },
  configureWebpack: {
    devtool: 'cheap-module-source-map'
  }
}
