module.exports = {
    watchFolders: [__dirname],
    resolver: {
      blacklistRE: /node_modules\/.*\/node_modules\/react-native\/.*/,
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  };