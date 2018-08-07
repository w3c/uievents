// Mouse event viewer
// Gary Kacmarcik - garykac@{gmail|google}.com

var _mouse_table_info = [
	// Unlabeled group
	["", "empty", [
		["#", "etype", "text"],
		["Event type", "etype", "html"],
		["Count", "etype", "text"],
	]],
	
	// MouseEvent - Target
	["Target", "target", [
		["A", "target", "text", {'style': 'hilite_div_a'}],
		["B", "target", "text", {'style': 'hilite_div_b'}],
		["C", "target", "text", {'style': 'hilite_div_c'}],
	]],

	// MouseEvent - Handler
	["Handler", "handler", [
		["hA", "handler", "text", {'style': 'hilite_handler_a'}],
		["hB", "handler", "text", {'style': 'hilite_handler_b'}],
		["hC", "handler", "text", {'style': 'hilite_handler_c'}],
	]],

	// MouseEvent - UI Events
	["UIEvents", "uievents", [
		["screenX", "uievents", "text"],
		["screenY", "uievents", "text"],
		["clientX", "uievents", "text"],
		["clientY", "uievents", "text"],
	]],

	// PointerLock
	["PointerLock", "plock", [
		["movementX", "plock", "text"],
		["movementY", "plock", "text"],
	]],

	// CSSOM
	["CSSOM", "cssom", [
		["offsetX", "cssom", "text"],
		["offsetY", "cssom", "text"],
		["pageX", "cssom", "text"],
		["pageY", "cssom", "text"],
		["x", "cssom", "text"],
		["y", "cssom", "text"],
	]],

	// MouseEvent - UI Events
	["Buttons", "buttons", [
		["button", "buttons", "text"],
		["buttons", "buttons", "text"],
	]],

	// KeyboardEvent - Modifiers
	["Modifiers", "modifiers", [
		["getModifierState", "modifiers", "text"],
		["shift", "modifiers", "bool"],
		["ctrl", "modifiers", "bool"],
		["alt", "modifiers", "bool"],
		["meta", "modifiers", "bool"],
	]],
];

var _mouse_event_info = [
	["mousedown", {
		'preventDefault': {'enabled': true, 'checked': false},
		'stopPropagation': {'enabled': true, 'checked': true},
		'ShowEvents': {'enabled': true, 'checked': true},
		'Highlight': {'enabled': true, 'checked': true, 'class': "mouseevent_hilight mousedown_hilight"},
		},
		"#e0e0e0"],
	["mouseenter", {
		'preventDefault': {'enabled': true, 'checked': false},
		'stopPropagation': {'enabled': false, 'checked': false},
		'ShowEvents': {'enabled': true, 'checked': true},
		'Highlight': {'enabled': true, 'checked': true, 'class': "mouseevent_hilight mouseenter_hilight"},
		},
		"#ccffcc"],
	["mouseleave", {
		'preventDefault': {'enabled': true, 'checked': false},
		'stopPropagation': {'enabled': false, 'checked': false},
		'ShowEvents': {'enabled': true, 'checked': true},
		'Highlight': {'enabled': true, 'checked': true, 'class': "mouseevent_hilight mouseleave_hilight"},
		},
		"#ffcccc"],
	["mousemove", {
		'preventDefault': {'enabled': true, 'checked': false},
		'stopPropagation': {'enabled': true, 'checked': true},
		'ShowEvents': {'enabled': true, 'checked': true},
		'Highlight': {'enabled': true, 'checked': false, 'class': "mouseevent_hilight mousemove_hilight"},
		},
		"#ffffff"],
	["mouseout", {
		'preventDefault': {'enabled': true, 'checked': false},
		'stopPropagation': {'enabled': true, 'checked': true},
		'ShowEvents': {'enabled': true, 'checked': true},
		'Highlight': {'enabled': true, 'checked': false, 'class': "mouseevent_hilight mouseout_hilight"},
		},
		"repeating-linear-gradient(-45deg, #fcc, #fcc 8px, #fff 8px, #fff 16px)"],
	["mouseover", {
		'preventDefault': {'enabled': true, 'checked': false},
		'stopPropagation': {'enabled': true, 'checked': true},
		'ShowEvents': {'enabled': true, 'checked': true},
		'Highlight': {'enabled': true, 'checked': false, 'class': "mouseevent_hilight mouseover_hilight"},
		},
		"repeating-linear-gradient(-45deg, #cfc, #cfc 8px, #fff 8px, #fff 16px)"],
	["mouseup", {
		'preventDefault': {'enabled': true, 'checked': false},
		'stopPropagation': {'enabled': true, 'checked': true},
		'ShowEvents': {'enabled': true, 'checked': true},
		'Highlight': {'enabled': true, 'checked': true, 'class': "mouseevent_hilight mouseup_hilight"},
		},
		"#e0e0e0"],
];

var _lastMouseMoveTarget = "";
var _mouseMoveCount = 0;

function setUserAgentText() {
	var userAgent = navigator.userAgent;
	uaDiv = document.getElementById("useragent");
	setText(uaDiv, userAgent);
}

function resetTable() {
	clearTable();
	initOutputTable(_mouse_table_info);
}

