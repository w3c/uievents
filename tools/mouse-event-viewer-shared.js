// Mouse event viewer - shared
// Gary Kacmarcik - garykac@{gmail|google}.com

var _mouse_event_info = [
	["mousedown", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'class': "mouseevent_hilight mousedown_hilight"},
		},
		"#e0e0e0"],
	["mouseenter", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'enabled': false, 'checked': false},
		'ShowEvents': {},
		'Highlight': {'class': "mouseevent_hilight mouseenter_hilight"},
		},
		"#ccffcc"],
	["mouseleave", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'enabled': false, 'checked': false},
		'ShowEvents': {},
		'Highlight': {'class': "mouseevent_hilight mouseleave_hilight"},
		},
		"#ffcccc"],
	["mousemove", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': false, 'class': "mouseevent_hilight mousemove_hilight"},
		},
		"#ffffff"],
	["mouseout", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': false, 'class': "mouseevent_hilight mouseout_hilight"},
		},
		"repeating-linear-gradient(-45deg, #fcc, #fcc 8px, #fff 8px, #fff 16px)"],
	["mouseover", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': false, 'class': "mouseevent_hilight mouseover_hilight"},
		},
		"repeating-linear-gradient(-45deg, #cfc, #cfc 8px, #fff 8px, #fff 16px)"],
	["mouseup", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'class': "mouseevent_hilight mouseup_hilight"},
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

function init_shared() {
	setUserAgentText();
	var extra_options = [
		["checkbox", "combine_mousemove", "Combine mousemove events with same target", {}],
		["text", "Note: Options apply to new events only."],
		["text", "Press 'c' to Clear Table."],
	];
	createOptions(document.getElementById("options"), _mouse_event_info, _mouse_table_info, extra_options);
	resetTable();
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
	eventinfo["sD"] = (target == "div_d" ? "sD" : "");
	eventinfo["sE"] = (target == "div_e" ? "sE" : "");

	eventinfo["hA"] = (handler == "div_a" ? (handler == target ? "-" : "A") : "");
	eventinfo["hB"] = (handler == "div_b" ? (handler == target ? "-" : "B") : "");
	eventinfo["hC"] = (handler == "div_c" ? (handler == target ? "-" : "C") : "");

	eventinfo["eventPhase"] = getEventPhase(e);
	eventinfo["bubbles"] = e.bubbles;
	eventinfo["cancelable"] = e.cancelable;
	eventinfo["defaultPrevented"] = e.defaultPrevented;
	eventinfo["composed"] = e.composed;
	eventinfo["isTrusted"] = e.isTrusted;
	eventinfo["timeStamp"] = e.timeStamp;

	eventinfo["view"] = calcString(e.view !== null ? e.view.name : "null");
	eventinfo["detail"] = e.detail;

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

