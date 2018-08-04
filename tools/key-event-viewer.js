// Keyboard event viewer
// Gary Kacmarcik - garykac@{gmail|google}.com

// True if the current row is a 'keydown' event.
// This is used to set the background for the entire row when 'keydown' events are
// highlighted.
var _isKeydown = false;

function clearChildren(e) {
	while (e.firstChild !== null) {
		e.removeChild(e.firstChild);
	}
}

function setText(e, text) {
	clearChildren(e);
	e.appendChild(document.createTextNode(text));
}

function setUserAgentText() {
	var userAgent = navigator.userAgent;
	uaDiv = document.getElementById("useragent");
	setText(uaDiv, userAgent);
}

function addEventListener(obj, etype, handler) {
	if (obj.addEventListener) {
		obj.addEventListener(etype, handler, false);
	} else if (obj.attachEvent) {
		obj.attachEvent("on" + etype, handler);
	} else {
		obj["on" + etype] = handler;
	}
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

function onTextInput(e) {
	handleInputEvent("textinput", e);
}

function onBeforeInput(e) {
	handleInputEvent("beforeinput", e);
}

function onInput(e) {
	handleInputEvent("input", e);
}

function onCompositionStart(e) {
	handleCompositionEvent("compositionstart", e);
}

function onCompositionUpdate(e) {
	handleCompositionEvent("compositionupdate", e);
}

function onCompositionEnd(e) {
	handleCompositionEvent("compositionend", e);
}

function handleInputEvent(etype, e) {
	var show = document.getElementById("show_" + etype);
	if (show.checked) {
		addInputEvent(etype, e);
	}
	handleDefaultPropagation(etype, e);
}

function handleKeyEvent(etype, e) {
	var show = document.getElementById("show_" + etype);
	if (show.checked) {
		addKeyEvent(etype, e);
	}
	handleDefaultPropagation(etype, e);
}

function handleCompositionEvent(etype, e) {
	var show = document.getElementById("show_"+etype);
	if (show.checked) {
		addCompositionEvent(etype, e);
	}
	handleDefaultPropagation(etype, e);
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

function calcBoolean(key) {
	return key ? "✓" : "✗";
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

function resetTable() {
	clearTable();
	initOutputTable(_key_table_info);

	setInputFocus(true);
}

function addInputCell(row) {
	var value = document.getElementById("input").value;
	addTableCellText(row, "'" + value + "'", "inputbox", undefined, undefined, "left");
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

var _key_table_info = [
	// Format:
	// array of <group-info>
	// <group-info> : [ <group-title>, <group-type>, <styles>, <num-cols>, <columns> ]
	//   <group-title> : 
	//   <group-type> : cell type for style
	//   <styles> : additional styles (may be string or array of strings)
	//   <columns> : an array of <col-info>
	// <col-info> : [ <title>, <cell-type>, <styles> ]

	// Unlabeled group
	["", "empty", [
		["#", "etype"],
		["Event type", "etype"],
	]],
	
	// KeyboardEvent - Legacy
	["Legacy", "legacy", [
		["charCode", "legacy"],
		["keyCode", "legacy"],
		["which", "legacy"],
	]],

	// KeyboardEvent - Modifiers
	["Modifiers", "modifiers", [
		["getModifierState()", "modifiers"],
		["shift", "modifiers"],
		["ctrl", "modifiers"],
		["alt", "modifiers"],
		["meta", "modifiers"],
	]],

	// KeyboardEvent - Old DOM3
	["Old DOM3", "olddom3", [
		["keyIdentifier", "olddom3"],
		["keyLocation", "olddom3"],
		["char", "olddom3"],
	]],

	// KeyboardEvent - UI Events
	["UI Events", "uievents", [
		["key", "uievents"],
		["code", "uievents"],
		["location", "uievents"],
		["repeat", "uievents"],
		["isComposing", "uievents"],
		["inputType", "uievents"],
		["data", "uievents"],
	]],

	// KeyboardEvent - Proposed
	["Proposed", "proposed", [
		["locale", "proposed"],
	]],

	// Input
	["", "empty", [
		["Input field", "inputbox"],
	]],
];
