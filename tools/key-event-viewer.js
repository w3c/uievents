// Keyboard event viewer
// Gary Kacmarcik - garykac@{gmail|google}.com

var _key_table_info = [
	// Unlabeled group
	["", "etype", [
		["#", "etype", "text"],
		["Event type", "etype", "html"],
	], {'grouplabel': false}],
	
	// KeyboardEvent - Legacy
	["Legacy", "legacy", [
		["charCode", "legacy", "html"],
		["keyCode", "legacy", "html"],
		["which", "legacy", "text"],
	], {'checked': true}],

	// KeyboardEvent - Modifiers
	["Modifiers", "modifiers", [
		["getModifierState", "modifiers", "text"],
		["shift", "modifiers", "bool"],
		["ctrl", "modifiers", "bool"],
		["alt", "modifiers", "bool"],
		["meta", "modifiers", "bool"],
	], {'checked': true}],

	// KeyboardEvent - Old DOM3
	["Old DOM3", "olddom3", [
		["keyIdentifier", "olddom3", "text"],
		["keyLocation", "olddom3", "text"],
		["char", "olddom3", "text"],
	], {'checked': false}],

	// KeyboardEvent - UI Events
	["UI Events", "uievents", [
		["key", "uievents", "html"],
		["code", "uievents", "text"],
		["location", "uievents", "text"],
		["repeat", "uievents", "bool"],
		["isComposing", "uievents", "bool"],
		["inputType", "uievents", "text"],
		["data", "uievents", "text"],
	], {'checked': true}],

	// KeyboardEvent - Proposed
	["Proposed", "proposed", [
		["locale", "proposed", "text"],
	], {'checked': false}],

	// Input
	["Input", "inputbox", [
		["Input field", "inputbox", "text", {'align': 'left'}],
	], {'checked': true, 'grouplabel': false}],
];

var _key_event_info = [
	["keydown", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'class': "keyevent_hilight keydown_hilight keydown_arrow"},
		},
		"#e0e0e0"],
	["keypress", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': false, 'class': "keyevent_hilight keypress_hilight"},
		},
		"#ccffcc"],
	["keyup", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'class': "keyevent_hilight keyup_hilight keyup_arrow"},
		},
		"#ffcccc"],
	["textinput", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'checked': false},
		'ShowEvents': {'checked': false},
		'Highlight': {'enabled': false, 'checked': false},
		},
		"#ffffff"],
	["beforeinput", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'enabled': false, 'checked': false},
		},
		"repeating-linear-gradient(-45deg, #fcc, #fcc 8px, #fff 8px, #fff 16px)"],
	["input", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'enabled': false, 'checked': false},
		},
		"repeating-linear-gradient(-45deg, #cfc, #cfc 8px, #fff 8px, #fff 16px)"],
	["compositionstart", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'enabled': false, 'checked': false},
		},
		"#e0e0e0"],
	["compositionupdate", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'enabled': false, 'checked': false},
		},
		"#e0e0e0"],
	["compositionend", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'enabled': false, 'checked': false},
		},
		"#e0e0e0"],
];


// True if the current row is a 'keydown' event.
// This is used to set the background for the entire row when 'keydown' events are
// highlighted.
var _isKeydown = false;

function setUserAgentText() {
	var userAgent = navigator.userAgent;
	uaDiv = document.getElementById("useragent");
	setText(uaDiv, userAgent);
}

function resetTable(resetData=true) {
	clearTable();
	initOutputTable(_key_table_info);

	setInputFocus(resetData);
}

