# UI Events

This repository if for the [UI Events](https://w3c.github.io/uievents/) (formerly known as DOM 3 Events).

## Goals

The goal of the UI/DOM3 Events sub-group, part of the Web Platform Working Group, is to complete the
UI Events specification according to market needs, to drive its adoption and implementation, to provide
a comprehensive test suite (for implementability at least, and hopefully for interoperability, too),
and to move it along the Recommendation Track to W3C Recommendation status.

## Communication

For discussion of matters related to DOM3 Events, the group uses the www-dom@w3.org mailing list ([archive](http://lists.w3.org/Archives/Public/www-dom/)).

## Meetings

See our [bi-weekly meetings](https://github.com/w3c/uievents/wiki/Meeting-Notes) for detailed status and progress toward getting this spec finished and ready for CR.

* Day + Time:
    * Tuesday 17:00 PST/PDT
    * During Summer (PDT - Mar to Oct)
        * Wednesday 00:00 UTC
        * Wednesday 09:00 JST (Tokyo)
    * During Winter (PST - Nov to Feb)
        * Wednesday 01:00 UTC
        * Wednesday 10:00 JST (Tokyo)
* Duration = 60 minutes
* Join [WebEx](https://mit.webex.com/mit/j.php?MTID=mc9358fc4e591abf50362b027b189ce48) meeting
    * Meeting number: 643 784 215
    * Meeting password: _Send an email to www-dom for password_
    * https://mit.webex.com/mit/j.php?MTID=mc9358fc4e591abf50362b027b189ce48;
* Join by phone
    * +1-617-324-0000 US Toll Number
    * Access code: 643 784 215
    * Mobile Auto Dial: +1-617-324-0000,,,643784215#
* Web interface
    * [IRC Web Interface](http://irc.w3.org/)
    * Note: you must have a Member or Invited Expert account to use this.
* [Add](https://mit.webex.com/mit/j.php?MTID=me1eaed87cdc049944b01363dd20cc4bf) this meeting to your calendar.
* Agendas: a draft agenda is sent to the [www-dom](http://lists.w3.org/Archives/Public/www-dom/) list at least 24 hours before
* Minutes: meeting minutes are distributed on the [www-dom](http://lists.w3.org/Archives/Public/www-dom/) list.
* Please submit agenda topics to www-dom mailing list.

Next call scheduled for Tuesday October 13th, 2015

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
`sections\*.include` files in your changelist - they've all been added to the
`.gitignore` file so that you don't include them accidentally. All changes
should be made in the `sections\*.txt` files and `index.bs`.

## Testing

* [Keyboard Event Viewer](https://cdn.rawgit.com/w3c/uievents/gh-pages/tools/key-event-viewer.html)
* Manual Keyboard Tests
   * [English 101 en-US](https://cdn.rawgit.com/w3c/uievents/gh-pages/tests/key-mtest-101en-us.html)
   * [French 102 fr-FR](https://cdn.rawgit.com/w3c/uievents/gh-pages/tests/key-mtest-102fr-fr.html)
* Web Platform Tests
   * [Github w3c/web-platform-tests uievents](https://github.com/w3c/web-platform-tests/tree/master/uievents)
   * Tests are mirrored at w3c-test.org:
      * [uievents](http://w3c-test.org/uievents/)
      * [DOMEvents](http://w3c-test.org/DOMEvents/) - old

## Recommendations

If you enjoyed this spec, you might be interested in these other specs from the same publisher:

* UI Events KeyboardEvent code Values : [Github project](https://github.com/w3c/uievents-code/), [Link to spec](https://w3c.github.io/uievents-code/)
* UI Events KeyboardEvent key Values : [Github project](https://github.com/w3c/uievents-key/), [Link to spec](https://w3c.github.io/uievents-key/)
