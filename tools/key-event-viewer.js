// Keyboard event viewer
// Gary Kacmarcik - garykac@{gmail|google}.com

// True if the current row is a 'keydown' event.
// This is used to set the background for the entire row when 'keydown' events are
// highlighted.
var _isKeydown = false;

var _key_table_info = [
	// Unlabeled group
	["", "empty", [
		["#", "etype", "text"],
		["Event type", "etype", "html"],
	]],
	
	// KeyboardEvent - Legacy
	["Legacy", "legacy", [
		["charCode", "legacy", "html"],
		["keyCode", "legacy", "html"],
		["which", "legacy", "text"],
	]],

	// KeyboardEvent - Modifiers
	["Modifiers", "modifiers", [
		["getModifierState", "modifiers", "text"],
		["shift", "modifiers", "bool"],
		["ctrl", "modifiers", "bool"],
		["alt", "modifiers", "bool"],
		["meta", "modifiers", "bool"],
	]],

	// KeyboardEvent - Old DOM3
	["Old DOM3", "olddom3", [
		["keyIdentifier", "olddom3", "text"],
		["keyLocation", "olddom3", "text"],
		["char", "olddom3", "text"],
	]],

	// KeyboardEvent - UI Events
	["UI Events", "uievents", [
		["key", "uievents", "html"],
		["code", "uievents", "text"],
		["location", "uievents", "text"],
		["repeat", "uievents", "bool"],
		["isComposing", "uievents", "bool"],
		["inputType", "uievents", "text"],
		["data", "uievents", "text"],
	]],

	// KeyboardEvent - Proposed
	["Proposed", "proposed", [
		["locale", "proposed", "text"],
	]],

	// Input
	["", "empty", [
		["Input field", "inputbox", "text", {'align': 'left'}],
	]],
];

function setUserAgentText() {
	var userAgent = navigator.userAgent;
	uaDiv = document.getElementById("useragent");
	setText(uaDiv, userAgent);
}

function resetTable() {
	clearTable();
	initOutputTable(_key_table_info);

	setInputFocus(true);
}

function init() {
	setUserAgentText();
	resetTable();

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


function getModifierState(e) {
	Modifiers = [
		"Alt", "AltGraph", "Control", "Shift", "Meta",
		// Locking keys
		"CapsLock", "NumLock", "ScrollLock",
		// Linux
		"Hyper", "Super",
		// Virtual keyboards
		"Symbol", "SymbolLock",
		// Not valid, but check anyway
		"Fn", "FnLock",
		];
	mods = undefined;
	for (var mod of Modifiers) {
		if (e.getModifierState(mod)) {
			if (!mods) {
				mods = mod;
			} else {
				mods += ", " + mod;
			}
		}
	}
	return mods;
}

function calcInput() {
	var value = document.getElementById("input").value;
	return "'" + value + "'";
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

function calcString(data) {
	if (data === undefined) {
		return data;
	}
	return "'" + data + "'";
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

/* Set the focus to the input box. */
function setInputFocus(resetData=false) {
	var input = document.getElementById("input");
	if (resetData) {
		input.value = "";
	}
	input.focus();
}

function handleDefaultPropagation(etype, e) {
	var preventDefault = document.getElementById("pd_" + etype);
	if (preventDefault.checked && e.preventDefault) {
		e.preventDefault();
	}
	var stopPropagation = document.getElementById("sp_" + etype);
	if (stopPropagation.checked && e.stopPropagation) {
		e.stopPropagation();
	}
	// Always prevent default for Tab.
	if (e.keyCode == 9 || e.code == "Tab") {
		e.preventDefault();
	}
}

function toggleReadonly() {
	var cbReadonly = document.getElementById("readonlyToggle");
	var input = document.getElementById("input");
	if (cbReadonly.checked) {
		input.setAttribute('readonly', true);
	} else {
		input.removeAttribute('readonly');
	}
	setInputFocus();
}

function toggleOptions() {
	var link = document.getElementById("optionsToggle");
	var options = document.getElementById("options");
	clearChildren(link);
	if (options.style.display == "block") {
		options.style.display = "none";
		link.appendChild(document.createTextNode("Show Options"));
	}
	else {
		options.style.display = "block";
		link.appendChild(document.createTextNode("Hide Options"));
	}
	setInputFocus();
}

function showFieldClick(cb) {
	var celltype = cb.id.split('_')[1];
	var show = cb.checked;

	var table = document.getElementById("output");
	for (var ir = 0, row; row = table.rows[ir]; ir++) {
		for (var ic = 0, cell; cell = row.cells[ic]; ic++) {
			if (cell.classList.contains(celltype)) {
				if (show) {
					cell.style.display = "";
				} else {
					cell.style.display = "none";
				}
			}
		}
	}
}
