---
description: This guide provides examples of how to set up a development environment for this project.
---

# Prerequisites Setup

This guide provides examples of how to set up a development environment for this project. Feel free to use alternative tools that accomplish the same tasks if you prefer.

## Essential Tools

### Package Manager

:::info
For macOS, Homebrew is one option for a package manager.
:::

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

For more information and installation options, visit the [official Homebrew website](https://brew.sh/).

:::tip
For Windows or Linux, you can use any package manager you're comfortable with.
:::

### Version Control System

Git is used in this project for version control.

<details>
<summary>Installation instructions</summary>

For macOS with Homebrew:

```bash
brew install git
```

For other operating systems, refer to the [official Git documentation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
</details>

### Node.js Version Management

One way to manage Node.js versions is with nvm.

<details>
<summary>Setup instructions for macOS</summary>

```bash
brew install nvm
mkdir ~/.nvm
```

Add the following to your shell profile (e.g., ~/.zshrc or ~/.bash_profile):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
```

Then, source your profile:

```bash
source ~/.zshrc  # or source ~/.bash_profile
```
</details>

### Node.js

This project uses a specific Node.js version defined in the `.nvmrc` file.

To use the correct version, run inside root folder:

```bash
nvm use
```

If the specified version isn't installed:

```bash
nvm install
nvm use
```

### Package Manager for Node.js

This project uses pnpm.

```bash
npm install -g pnpm
```

### Environment Variable Management

dotenv-cli is used in this project.

```bash
pnpm add -g dotenv-cli
```

## Containerization

Docker is used for containerization in this project. You can download Docker Desktop from the [official Docker website](https://www.docker.com/products/docker-desktop).

## IDE and Extensions

Visual Studio Code is used in this project. You can download it from the [official VS Code website](https://code.visualstudio.com/).

The following VS Code extensions are used:
- ESLint: JavaScript linter
- JSON Comments (publisher: wxzhang): For viewing comments in JSON files

:::tip
You can install these from the Extensions view in VS Code (Ctrl+Shift+X).
:::

<details>
<summary>Note on JSON Comments extension</summary>

This is an extension that I've found useful for adding documentation to package.json files. While it may not be the ideal solution (other JSON files like TypeScript configs accept comments natively), it's currently the best option I've found for keeping documentation close to the code. 

In my opinion, it's valuable to document package uses and npm script command options, not necessarily describing what the command does (unless it's not explicit from the code), but explaining why certain configurations were chosen. This can be particularly helpful when there are constraints from dependencies that require specific parameters to prevent code breakage.

However, this is just my preference and approach. You're free to use different methods for documentation or even skip this extension if it doesn't align with your workflow.
</details>

## Version Control Platform Setup

This project uses GitLab.

<details>
<summary>Setup instructions</summary>

1. Create a GitLab account if you don't have one
2. Generate an SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
3. Add the SSH key to your GitLab account:
   - Copy the public key:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - In GitLab, go to Settings > SSH Keys, paste your key, and save
</details>

## Verifying Your Setup

You can check if the tools are correctly installed by running these commands:

```bash
git --version
brew --version
nvm --version
node --version
pnpm --version
docker --version
code --version
```

:::caution
If any command is not recognized, you may need to revisit the installation steps for that tool.
:::
