# Bookmarkletify

Convert JavaScript to Bookmarklet.

## Features

- Minify
- encodeURIComponent()
- Wrap in `javascript:(()=>{` and `})();`
- Copy to clipboard or create new file

## Installation

<https://marketplace.visualstudio.com/items?itemName=saasan.bookmarkletify>

## Usage

1. Open JavaScript file
1. Open Command Palette
   - Windows / Linux: <kbd>Ctrl + Shift + P</kbd>
   - macOS: <kbd>Command + Shift + P</kbd>
1. Type `Bookmarkletify`
1. Select `Bookmarkletify: Copy to Clipboard` or `Bookmarkletify: New File`

## Settings

- `bookmarkletify.protocol`: Controls the protocol given before JavaScript.
- `bookmarkletify.prefix`: Controls the string given before JavaScript.
- `bookmarkletify.suffix`: Controls the string given after JavaScript.

## Release Notes

### 1.0.0

- Changed minifier from UglifyJS to terser
- Added Settings

### 0.0.1

- Initial release
