export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest',  // Use Babel to transpile JS files
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
    transformIgnorePatterns: [
      "node_modules/(?!your-es-module-package/)"
    ],
  };
  