function init() {
	setUserAgentText();
	var extra_options = [
		["checkbox", "readonlyToggle", "Read only <input>", {
			'onclick': "toggleReadonly()",
			'checked': false,
		}],
		["text", "Note: Options apply to new events only."],
	];

	// Remove read-only option for contenteditable.
	var el = document.getElementById("input");
	if (el.tagName == "DIV") {
		extra_options.shift();
	}

	createOptions(document.getElementById("options"), _key_event_info, _key_table_info, extra_options);
	resetTable(false);

	var input = document.getElementById("input");
	addEventListener(input, "keydown", onKeyDown);
	addEventListener(input, "keypress", onKeyPress);
	addEventListener(input, "keyup", onKeyUp);
	addEventListener(input, "textInput", onTextInput);
	addEventListener(input, "textinput", onTextInput);	// For IE9
	addEventListener(input, "beforeinput", onBeforeInput);
	addEventListener(input, "input", onInput);
	addEventListener(input, "compositionstart", onCompositionStart);
	addEventListener(input, "compositionupdate", onCompositionUpdate);
	addEventListener(input, "compositionend", onCompositionEnd);
}

// =====
// Key events: keydown, keypress, keyup
// =====

function onKeyDown(e) {
    _isKeydown = true;
	handleKeyEvent("keydown", e);
    _isKeydown = false;
}

function onKeyPress(e) {
	handleKeyEvent("keypress", e);
}

function onKeyUp(e) {
	handleKeyEvent("keyup", e);
}

function handleKeyEvent(etype, e) {
	var show = document.getElementById("show_" + etype);
	if (show.checked) {
		addKeyEvent(etype, e);
	}
	handleDefaultPropagation(etype, e);
}

function addKeyEvent(etype, e) {
	if (!e) {
		e = window.event;
	}
	var eventinfo = {};
	eventinfo["Event type"] = calcHilightString(etype, e.type, true);
	eventinfo["charCode"] = calcRichKeyVal(etype, "charCode", e.charCode);
	eventinfo["keyCode"] = calcRichKeyVal(etype, "keyCode", e.keyCode);
	eventinfo["which"] = e.which;
	eventinfo["getModifierState"] = getModifierState(e);
	eventinfo["shift"] = e.shiftKey;
	eventinfo["ctrl"] = e.ctrlKey;
	eventinfo["alt"] = e.altKey;
	eventinfo["meta"] = e.metaKey;
	eventinfo["keyIdentifier"] = e.keyIdentifier;
	eventinfo["keyLocation"] = calcLocation(e.keyLocation);
	eventinfo["char"] = calcString(e.char);
	eventinfo["key"] = calcHilightString(etype, e.key, false);
	eventinfo["code"] = e.code;
	eventinfo["location"] = calcLocation(e.location);
	eventinfo["repeat"] = e.repeat;
	eventinfo["isComposing"] = e.isComposing;
	eventinfo["Input field"] = calcInput();

	extra_class = undefined;
	if (_isKeydown && document.getElementById("hl_keydown").checked) {
		extra_class = "keydown_row_hilight";
	}
	addEventToOutput(eventinfo, extra_class);
}

// =====
// Input events: textinput, beforeinput, input
// =====

function onTextInput(e) {
	handleInputEvent("textinput", e);
}

function onBeforeInput(e) {
	handleInputEvent("beforeinput", e);
}

function onInput(e) {
	handleInputEvent("input", e);
}

function handleInputEvent(etype, e) {
	var show = document.getElementById("show_" + etype);
	if (show.checked) {
		addInputEvent(etype, e);
	}
	handleDefaultPropagation(etype, e);
}

function addInputEvent(etype, e) {
	if (!e) {
		e = window.event;
	}
	var eventinfo = {};
	eventinfo["Event type"] = calcHilightString(etype, e.type, true);
	eventinfo["isComposing"] = e.isComposing;
	eventinfo["inputType"] = e.inputType;
	eventinfo["data"] = calcString(e.data);
	eventinfo["Input field"] = calcInput();
	addEventToOutput(eventinfo);
}

// =====
// Composition events: compositionstart, compositionupdate, compositionend
// =====

function onCompositionStart(e) {
	handleCompositionEvent("compositionstart", e);
}

function onCompositionUpdate(e) {
	handleCompositionEvent("compositionupdate", e);
}