function init() {
	setUserAgentText();
	//createOptions(document.getElementById("options2"), _mouse_event_info, _mouse_table_info);
	resetTable();

	var div_a = document.getElementById("div_a");
	var div_b = document.getElementById("div_b");
	var div_c = document.getElementById("div_c");
	for (var div of [div_a, div_b, div_c]) {
		addEventListener(div, "mousedown", onMouseDown.bind(null, div));
		addEventListener(div, "mouseenter", onMouseEnter.bind(null, div));
		addEventListener(div, "mouseleave", onMouseLeave.bind(null, div));
		addEventListener(div, "mousemove", onMouseMove.bind(null, div));
		addEventListener(div, "mouseout", onMouseOut.bind(null, div));
		addEventListener(div, "mouseover", onMouseOver.bind(null, div));
		addEventListener(div, "mouseup", onMouseUp.bind(null, div));
	}

	addEventListener(document.getElementById("body"), "keydown", onKeyDown);
	addEventListener(div_a, "contextmenu", onContextMenu);
}

function onKeyDown(e) {
	if (e.code == "KeyC") {
		resetTable();
		_lastMouseMoveTarget = "";
	}
}

function onContextMenu(e) {
	e.preventDefault();
	e.stopPropagation();
}

function onMouseDown(handler, e) {
	console.log(handler);
	handleMouseEvent("mousedown", handler, e);
}

function onMouseEnter(handler, e) {
	handleMouseEvent("mouseenter", handler, e);
}

function onMouseLeave(handler, e) {
	handleMouseEvent("mouseleave", handler, e);
}

function onMouseMove(handler, e) {
	_mouseMoveCount++;
	var saveMouseMoveCount = _mouseMoveCount;

	// Combine duplicate move moves in the same target by removing last one.
	var combine = document.getElementById("combine_mousemove");
	var show = document.getElementById("show_mousemove");
	if (show.checked && combine.checked && _lastMouseMoveTarget == e.target.id)
		deleteLastOutputRow();
	
	handleMouseEvent("mousemove", handler, e);
	
	_lastMouseMoveTarget = e.target.id;
	_mouseMoveCount = saveMouseMoveCount;
}

function onMouseOut(handler, e) {
	handleMouseEvent("mouseout", handler, e);
}

function onMouseOver(handler, e) {
	handleMouseEvent("mouseover", handler, e);
}

function onMouseUp(handler, e) {
	handleMouseEvent("mouseup", handler, e);
}

function handleMouseEvent(etype, handler, e) {
	var show = document.getElementById("show_" + etype);
	if (show.checked) {
		addMouseEvent(etype, handler, e);
	}
	handleDefaultPropagation(etype, e);

	_lastMouseMoveTarget = "";
	_mouseMoveCount = 0;
}

function addMouseEvent(etype, handler, e) {
	if (!e) {
		e = window.event;
	}
	var target = e.target.id;
	var handler = handler.id;
	var eventinfo = {};
	eventinfo["Event type"] = calcHilightString(etype, e.type, true);
	eventinfo["Count"] = (etype == "mousemove" ? _mouseMoveCount : "");

	eventinfo["A"] = (target == "div_a" ? "A" : "");
	eventinfo["B"] = (target == "div_b" ? "B" : "");
	eventinfo["C"] = (target == "div_c" ? "C" : "");

	eventinfo["hA"] = (handler == "div_a" ? (handler == target ? "-" : "A") : "");
	eventinfo["hB"] = (handler == "div_b" ? (handler == target ? "-" : "B") : "");
	eventinfo["hC"] = (handler == "div_c" ? (handler == target ? "-" : "C") : "");

	eventinfo["screenX"] = e.screenX;
	eventinfo["screenY"] = e.screenY;
	eventinfo["clientX"] = e.clientX;
	eventinfo["clientY"] = e.clientY;

	eventinfo["movementX"] = e.movementX;
	eventinfo["movementY"] = e.movementY;

	eventinfo["offsetX"] = e.offsetX;
	eventinfo["offsetY"] = e.offsetY;
	eventinfo["pageX"] = e.pageX;
	eventinfo["pageY"] = e.pageY;
	eventinfo["x"] = e.x;
	eventinfo["y"] = e.y;

	var button = "-";
	if (etype == "mousedown" || etype == "mouseup") {
		button = e.button;
	}
	eventinfo["button"] = button;
	eventinfo["buttons"] = e.buttons;

	eventinfo["getModifierState"] = getModifierState(e);
	eventinfo["shift"] = e.shiftKey;
	eventinfo["ctrl"] = e.ctrlKey;
	eventinfo["alt"] = e.altKey;
	eventinfo["meta"] = e.metaKey;

	addEventToOutput(eventinfo);
}

// =====
// Helper functions
// =====

function calcHilightString(eventType, data) {
	if (data === undefined) {
		return null;
	}

	var keySpan = document.createElement("span");
	var enableHilight = document.getElementById("hl_" + eventType);
	if (enableHilight && enableHilight.checked) {
		keySpan.classList.add("mouseevent_hilight");
		keySpan.classList.add(eventType + "_hilight");
	}
	keySpan.textContent = data;
	return keySpan;
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
}

