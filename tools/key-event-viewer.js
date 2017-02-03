
var NUM_HEADER_ROWS = 2;
var MAX_OUTPUT_ROWS = 100 + NUM_HEADER_ROWS;

// Sequence ID for numbering events.
var _seqId = 1;

// True if the current row is a 'keydown' event.
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

function setUserAgent() {
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
	setUserAgent();
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

function addOutputRow() {
	var table = document.getElementById("output");

	while (table.rows.length >= MAX_OUTPUT_ROWS) {
		table.deleteRow(-1);
	}
	// Insert after the header rows.
	var row = table.insertRow(NUM_HEADER_ROWS);
	if (_isKeydown && document.getElementById("hl_keydown").checked) {
	    row.classList.add("keydown_row_hilight");
	}
	return row;
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
	eventinfo["etype"] = calcRichString(etype, e.type, true);
	eventinfo["isComposing"] = e.isComposing;
	eventinfo["inputType"] = e.inputType;
	eventinfo["data"] = calcString(e.data);
	addEvent(eventinfo);
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
		console.log(mod);
		if (e.getModifierState(mod)) {
			if (!mods) {
				mods = mod;
				console.log(mods);
			} else {
				mods += ", " + mod;
				console.log(mods);
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
	eventinfo["etype"] = calcRichString(etype, e.type, true);
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
	eventinfo["key"] = calcRichString(etype, e.key, false);
	eventinfo["code"] = e.code;
	eventinfo["location"] = calcLocation(e.location);
	eventinfo["repeat"] = e.repeat;
	eventinfo["isComposing"] = e.isComposing;
	addEvent(eventinfo);
}

function addCompositionEvent(etype, e) {
	if (!e) {
		e = window.event;
	}
	var eventinfo = {};
	eventinfo["etype"] = calcRichString(etype, e.type, true);
	eventinfo["isComposing"] = e.isComposing;
	eventinfo["data"] = calcString(e.data);
	addEvent(eventinfo);
}

/* Create the event table row from the event info */
function addEvent(eventinfo) {
	var row = addOutputRow();
	addTableCellText(row, _seqId, "etype");
	addTableCell(row, eventinfo["etype"], "etype");
	addTableCell(row, eventinfo["charCode"], "legacy");
	addTableCell(row, eventinfo["keyCode"], "legacy");
	addTableCellText(row, eventinfo["which"], "legacy");
	addTableCellText(row, eventinfo["getModifierState"], "modifiers");
	addTableCellBoolean(row, eventinfo["shift"], "modifiers");
	addTableCellBoolean(row, eventinfo["ctrl"], "modifiers");
	addTableCellBoolean(row, eventinfo["alt"], "modifiers");
	addTableCellBoolean(row, eventinfo["meta"], "modifiers");
	addTableCellText(row, eventinfo["keyIdentifier"], "olddom3");
	addTableCellText(row, eventinfo["keyLocation"], "olddom3");
	addTableCellText(row, eventinfo["char"], "olddom3");
	addTableCell(row, eventinfo["key"], "uievents");
	addTableCellText(row, eventinfo["code"], "uievents");
	addTableCellText(row, eventinfo["location"], "uievents");
	addTableCellBoolean(row, eventinfo["repeat"], "uievents");
	addTableCellBoolean(row, eventinfo["isComposing"], "uievents");
	addTableCellText(row, eventinfo["inputType"], "uievents");
	addTableCellText(row, eventinfo["data"], "uievents");
	addTableCellText(row, eventinfo["locale"], "uievents");
	addInputCell(row);
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


function calcRichString(eventType, data, addArrow) {
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

function resetTable() {
	clearTable();
	createTableHeader();
	_seqId = 1;

	var input = document.getElementById("input");
	input.value = "";
	input.focus();
}

function clearTable() {
	clearChildren(document.getElementById("output"));
}

function addInputCell(row) {
	var value = document.getElementById("input").value;
	addTableCellText(row, "'" + value + "'", "inputbox", undefined, undefined, "left");
	_seqId++;
}

function addTableCellBoolean(row, key, celltype) {
	var modstyle = key ? "modOn" : "modOff";
	addTableCellText(row, calcBoolean(key), celltype, modstyle);
}

function addTableCellText(row, textdata, celltype, style, span, align) {
	var data = null;
	if (textdata !== undefined) {
		data = document.createTextNode(textdata);
	}
	addTableCell(row, data, celltype, style, span, align);
}

function addTableCell(row, data, celltype, style, span, align) {
	var cell = row.insertCell(-1);
	if (data === undefined || data == null) {
		data = document.createTextNode("-");
		style = "undef";
	}
	cell.appendChild(data);
	if (align === undefined) {
		align = "center";
	}
	cell.setAttribute("align", align);
	if (span !== undefined) {
		cell.setAttribute("colspan", span);
	}
	cell.classList.add("keycell");
	cell.classList.add(celltype);
	if (style !== undefined) {
		if (style instanceof Array) {
			for (var i = 0; i < style.length; i++) {
				cell.classList.add(style[i]);
			}
		} else {
			cell.classList.add(style);
		}
	}
	if (celltype == "etype" || celltype == "empty") {
		return;
	}
	// Hide this cell if it belongs to a hidden celltype.
	var show = document.getElementById("show_" + celltype).checked;
	if (!show) {
		cell.style.display = "none";
	}
}

function createTableHeader() {
	var table = document.getElementById("output");
	var head = table.createTHead();
	var row1 = head.insertRow(-1);
	var row2 = head.insertRow(-1);
	addTableCellText(row1, "", "empty", undefined, 2);
	addTableCellText(row2, "#", "etype", "etype_header");
	addTableCellText(row2, "Event type", "etype", ["etype_header", "subheader"]);
	// KeyboardEvent - Legacy
	addTableCellText(row1, "Legacy", "legacy", "legacy_header", 3);
	addTableCellText(row2, "charCode", "legacy", ["legacy_header", "subheader"]);
	addTableCellText(row2, "keyCode", "legacy", ["legacy_header", "subheader"]);
	addTableCellText(row2, "which", "legacy", ["legacy_header", "subheader"]);
	// KeyboardEvent - Modifiers
	addTableCellText(row1, "Modifiers", "modifiers", "modifiers_header", 5);
	addTableCellText(row2, "getModifierState()", "modifiers", ["modifiers_header", "subheader"]);
	addTableCellText(row2, "shift", "modifiers", ["modifiers_header", "subheader"]);
	addTableCellText(row2, "ctrl", "modifiers", ["modifiers_header", "subheader"]);
	addTableCellText(row2, "alt", "modifiers", ["modifiers_header", "subheader"]);
	addTableCellText(row2, "meta", "modifiers", ["modifiers_header", "subheader"]);
	// KeyboardEvent - Old DOM3
	addTableCellText(row1, "Old DOM3", "olddom3", "olddom3_header", 3);
	addTableCellText(row2, "keyIdentifier", "olddom3", ["olddom3_header", "subheader"]);
	addTableCellText(row2, "keyLocation", "olddom3", ["olddom3_header", "subheader"]);
	addTableCellText(row2, "char", "olddom3", ["olddom3_header", "subheader"]);
	// KeyboardEvent - UI Events
	addTableCellText(row1, "UI Events", "uievents", "uievents_header", 7);
	addTableCellText(row2, "key", "uievents", ["uievents_header", "subheader"]);
	addTableCellText(row2, "code", "uievents", ["uievents_header", "subheader"]);
	addTableCellText(row2, "location", "uievents", ["uievents_header", "subheader"]);
	addTableCellText(row2, "repeat", "uievents", ["uievents_header", "subheader"]);
	addTableCellText(row2, "isComposing", "uievents", ["uievents_header", "subheader"]);
	addTableCellText(row2, "inputType", "uievents", ["uievents_header", "subheader"]);
	addTableCellText(row2, "data", "uievents", ["uievents_header", "subheader"]);
	// KeyboardEvent - Proposed
	addTableCellText(row1, "Proposed", "proposed", "proposed_header", 1);
	addTableCellText(row2, "locale", "proposed", ["proposed_header", "subheader"]);

	addTableCellText(row1, "", "inputbox", "empty");
	addTableCellText(row2, "Input field", "inputbox", ["inputbox_header", "subheader"]);
}

function toggleOptions() {
	var link = document.getElementById("optionstoggle");
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
