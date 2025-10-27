# Version Management Guide

## Semantic Versioning

Follow [SemVer](https://semver.org/): `MAJOR.MINOR.PATCH`

- **PATCH** (0.1.0 → 0.1.1): Bug fixes, small improvements
- **MINOR** (0.1.0 → 0.2.0): New features, backward compatible
- **MAJOR** (0.1.0 → 1.0.0): Breaking changes

## Quick Version Bump

```bash
cd packages/agentpress-nextjs

# Patch: Bug fixes
npm version patch

# Minor: New features
npm version minor

# Major: Breaking changes
npm version major
```

This automatically:

- Updates `package.json`
- Creates a git commit
- Creates a git tag

## Publishing Workflow

```bash
# 1. Make your changes
git add .
git commit -m "feat: add new feature"

# 2. Bump version (auto commits and tags)
npm version minor

# 3. Run type check
bun run build

# 4. Publish
npm publish

# 5. Push changes and tags
git push && git push --tags
```

## Version Examples

### Patch (0.1.0 → 0.1.1)

- Fixed type error in AgentpressChat
- Updated README documentation
- Fixed CLI bug

### Minor (0.1.0 → 0.2.0)

- Added new `AgentpressSettings` component
- Added support for custom themes
- Added new CLI flag `--watch`

### Major (0.1.0 → 1.0.0)

- Changed `authToken` prop to required
- Removed deprecated `ChatInput` export
- Renamed `Method` type to `APIMethod`

## Breaking Changes Checklist

When making breaking changes (major version):

- [ ] Update README with migration guide
- [ ] Add deprecation warnings in previous version
- [ ] Document all breaking changes
- [ ] Provide code migration examples
- [ ] Consider a `MIGRATION.md` file

## Pre-release Versions

For testing before stable release:

```bash
# Alpha (0.2.0-alpha.0)
npm version preminor --preid=alpha

# Beta (0.2.0-beta.0)
npm version preminor --preid=beta

# Publish as next
npm publish --tag next
```

Install with:

```bash
bun add agentpress-nextjs@next
```

## Rollback

If you need to unpublish (within 72 hours):

```bash
# Unpublish specific version
npm unpublish agentpress-nextjs@0.2.0

# Or deprecate instead (recommended)
npm deprecate agentpress-nextjs@0.2.0 "Please use 0.2.1 instead"
```

## Version History Tracking

Consider creating a `CHANGELOG.md`:

```markdown
# Changelog

## [0.2.0] - 2025-10-27

### Added

- New AgentpressSettings component
- Custom theme support

### Fixed

- Type errors in badge component

## [0.1.0] - 2025-10-26

### Added

- Initial release
- AgentpressChat component
- CLI tool
```

## Automation with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: cd packages/agentpress-nextjs && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then just push tags to trigger:

```bash
git tag v0.2.0
git push origin v0.2.0
```
