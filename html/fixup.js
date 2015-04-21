/* ReSpec creates really awkward names for IDL methods, like:
 *   widl-MouseEvent-initMouseEvent-void-DOMString-typeArg-boolean-canBubbleArg-boolean-cancelableArg-AbstractView-viewArg-long-detailArg-long-screenXArg-long-screenYArg-long-clientXArg-long-clientYArg-boolean-ctrlKeyArg-boolean-altKeyArg-boolean-shiftKeyArg-boolean-metaKeyArg-unsigned-short-buttonArg-EventTarget-relatedTargetArg
 * instead of simply:
 *   widl-MouseEvent-initMouseEvent
 *
 * This script fixes them.
 */

bad_ids = [
	["widl-UIEvent-initUIEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-Window-viewArg-long-detailArg"],
	["widl-MouseEvent-getModifierState", "-boolean-DOMString-keyArg"],
	["widl-MouseEvent-initMouseEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-Window-viewArg-long-detailArg-long-screenXArg-long-screenYArg-long-clientXArg-long-clientYArg-boolean-ctrlKeyArg-boolean-altKeyArg-boolean-shiftKeyArg-boolean-metaKeyArg-short-buttonArg-EventTarget-relatedTargetArg"],
	["widl-KeyboardEvent-getModifierState", "-boolean-DOMString-keyArg"],
	["widl-MutationEvent-initMutationEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-Node-relatedNodeArg-DOMString-prevValueArg-DOMString-newValueArg-DOMString-attrNameArg-unsigned-short-attrChangeArg"],
	["widl-CustomEvent-initCustomEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-any-detailArg"],
	["widl-FocusEvent-initFocusEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-Window-viewArg-long-detailArg-EventTarget-relatedTargetArg"],
	["widl-WheelEvent-initWheelEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-Window-viewArg-long-detailArg-long-screenXArg-long-screenYArg-long-clientXArg-long-clientYArg-short-buttonArg-EventTarget-relatedTargetArg-DOMString-modifiersListArg-double-deltaXArg-double-deltaYArg-double-deltaZArg-unsigned-long-deltaMode"],
	// 2013-11-05 version: ["widl-KeyboardEvent-initKeyboardEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-Window-viewArg-long-detailArg-DOMString-keyArg-unsigned-long-locationArg-DOMString-modifiersListArg-boolean-repeat"],
	["widl-KeyboardEvent-initKeyboardEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-Window-viewArg-DOMString-keyArg-unsigned-long-locationArg-DOMString-modifiersListArg-boolean-repeat-DOMString-locale"],
	["widl-CompositionEvent-initCompositionEvent", "-void-DOMString-typeArg-boolean-bubblesArg-boolean-cancelableArg-Window-viewArg-DOMString-dataArg-DOMString-locale"],
	
	// The following definitions were removed from the D3E spec for the 2014-09-25 WD because they
	// were already defined in other specs.
	//["widl-Event-initEvent", "-void-DOMString-eventTypeArg-boolean-bubblesArg-boolean-cancelableArg"],
	//["widl-Event-preventDefault", "-void"],
	//["widl-Event-stopImmediatePropagation", "-void"],
	//["widl-Event-stopPropagation", "-void"],
	//["widl-EventTarget-addEventListener", "-void-DOMString-type-EventListener-listener-boolean-useCapture"],
	//["widl-EventTarget-dispatchEvent", "-boolean-Event-event"],
	//["widl-EventTarget-removeEventListener", "-void-DOMString-type-EventListener-listener-boolean-useCapture"],
	//["widl-EventListener-handleEvent", "-void-Event-event"],
	//["widl-DocumentEvent-createEvent", "-Event-DOMString-eventInterface"],
];

idl_constants = {
	"DOM_DELTA_LINE": "#widl-WheelEvent-",
	"DOM_DELTA_PAGE": "#widl-WheelEvent-",
	"DOM_DELTA_PIXEL": "#widl-WheelEvent-",
	"DOM_KEY_LOCATION_LEFT": "#widl-KeyboardEvent-",
	"DOM_KEY_LOCATION_NUMPAD": "#widl-KeyboardEvent-",
	"DOM_KEY_LOCATION_RIGHT": "#widl-KeyboardEvent-",
	"DOM_KEY_LOCATION_STANDARD": "#widl-KeyboardEvent-",
	"AT_TARGET": "#widl-Event-",
	"BUBBLING_PHASE": "#widl-Event-",
	"CAPTURING_PHASE": "#widl-Event-",
	"NONE": "#widl-Event-",
	"ADDITION": "#widl-MutationEvent-",
	"MODIFICATION": "#widl-MutationEvent-",
	"REMOVAL": "#widl-MutationEvent-",
};

function fixup_ids() {
	console.log('Fixing up bad ids');
	for (var i = 0; i < bad_ids.length; i++) {
		var name = bad_ids[i][0];
		var signature = bad_ids[i][1];
		var el = document.getElementById(name + signature);
		if (el) {
			el.id = name;
		} else {
			console.log('ERROR - unable to fixup: ' + name + signature);
		}
	}
	console.log("Finished fixing up bad ids");
}

function fixup_idl_method_hrefs() {
	console.log('Fixing up IDL hrefs');
	var els = document.getElementsByClassName('idlMethName');
	for (var i = 0; i < els.length; i++) {
		var href = els[i].firstChild.attributes[0].value;
		var found = false;
		for (var j = 0; j < bad_ids.length; j++) {
			var badid = bad_ids[j][0] + bad_ids[j][1];
			if (href == '#' + badid) {
				els[i].firstChild.href = '#' + bad_ids[j][0];
				found = true;
			}
		}
		if (!found) {
			console.log('ERROR - unable to find href match: ' + href);
		}
	}
	console.log('Finished fixing up IDL hrefs');
}

function fixup_idl_constant_hrefs() {
	console.log('Fixing up IDL constants');
	var els = document.getElementsByClassName('idlConstName');
	for (var i = 0; i < els.length; i++) {
		var href = els[i].firstChild.attributes[0].value;
		var raw_href = href.slice(1)
		if (raw_href in idl_constants) {
			var new_href = idl_constants[raw_href] + raw_href;
			//console.log('found: ' + raw_href + " changing to " + new_href);
			els[i].firstChild.href = new_href;
		} else {
			console.log('ERROR - unable to find: ' + raw_href);
		}
	}
	console.log('Finished fixing up IDL constants');
}

function fixup() {
	// Wait until ReSpec is done.
	var check = bad_ids[0][0] + bad_ids[0][1];
	if (!document.getElementById(check)) {
		console.log("waiting");
		setTimeout(fixup, 500);
		return;
	}

	fixup_ids();
	fixup_idl_method_hrefs();
	fixup_idl_constant_hrefs();
}

if (window.addEventListener) {
	window.addEventListener('load', fixup, false);
}
