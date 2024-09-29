---
sidebar_position: 1
title: Commit Message Format
description: Guidelines for formatting commit messages in our project
---

# Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**. The header has a special format that includes a **type**, a **scope**, and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

:::important
The **header** is mandatory and the **scope** of the header is optional.
:::

:::caution
Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.
:::

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

## Samples

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

## Message Components

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body, it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

| Type | Description |
|------|-------------|
| **build** | Changes that affect the build system or external dependencies |
| **ci** | Changes to our CI configuration files and scripts |
| **docs** | Documentation only changes |
| **feat** | A new feature |
| **fix** | A bug fix |
| **perf** | A code change that improves performance |
| **refactor** | A code change that neither fixes a bug nor adds a feature |
| **style** | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| **test** | Adding missing tests or correcting existing tests |

### Scope

The scope should be the name of the module affected (as perceived by the person reading the changelog generated from commit messages).

Supported scopes:

- **auth**
- **chat**
- **account**

:::note
There are currently a few exceptions to the "use package name" rule:

- **packaging**: used for changes that change the npm package layout in all of our packages
- **changelog**: used for updating the release notes in CHANGELOG.md
- **aio**: used for docs-app (angular.io) related changes within the /aio directory of the repo
- none/empty string: useful for `style`, `test`, and `refactor` changes that are done across all packages
  :::

### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

:::danger
**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.
:::

## Best Practices

To ensure your commit messages are consistent and informative:

1. Keep the subject line concise (50 characters or less)
2. Use the body to explain what and why vs. how
3. Reference issues and pull requests liberally after the first line

By following these guidelines, you'll create a more useful commit history that helps your team understand changes over time.
