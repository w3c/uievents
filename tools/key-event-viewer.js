
var NUM_HEADER_ROWS = 2;
var MAX_OUTPUT_ROWS = 100 + NUM_HEADER_ROWS;

// Sequence ID for numbering events.
var seqId = 1;

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

function isOldIE() {
	var ieIndex = navigator.userAgent.indexOf("MSIE");
	if (ieIndex == -1) {
		return false;
	}
	var ver = parseFloat(navigator.userAgent.substring(ieIndex+5));
	return ver < 10.0;
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
	addEventListener(input, "beforeInput", onBeforeInput);
	addEventListener(input, "input", onInput);
	addEventListener(input, "compositionstart", onCompositionStart);
	addEventListener(input, "compositionupdate", onCompositionUpdate);
	addEventListener(input, "compositionend", onCompositionEnd);
}

function onKeyDown(e) {
	handleKeyEvent("keydown", e);
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
	return table.insertRow(NUM_HEADER_ROWS);
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
	eventinfo["etype"] = e.type;
	eventinfo["data"] = calcString(e.data);
	addEvent(eventinfo);
}

function addKeyEvent(etype, e) {
	if (!e) {
		e = window.event;
	}
	var eventinfo = {};
	eventinfo["etype"] = e.type;
	eventinfo["charCode"] = calcKeyVal(e.charCode);
	eventinfo["keyCode"] = calcKeyVal(e.keyCode);
	eventinfo["which"] = calcKeyVal(e.which);
	eventinfo["shift"] = e.shiftKey;
	eventinfo["ctrl"] = e.ctrlKey;
	eventinfo["alt"] = e.altKey;
	eventinfo["meta"] = e.metaKey;
	eventinfo["keyIdentifier"] = e.keyIdentifier;
	eventinfo["keyLocation"] = calcLocation(e.keyLocation);
	eventinfo["char"] = calcString(e.char);
	eventinfo["key"] = calcString(e.key);
	eventinfo["location"] = calcLocation(e.location);
	eventinfo["repeat"] = e.repeat;
	eventinfo["code"] = e.code;
	addEvent(eventinfo);
}

function addCompositionEvent(etype, e) {
	if (!e) {
		e = window.event;
	}
	var eventinfo = {};
	eventinfo["etype"] = e.type;
	eventinfo["data"] = calcString(e.data);
	addEvent(eventinfo);
}

function addEvent(eventinfo) {
	var row = addOutputRow();
	addTableCell(row, seqId, "etype");
	addTableCell(row, eventinfo["etype"], "etype");
	addTableCell(row, eventinfo["charCode"], "legacy");
	addTableCell(row, eventinfo["keyCode"], "legacy");
	addTableCell(row, eventinfo["which"], "legacy");
	addTableCellModifierKey(row, eventinfo["shift"], "modifiers");
	addTableCellModifierKey(row, eventinfo["ctrl"], "modifiers");
	addTableCellModifierKey(row, eventinfo["alt"], "modifiers");
	addTableCellModifierKey(row, eventinfo["meta"], "modifiers");
	addTableCell(row, eventinfo["keyIdentifier"], "olddom3");
	addTableCell(row, eventinfo["keyLocation"], "olddom3");
	addTableCell(row, eventinfo["char"], "olddom3");
	addTableCell(row, eventinfo["key"], "uievents");
	addTableCell(row, eventinfo["code"], "uievents");
	addTableCell(row, eventinfo["location"], "uievents");
	addTableCell(row, eventinfo["repeat"], "uievents");
	addTableCell(row, eventinfo["data"], "uievents");
	addTableCell(row, eventinfo["locale"], "uievents");
	addInputCell(row);
}

function calcLocation(loc) {
	if (loc == 1) return "LEFT";
	if (loc == 2) return "RIGHT";
	if (loc == 3) return "NUMPAD";
	return loc;
}

function calcKeyVal(key) {
    if (key === undefined) {
		return key;
	}
    if (key >= 32 && key < 127) {
		return key + " '" + String.fromCharCode(key) + "'";
	}
    return key;
}

function calcModifierKey(key) {
	return key ? "✓" : "✗";
}

function calcString(data) {
    if (data === undefined) {
		return data;
	}
	return "'" + data + "'";
}

