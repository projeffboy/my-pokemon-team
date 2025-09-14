#!/bin/bash

# Local link checker script for testing
# This script can be run locally to test the link checking logic

set -e

echo "=== My Pokemon Team - Link Checker ==="
echo "Extracting and checking HTTP/HTTPS URLs from src folder..."

# Create temporary directory
TEMP_DIR="/tmp/link-checker"
mkdir -p "$TEMP_DIR"

# Files for storing results  
URLS_FILE="$TEMP_DIR/urls.txt"
UNIQUE_URLS_FILE="$TEMP_DIR/unique_urls.txt"
FILTERED_URLS_FILE="$TEMP_DIR/filtered_urls.txt"
FINAL_URLS_FILE="$TEMP_DIR/final_urls.txt"
RESULTS_FILE="$TEMP_DIR/results.txt"

# Initialize files
: > "$URLS_FILE"
: > "$RESULTS_FILE"

echo "Step 1: Extracting URLs from JavaScript/TypeScript files..."

# Find all JS/JSX/TS/TSX files and extract HTTP/HTTPS URLs
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
  echo "  Processing: $file"
  
  # Pattern 1: href="http..." or src="http..."
  grep -hoE '(href|src)=['"'"'"]https?://[^'"'"'"> ]*['"'"'"]' "$file" 2>/dev/null | \
    sed -E 's/(href|src)=['"'"'"]//' | \
    sed -E 's/['"'"'"]$//' >> "$URLS_FILE" || true
  
  # Pattern 2: Plain HTTP URLs in comments and strings
  grep -hoE 'https?://[a-zA-Z0-9./?#_&=%-]+' "$file" 2>/dev/null >> "$URLS_FILE" || true
done

# Remove duplicates and sort
sort "$URLS_FILE" | uniq > "$UNIQUE_URLS_FILE"

# Filter out problematic or partial URLs
grep -v "https://cdn.intergient.com/" "$UNIQUE_URLS_FILE" > "$FILTERED_URLS_FILE" || cp "$UNIQUE_URLS_FILE" "$FILTERED_URLS_FILE"
grep -v "https://play.pokemonshowdown.com/sprites/$" "$FILTERED_URLS_FILE" > "$FINAL_URLS_FILE" || cp "$FILTERED_URLS_FILE" "$FINAL_URLS_FILE"

echo "Step 2: Found $(wc -l < "$FINAL_URLS_FILE") URLs to check:"
cat "$FINAL_URLS_FILE"

echo -e "\nStep 3: Checking each URL for availability..."

failed_links=0
total_links=0
skipped_links=0

while IFS= read -r url; do
  if [[ -n "$url" ]]; then
    total_links=$((total_links + 1))
    echo "Checking [$total_links]: $url"
    
    # Skip partial or template URLs that can't be checked
    if [[ "$url" =~ \$\{.+\} ]] || [[ "$url" == *"category" ]] && [[ ! "$url" == *"category=vgc" ]]; then
      echo "⚠ $url - SKIPPED (template/partial URL)" | tee -a "$RESULTS_FILE"
      skipped_links=$((skipped_links + 1))
      continue
    fi
    
    # Use curl with retries and reasonable timeouts
    http_code=$(curl -L --max-time 30 --retry 3 --retry-delay 2 -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [[ "$http_code" =~ ^[23] ]]; then
      echo "✓ $url - OK ($http_code)" | tee -a "$RESULTS_FILE"
    elif [[ "$http_code" == "000" ]]; then
      echo "✗ $url - FAILED (connection error)" | tee -a "$RESULTS_FILE"
      failed_links=$((failed_links + 1))
    else
      echo "✗ $url - FAILED ($http_code)" | tee -a "$RESULTS_FILE"
      failed_links=$((failed_links + 1))
    fi
    
    # Small delay to be respectful to servers
    sleep 2
  fi
done < "$FINAL_URLS_FILE"

echo -e "\n=== FINAL RESULTS ==="
echo "Total URLs processed: $total_links"
echo "URLs checked: $((total_links - skipped_links))"
echo "URLs skipped: $skipped_links"
echo "URLs failed: $failed_links"

echo -e "\n=== DETAILED RESULTS ==="
cat "$RESULTS_FILE"

# Return appropriate exit code
if [[ $failed_links -gt 0 ]]; then
  echo -e "\n❌ Found $failed_links broken links!"
  exit 1
else
  checked_links=$((total_links - skipped_links))
  echo -e "\n✅ All $checked_links checked links are working correctly! ($skipped_links skipped)"
  exit 0
fi