# Doc Type Grid Editor Reusable Content Extension &middot; ![version](https://img.shields.io/badge/version-1.0.0-green.svg) [![our umbraco](https://img.shields.io/badge/our-umbraco-orange.svg)](https://our.umbraco.org/projects/backoffice-extensions/doctype-grid-editor-reusable-content-extension/)

An extension of the [Doc Type Grid Editor](https://our.umbraco.org/projects/backoffice-extensions/doc-type-grid-editor) to make it easy to export, import, and link doc type grid content with nodes in the content tree.

## Installation & Use

You can install the selected release through the Umbraco package installer or [download and install locally from Our](https://our.umbraco.org/projects/backoffice-extensions/doctype-grid-editor-reusable-content-extension/).

This package requires the [Doc Type Grid Editor](https://our.umbraco.org/projects/backoffice-extensions/doc-type-grid-editor) package (v0.4.0) to be already installed, as it extends its functionality.

You can use the import and export functionality of this package with no further work on your part. But for any doc types you wish to be able to use as grid content that can link to a content node (allowing such grid areas to automatically update when you update a linked node) you must add a label property with the alias 'dtgeLinkedId' to them. This will make the 'Link to Node' button work.

## Questions?

If you have questions, feel free to ask them [here](https://github.com/Offroadcode/Doc-Type-Grid-Editor-Reusable-Content-Extension/issues).

## Contribute

Want to contribute to the Doc Type Grid Editor Reusable Content Extension package? You'll want to use Grunt (our task runner) to help you integrate with a local copy of Umbraco.

### Install Dependencies
*Requires Node.js to be installed and in your system path*

    npm install -g grunt-cli && npm install -g grunt
    npm install

### Build

    grunt

Builds the project to /dist/. These files can be dropped into an Umbraco 7 site, or you can build directly to a site using:

    grunt --target="D:\inetpub\mysite"

You can also watch for changes using:

    grunt watch
    grunt watch --target="D:\inetpub\mysite"

If you want to build the package file (into a pkg folder), use:

    grunt umbraco

