# Setting Up a New Project from Mono Next Nest Template

:::info
This document provides instructions for setting up a new project from the Mono Next Nest Template. Once you've completed the setup process, you can safely delete this file from your project.
:::

## Initial Setup

1. Create and clone your new project:

```bash
git clone https://gitlab.com/your-username/new-project.git
cd new-project
```

2. Add the template as a remote:

```bash
git remote add template https://gitlab.com/tetris973/mono-next-nest-template.git
```

3. Fetch and merge template content:

```bash
git fetch template
git merge template/main --allow-unrelated-histories
```

:::info
The `--allow-unrelated-histories` flag allows merging branches without a common ancestor.
:::

4. Configure Git for large pushes:

:::tip
If `git push origin` fails, try the following configuration:
:::

```bash
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 1000
git config --global http.lowSpeedTime 300
```

5. Push to the new project:

```bash
git push origin main
```

## Updating from Template

1. Fetch template updates:

```bash
git fetch template
```

2. Merge updates:

```bash
git merge template/main
```

3. Resolve conflicts if any.
4. Test changes.
5. Commit and push:

```bash
git commit -m "Merge updates from template"
git push origin main
```

## GitLab Configuration (optional)

1. verify that main branch is protected:
   - Go to Project > Repository > Protected branch
   - The main branch should be protected by default

2. Configure merge request settings:
   - Go to Project > Settings > Merge request
   - In "Squash commits when merging" section, select "Encourage"
   - In "Merge checks", select "Pipeline must succeed"

3. Configure custom CI/CD runners:
   - Go to CI/CD > Runners
   - Disable shared runners to force using custom runners
   - If you have runners already configured for another project, they may appear, you still need to click "Enable for this project"
   - If you don't already have runners or want to configure more -> TODO: Add link to project with Nix config for gitlab runners

## Project Customization

1. Create a new branch:

```bash
git checkout -b init-project
```

2. Replace template references:
   - Replace all occurrences of `tetris973/mono-next-nest-template` with your project path
   - Update the following files (This is may not be a complete list, check for other references):
     - `.gitlab-ci.yml`
     - `package.json`
     - Root `README.md`
     - `Dockerfile.playwright`
     - `build_and_push.sh`
     - `docker-compose.production.yml`
     - `Dockerfile.prod`
     - `docusaurus.config.js`
     - Docusaurus `README.mdx`
     - Docusaurus `getting-started.md`

3. Update project name and descriptions:
   - Replace "Mono next nest template" with your project name
   - Update descriptions in:
     - Root `package.json`
     - Root `README.md`
     - `docusaurus.config.js`
     - Docusaurus `README.mdx`

4. Update license and project identifiers:
   - Replace the content of the LICENSE.txt file with your chosen license
   - Update all references to the license in the project
   - Update root `package.json`: change `license` attribute from MIT to NEW_LICENSE
   - Update root `README.md` and docusaurus `README.mdx`:
     - Change License name from MIT to NEW_LICENSE
     - Update License badge to reflect NEW_LICENSE
   - Replace logo in root `README.md` and docusaurus `README.mdx` with logo for your project

5. Configure GitLab Pages for Docusaurus:
   - Go to your project's GitLab settings
   - Navigate to Deploy > Pages
   - Disable the "Unique Domain" option

6. Follow the getting-started documentation:
   - Follow all the doc of getting started category
   - Build and push Docker images for base and playwright
   - Test the CI pipeline
   - Test production Docker images
   

:::warning
Ensure all template references are updated to avoid confusion and maintain project consistency.
:::
