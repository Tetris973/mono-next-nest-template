# Troubleshooting

This section contains common issues and their solutions that don't fit into specific categories. When new issues arise that don't belong to existing categories, they should be added here or to other files in this category before finding a more fitting category.

## Specific Element Troubleshooting

When looking for, using, or updating troubleshooting information, verify that it does not already exist in these sections:

- [Testing Troubleshooting](../getting-started/testing#troubleshooting)
- [API Testing Troubleshooting](../getting-started/api-testing#troubleshooting)

## Common Issues

### Storybook package nextjs not found Errors

:::info
Currently, the project uses a pnpm patch to modify the NextJS package and add a custom HTTP logger. This patch causes Storybook to display errors on startup, preventing components from being displayed.
:::

#### Workaround

Follow these steps to temporarily resolve the Storybook issues:

1. Remove the patch from the root `package.json` file.
2. Run `pnpm i` to reinstall dependencies without the patch.
3. Start Storybook.
4. After finishing with Storybook, revert the changes to `package.json`.
5. Run `pnpm i` again to reinstall dependencies with the patch.
6. Verify that the lockfile includes the patch.

:::caution
Be careful not to commit the changes that remove the patch, especially the lockfile!
:::

### Storybook Hot Reload Not Working

:::info
When using Storybook in Chrome (`npm run storybook`), hot reload does not work. Components may load indefinitely, and reloading the page can also get stuck.
:::

#### Workaround

Use Firefox to access the Storybook website. Hot reload works as expected.