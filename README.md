# Setup for a NodeJS project with Typescript

## How to install

1. Clone this repository
2. Run `npm install`
3. Run `npm run prepare` to install the husky hooks

## How to Use

**Commands**:

- `npm start`: to run on prod mode
- `npm run dev`: to run on development mode
- `npm run test` to run tests
- `npm run test:watch` to run tests on watch mode
- `npm run format`: to format src folder with prettier
- `npm run lint`: to analyze code and fix problems in src folder with eslint

**Git Hooks**

- `commit-msg`: check if commit message satisfies the commitlint standard, otherwise the commit cannot be done.
- `pre-commit`: check if files in src are error free according to the eslint rules, otherwise the commit cannot be done.
- `pre-push`: runs the tests, but if the tests fail the push to remote repository cannot be done.

## Third-party libraries

- [TypeScript](https://www.typescriptlang.org/): TypeScript is a strongly typed programming language that builds on JavaScript.
- [eslint](https://eslint.org/): code static analyzer to quickly find problems.
- [prettier](https://prettier.io/): code formatter with support for many languages.
- [jest](https://jestjs.io/): delightful JavaScript Testing Framework with a focus on simplicity.
- [commitlint](https://commitlint.js.org/): lint commit messages.
- [husky](https://typicode.github.io/husky/): modern native git hooks made easy.
- [ts-node-dev](https://github.com/wclr/ts-node-dev): development tool for Node.js compatible with typescript that automatically restarts the node process when a file is modified.
