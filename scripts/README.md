# Link Checker

This directory contains tools to check for broken links in the My Pokemon Team project.

## GitHub Actions Workflow

The project includes a GitHub Actions workflow (`.github/workflows/link-checker.yml`) that automatically:

- ✅ Scans all JavaScript/TypeScript files in the `src/` folder for HTTP/HTTPS URLs
- ✅ Checks each URL for availability 
- ✅ Reports broken links as workflow failures
- ✅ Runs automatically on:
  - Push to main/master branch (when `src/` files change)
  - Pull requests to main/master branch (when `src/` files change)  
  - Weekly schedule (Mondays at midnight UTC)
  - Manual trigger via GitHub Actions UI

## Local Testing

You can also run the link checker locally using the provided script:

```bash
# Make sure you're in the project root directory
./scripts/check-links.sh
```

## What URLs are Checked

The link checker automatically finds and validates:

- `href="https://..."` attributes in JSX/HTML elements
- `src="https://..."` attributes for images and resources
- Plain HTTP/HTTPS URLs in comments and code
- URLs from external services like:
  - GitHub repositories and issues
  - Reddit posts and comments
  - Pokemon/gaming resources (Smogon, Bulbapedia, Pokemon Showdown)
  - Educational and documentation sites
  - Social media and personal websites

## Configuration

The checker includes smart filtering to:
- Skip template URLs with variables (`${...}`)
- Skip incomplete URLs that can't be validated
- Ignore CDN URLs that require dynamic parameters
- Add reasonable delays between requests to be respectful to servers

## Results

- ✅ **Green status**: All links are working
- ❌ **Red status**: One or more broken links found
- ⚠️  **Warnings**: Some URLs were skipped (template/partial URLs)

When links are broken, check the workflow logs for detailed information about which URLs failed and their HTTP response codes.