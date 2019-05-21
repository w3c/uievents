# UI Events

This repository is for the [UI Events specification](https://w3c.github.io/uievents/) (formerly known as DOM 3 Events).

## Goals

The goal of the UI/DOM Events sub-group, part of the Web Applications Working Group, is to complete the
UI Events specification according to market needs, to drive its adoption and implementation, to provide
a comprehensive test suite (for implementability at least, and hopefully for interoperability, too),
and to move it along the Recommendation Track to W3C Recommendation status.

## Communication

For discussion of matters related to DOM Events, the group uses the www-dom@w3.org mailing list ([archive](http://lists.w3.org/Archives/Public/www-dom/)).

## Documents

* Published Documents
    * [UI Events - Last Published WD](http://www.w3.org/TR/uievents/)
    * [DOM Level 3 KeyboardEvent key Values](http://www.w3.org/TR/DOM-Level-3-Events-key/)
    * [DOM Level 3 KeyboardEvent code Values](http://www.w3.org/TR/DOM-Level-3-Events-code/)
* Editor's Drafts
    * [UI Events](https://w3c.github.io/uievents/)
    * [UI Events KeyboardEvent key Values](https://w3c.github.io/uievents-key/)
    * [UI Events KeyboardEvent code Values](https://w3c.github.io/uievents-code/)

## Open Issues

* [UI Events Issues Database](https://github.com/w3c/uievents/issues)
   * Need for detailed review by implementors
   * Need for comprehensive test suite
* [key Values Issues](https://github.com/w3c/uievents-key/issues)
* [code Values Issues](https://github.com/w3c/uievents-code/issues)

## Building

This spec was created using [bikeshed](https://github.com/tabatkins/bikeshed).
If you would like to contribute edits, please make sure that your changes
build correctly.

To **build** this spec:

1. Clone this repo into a local directory.
1. Install [bikeshed](https://github.com/tabatkins/bikeshed)
1. Run `python build.py` in your local directory.

To **make edits** to the spec:

1. Edit the `index.bs` file or any of the `sections\*.txt` files.
2. Build (as above). This will create a `sections\*.include` file for each
    `*.txt` file and then create the `index.html`.

When submitting pull requests, make sure you don't include any of the
`sections\*.include` files in your changelist — they've all been added to the
`.gitignore` file so that you don't include them accidentally. All changes
should be made in the `sections\*.txt` files and `index.bs`.

## Testing

* [UI Events Testing Tools](https://w3c.github.io/uievents/tools/main.html)
* Web Platform Tests
   * [GitHub web-platform-tests/wpt uievents](https://github.com/web-platform-tests/wpt/tree/master/uievents)
   * Tests are mirrored at w3c-test.org:
      * [uievents](http://w3c-test.org/uievents/)
      * [DOMEvents](http://w3c-test.org/DOMEvents/) - old

## Recommendations

If you enjoyed this spec, you might be interested in these other specs from the same publisher:

* UI Events KeyboardEvent code Values: [GitHub project](https://github.com/w3c/uievents-code/), [Link to spec](https://w3c.github.io/uievents-code/)
* UI Events KeyboardEvent key Values: [GitHub project](https://github.com/w3c/uievents-key/), [Link to spec](https://w3c.github.io/uievents-key/)