function addClass(obj, className) {
	if (!isOldIE()) {
		obj.classList.add(className);
	}
}

function addInnerText(obj, text) {
	if (!isOldIE()) {
		obj.appendChild(document.createTextNode(text));
	} else {
		obj.innerText = text;
	}
}

function resetTable() {
	clearTable();
	createTableHeader();
	seqId = 1;
	
	var input = document.getElementById("input");
	input.value = "";
	input.focus();
}

function clearTable() {
	clearChildren(document.getElementById("output"));
}

function addInputCell(row) {
	var value = document.getElementById("input").value;
	addTableCell(row, "'" + value + "'", "inputbox", undefined, undefined, "left");
	seqId++;
}

function addTableCell(row, data, celltype, style, span, align) {
	var cell = row.insertCell(-1);
	if (data === undefined) {
		data = "-";
		addClass(cell, "undef");
	}
	addInnerText(cell, data);
	if (align === undefined) {
		align = "center";
	}
	cell.setAttribute("align", align);
	if (span !== undefined) {
		cell.setAttribute("colspan", span);
	}
	addClass(cell, "keycell");
	addClass(cell, celltype);
	if (style !== undefined) {
		if (style instanceof Array) {
			for (var i = 0; i < style.length; i++) {
				addClass(cell, style[i]);
			}
		} else {
			addClass(cell, style);
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

function addTableCellModifierKey(row, key, celltype) {
	var modstyle = key ? "modOn" : "modOff";
	addTableCell(row, calcModifierKey(key), celltype, modstyle);
}

function createTableHeader() {
	var table = document.getElementById("output");
	var head = table.createTHead();
	var row1 = head.insertRow(-1);
	var row2 = head.insertRow(-1);
	addTableCell(row1, "", "empty", undefined, 2);
	addTableCell(row2, "#", "etype", "etype_header");
	addTableCell(row2, "Event type", "etype", "etype_header");
	// KeyboardEvent - Legacy
	addTableCell(row1, "Legacy", "legacy", "legacy_header", 3);
	addTableCell(row2, "charCode", "legacy", "legacy_header");
	addTableCell(row2, "keyCode", "legacy", "legacy_header");
	addTableCell(row2, "which", "legacy", "legacy_header");
	// KeyboardEvent - Modifiers
	addTableCell(row1, "Modifiers", "modifiers", "modifiers_header", 4);
	addTableCell(row2, "shift", "modifiers", "modifiers_header");
	addTableCell(row2, "ctrl", "modifiers", "modifiers_header");
	addTableCell(row2, "alt", "modifiers", "modifiers_header");
	addTableCell(row2, "meta", "modifiers", "modifiers_header");
	// KeyboardEvent - Old DOM3
	addTableCell(row1, "Old DOM3", "olddom3", "olddom3_header", 3);
	addTableCell(row2, "keyIdentifier", "olddom3", "olddom3_header");
	addTableCell(row2, "keyLocation", "olddom3", "olddom3_header");
	addTableCell(row2, "char", "olddom3", "olddom3_header");
	// KeyboardEvent - UI Events
	addTableCell(row1, "UI Events", "uievents", "uievents_header", 5);
	addTableCell(row2, "key", "uievents", "uievents_header");
	addTableCell(row2, "code", "uievents", "uievents_header");
	addTableCell(row2, "location", "uievents", "uievents_header");
	addTableCell(row2, "repeat", "uievents", "uievents_header");
	addTableCell(row2, "data", "uievents", "uievents_header");
	// KeyboardEvent - Proposed
	addTableCell(row1, "Proposed", "proposed", "proposed_header", 1);
	addTableCell(row2, "locale", "proposed", "proposed_header");

	addTableCell(row1, "", "inputbox", "empty");
	addTableCell(row2, "Input field", "inputbox", "inputbox_header");
}

function toggleOptions() {
	var link = document.getElementById("optionstoggle");
	var options = document.getElementById("options");
	clearChildren(link);
	if (options.style.display == "block") {
		options.style.display = "none";
		addInnerText(link, "Show Options");
	}
	else {
		options.style.display = "block";
		addInnerText(link, "Hide Options");
	}
}

function showFieldClick(cb) {
	if (isOldIE()) {
		return;
	}
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
