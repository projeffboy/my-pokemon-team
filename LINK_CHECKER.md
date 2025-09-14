# Link Checker Setup

This document describes the automated link checking system for the My Pokemon Team project.

## Overview

The link checker automatically scans all JavaScript and TypeScript files in the `src/` folder to find HTTP/HTTPS URLs and validates that they are accessible. This helps maintain the quality of external references in the codebase.

## Files Added

### 1. `.github/workflows/link-checker.yml`
The main GitHub Actions workflow that:
- Runs automatically on push/PR to main branch (when `src/` files change)
- Runs weekly on Monday at midnight UTC to catch links that break over time
- Can be triggered manually from the GitHub Actions tab
- Extracts URLs using smart regex patterns
- Validates each URL with curl and proper retry logic
- Reports results with detailed logs and artifacts

### 2. `scripts/check-links.sh`  
A standalone bash script that:
- Can be run locally for development and testing
- Uses the same URL extraction and validation logic as the workflow
- Provides detailed console output with progress indicators
- Returns appropriate exit codes for integration with other tools

### 3. `scripts/README.md`
Documentation explaining:
- How the link checker works
- What URLs are checked
- How to run it locally
- How to interpret results

### 4. Updated `package.json`
Added `check-links` npm script for easy local execution:
```bash
npm run check-links
```

## URL Types Detected

The checker finds and validates:
- `href="https://..."` attributes in JSX/HTML elements
- `src="https://..."` attributes for images and resources  
- Plain HTTP/HTTPS URLs in comments and documentation
- External references to:
  - GitHub repositories and issues
  - Reddit posts and discussions
  - Pokemon community sites (Smogon, Bulbapedia, Pokemon Showdown)
  - Educational and development resources
  - Social media and personal websites

## Current Status

- **39 unique URLs** identified across the `src/` folder
- Smart filtering excludes template URLs and incomplete references
- Rate limiting prevents overwhelming external servers
- Comprehensive error reporting distinguishes network issues from broken links

## Usage

### Automatic (Recommended)
The workflow runs automatically - no action needed. Check the Actions tab in GitHub for results.

### Manual Testing
```bash
# Local testing
npm run check-links

# Or directly
./scripts/check-links.sh
```

### Manual Workflow Trigger
1. Go to the GitHub Actions tab
2. Select "Link Checker" workflow  
3. Click "Run workflow"

## Maintenance

The link checker requires minimal maintenance:
- Review weekly automated reports
- Update URL patterns if new link formats are added to the codebase
- Adjust rate limiting or timeout values if needed
- Remove or update URLs that are permanently moved/changed

## Benefits

- ✅ Prevents broken links from being merged into main branch
- ✅ Catches external links that break over time
- ✅ Maintains quality of documentation and references
- ✅ Provides detailed reporting for debugging
- ✅ Respects external servers with appropriate rate limiting