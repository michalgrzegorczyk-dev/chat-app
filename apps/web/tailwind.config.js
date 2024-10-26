const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

// TODO: why tailwind doesn't work by default?
// https://stackoverflow.com/questions/72360817/nx-workspace-tailwind-is-not-working-in-the-libaries
// probably __dirname is not working as expected, because i added custom web folder

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), //todo is it useful?
    join('web/**/!(*.stories|*.spec).{ts,html}'), //todo added this line
    join('libs/**/!(*.stories|*.spec).{ts,html}'), //todo added this line
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0eefa',
          100: '#d8d1f5',
          200: '#9370DB',
          500: '#7B68EE',
          600: '#6A5ACD',
          700: '#6050CB'
        },
        danger: {
          100: '#FFA8A3',
          200: '#FF7066',
          300: '#FF5A5F'
        }
      }
    }
  },
  plugins: []
};