function onCompositionEnd(e) {
	handleCompositionEvent("compositionend", e);
}

function handleCompositionEvent(etype, e) {
	var show = document.getElementById("show_"+etype);
	if (show.checked) {
		addCompositionEvent(etype, e);
	}
	handleDefaultPropagation(etype, e);
}

function addCompositionEvent(etype, e) {
	if (!e) {
		e = window.event;
	}
	var eventinfo = {};
	eventinfo["Event type"] = calcHilightString(etype, e.type, true);
	eventinfo["isComposing"] = e.isComposing;
	eventinfo["data"] = calcString(e.data);
	eventinfo["Input field"] = calcInput();
	addEventToOutput(eventinfo);
}

// =====
// Helper functions
// =====

function calcInput() {
	var el = document.getElementById("input");
	var value = "";
	if (el.tagName == "DIV") {
		// <div contenteditable>
		value = el.innerText;
	} else {
		// <input>
		value = el.value;
	}
	return "'" + value + "'";
}

/* Set the focus to the input box. */
function setInputFocus(resetData) {
	var input = document.getElementById("input");
	
	if (resetData) {
		if (input.tagName == "DIV") {
			// <div contenteditable>
			clearChildren(input);
		} else {
			// <input>
			input.value = "";
		}
	}

	// Set focus.
	if (input.tagName == "DIV") {
		// <div contenteditable>
		var sel = window.getSelection();
		var range = document.createRange();
		//range.setStart(input, 0);
		//range.setEnd(input, 0);
		range.selectNodeContents(input);
		sel.removeAllRanges();
		sel.addRange(range);
	} else {
		// <input>
		input.focus();
	}
}

function calcLocation(loc) {
	if (loc == 1) return "LEFT";
	if (loc == 2) return "RIGHT";
	if (loc == 3) return "NUMPAD";
	return loc;
}

function calcRichKeyVal(eventType, attrName, key) {
	if (key === undefined) {
		return null;
	}

	var keyString = String.fromCharCode(key);
	if (attrName == "keyCode") {
		// Don't even try to decipher keyCode unless it's alphanum.
		if (key < 32 || key > 90) {
			keyString = "";
		}
		// ...or a modifier.
		switch (key) {
			case 16: keyString = "Shift"; break;
			case 17: keyString = "Control"; break;
			case 18: keyString = "Alt"; break;
			case 91:
			case 93:
			case 224:
				keyString = "Meta";
				break;
		}
	}

	if (keyString != ""
			&& ((eventType == "keypress" && attrName == "charCode")
				|| ((eventType == "keydown" || eventType == "keyup") && attrName == "keyCode")
				)
			) {
		var data = document.createElement("span");
		data.appendChild(document.createTextNode(key));
		var keySpan = document.createElement("span");
		if (document.getElementById("hl_" + eventType).checked) {
			keySpan.classList.add("keyevent_hilight");
			keySpan.classList.add(eventType + "_hilight");
		} else {
			keyString = " " + keyString;
		}
		keySpan.textContent = keyString;
		data.appendChild(keySpan);
		return data;
	}
	return document.createTextNode(key);
}

function calcHilightString(eventType, data, addArrow) {
	if (data === undefined) {
		return null;
	}

	var keySpan = document.createElement("span");
	var enableHilight = document.getElementById("hl_" + eventType);
	if (enableHilight && enableHilight.checked) {
		keySpan.classList.add("keyevent_hilight");
		keySpan.classList.add(eventType + "_hilight");
		if (addArrow && (eventType == "keydown" || eventType == "keyup")) {
			keySpan.classList.add(eventType + "_arrow");
		}
	}
	keySpan.textContent = data;
	return keySpan;
}

function toggleReadonly() {
	var cbReadonly = document.getElementById("readonlyToggle");
	var input = document.getElementById("input");
	if (cbReadonly.checked) {
		input.setAttribute('readonly', true);
	} else {
		input.removeAttribute('readonly');
	}
	setInputFocus(false);
}
