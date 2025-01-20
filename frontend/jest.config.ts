// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '@/(.*)': '<rootDir>/src/$1',
    '@headlessui/react': '<rootDir>/node_modules/@headlessui/react',
    '@heroicons/react/(.*)': '<rootDir>/node_modules/@heroicons/react/$1',
    '@mui/(.*)': '<rootDir>/node_modules/@mui/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@headlessui|@heroicons)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
