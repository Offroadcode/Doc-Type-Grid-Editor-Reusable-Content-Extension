# Doc Type Grid Editor Reusable Content Extension &middot; ![version](https://img.shields.io/badge/version-1.0.0-green.svg) [![our umbraco](https://img.shields.io/badge/our-umbraco-orange.svg)](https://our.umbraco.org/projects/backoffice-extensions/doctype-grid-editor-reusable-content-extension/)

**Note:** [Doc Type Grid Editor](https://our.umbraco.org/projects/backoffice-extensions/doc-type-grid-editor) swapped from using the old dialog panels to the newer overlays in v0.5. As a result, DTGERCE v1.0 is not compatible with any version of DTGE from that version onward. An update is in the works that is compatible with the newer DTGE.

An extension of the [Doc Type Grid Editor](https://our.umbraco.org/projects/backoffice-extensions/doc-type-grid-editor) to make it easy to export, import, and link doc type grid content with nodes in the content tree.

Using the grid is one of the best content experiences an editor can have, but there's still some frustrations. Copying and pasting content for use on multiple pages is one that we want to eliminate. We've added a few features to Matt & Lee's already exceptional package to take this up a notch. With the DTGERCE (check out that acronym!), you can:

* Save content from the grid directly to a new node for reuse later.
* Import content from a node into the grid to be edited into unique content that's close but not the same as the original.
* Link a content node into the grid to pull the node from that content instead of the DTGE content.
* Toggle in between any of these three options at will.

## Installation & Use

You can install the selected release through the Umbraco package installer or [download and install locally from Our](https://our.umbraco.org/projects/backoffice-extensions/doctype-grid-editor-reusable-content-extension/).

This package requires the [Doc Type Grid Editor](https://our.umbraco.org/projects/backoffice-extensions/doc-type-grid-editor) package (v0.4.0) to be already installed, as it extends its functionality.

You can use the import and export functionality of this package with no further work on your part. But for any doc types you wish to be able to use as grid content that can link to a content node (allowing such grid areas to automatically update when you update a linked node) you must add a label property with the alias 'dtgeLinkedId' to them. This will make the 'Link to Node' button work.

You will also need to make a small modification to your existing DocType Grid Editor partial views to call either the content from the node or the content from the grid, depending on what's selected. Further instructions in this [example gist](https://gist.github.com/naepalm/05bf4c97730e6d0b5d135846dd830808).

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

