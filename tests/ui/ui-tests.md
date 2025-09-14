This test md file serves as the UI/acceptance tests for this website. There are 4 sections of this site to be tested. Since each section is independent of each other, they will be run independently/separately in a different session (they do not depend on each other):

# Website Sections

## Header

Test that the title is still there and that the two images to its left and right are as well (and that the images are loading properly).

## Main

Leave this blank for now.

## FAB

FAB, or floating action button. This is the button on the bottom right with an icon (if the browser width is large, it is also labelled as Type Chart), make sure it's there. Clicking on it loads three tabs, Table, List, and Infographic. The last tab is selected by default, but if the browser width is medium or higher, table is selected by default. Going to each tab loads an image successfully. And you can exit from the popup dialog.

## Footer

Test each footer element:

- dialog based footer elements: click on the element to load a dialog box, make sure all the links are not broken
  - Manual
  - Credits
  - Updates
  - Privacy Policy
- "Jeffery Tang"
  - should lead to jefferytang.com
- Dark Mode
  - check to see that the system theme/mode matches this theme
  - toggle the switch to make sure it changes theme, then toggle it back to make sure it changes back to the initial theme

# Further Test Details

1. Run this on the development server, should be localhost:3000.
2. Run on safari, chrome, and firefox.
3. For all the sections except "Main", also test on mobile, on android and ios.

# Test Files You Can Modify

Based on the requirements above, you can either modify tests/ui/\*.spec.js or playwright.config.js. Each website section should have its own test file, e.g. for "Header", it would be header-tests.spec.js.
