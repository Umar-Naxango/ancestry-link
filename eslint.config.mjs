import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    ignores: ['.next/**', 'node_modules/**'],
    rules: {
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
    },
  },
];

export default config;
