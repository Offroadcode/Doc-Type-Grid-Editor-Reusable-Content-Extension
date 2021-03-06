# Doc Type Grid Editor Reusable Content Extension &middot; ![version](https://img.shields.io/badge/version-2.0.0-green.svg) [![our umbraco](https://img.shields.io/badge/our-umbraco-orange.svg)](https://our.umbraco.org/projects/backoffice-extensions/doctype-grid-editor-reusable-content-extension/)

An extension of [Umco's](http://weareumco.com/) excellent [Doc Type Grid Editor](https://our.umbraco.org/projects/backoffice-extensions/doc-type-grid-editor) to make it easy to export, import, and link doc type grid content with nodes in the content tree.

**DTGERCE v2.0.0 has been tested for compatibility with Doc Type Grid Editor v0.6+**  
 _(For users of older versions of the Doc Type Grid Editor, v1.0.0 of DTGERCE is compatible with v0.4.)_

## What Does It Do?

Using the grid is one of the best content experiences an editor can have, but there's still some frustrations. Copying and pasting content for use on multiple pages is one that we want to eliminate. We've added a few features to Matt & Lee's already exceptional package to take this up a notch. With the DTGERCE (check out that acronym!), you can:

### Export Grid Content Directly To A New Node

![export-steps](https://user-images.githubusercontent.com/4752923/61488767-9287b080-a998-11e9-8b5f-6ca610c2bf94.png)

Save content from the grid directly to a new node for reuse later!

### Import Grid Content From Another Content Node

![import-steps](https://user-images.githubusercontent.com/4752923/61489313-f363b880-a999-11e9-85b6-16d307278988.png)

Import content from a node into the grid to be edited into unique content that's close but not the same as the original.

### Link A Content Node To The Grid

![link-steps](https://user-images.githubusercontent.com/4752923/61489881-3e320000-a99b-11e9-9e05-a29763ae99c4.png)

Link a content node into the grid to pull the node from that content instead of the DTGE content.

## Installation & Use

You can install the selected release through the Umbraco package installer or [download and install locally from Our](https://our.umbraco.org/projects/backoffice-extensions/doctype-grid-editor-reusable-content-extension/).

This package requires the [Doc Type Grid Editor](https://our.umbraco.org/projects/backoffice-extensions/doc-type-grid-editor) package (v0.6+) to be already installed, as it extends its functionality.

### Important Instructions For Link Functionality!

You can use the import and export functionality of this package with no further work on your part. But for any doc types you wish to be able to use as grid content that can link to a content node (allowing such grid areas to automatically update when you update a linked node) you must add a label property with the alias 'dtgeLinkedId' to them. This will make the 'Link to Node' button work.

#### Example Code For Linking

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

