This test md file outlines the UI tests for this website. There are 4 major UI sections of this site.

# Website Sections to Be Tested

## Header

Test that the title is still there and that the two images to its left and right are as well (and that the images are loading properly).

## Main

Look at `./main/` for more info.

## FAB

FAB, or floating action button. This is the button on the bottom right with a TableChart icon, expect it to be there. Clicking on it loads three tabs, Table, List, and Infographic. Going to each tab loads an image successfully. And you can exit from the popup dialog.

## Footer

Test each footer element:

- dialog based footer elements: click on the element to load a dialog box
  - Manual
  - Credits
  - Updates
  - Privacy Policy
- "Jeffery Tang"
  - should lead to jefferytang.com
- Dark Mode
  - check to see that the system theme/mode matches this theme
  - toggle the switch to expect it changes theme, then toggle it back to expect it changes back to the initial theme

# Test Files You Can Modify

Based on the requirements above, you can either modify tests/ui/\*.spec.js or playwright.config.js. Each website section should have its own test file, e.g. for "Header", it would be header-tests.spec.js.
