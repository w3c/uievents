// Keyboard event viewer
// Gary Kacmarcik - garykac@{gmail|google}.com

var _focus_table_info = [
	// Unlabeled group
	["", "etype", [
		["#", "etype", "text"],
		["Event type", "etype", "html"],
	], {'grouplabel': false}],

	// MouseEvent - Target
	["Target", "target", [
		["A", "target", "text", {'style': 'hilite_div_a'}],
		["B", "target", "text", {'style': 'hilite_div_b'}],
	], {'checked': true}],

	// FocusEvent - relatedTarget
	["FocusEvent", "focusevent", [
		["rA", "focusevent", "text", {'style': 'hilite_div_a'}],
		["rB", "focusevent", "text", {'style': 'hilite_div_b'}],
	], {'checked': true}],

];

var _focus_event_info = [
	["blur", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': false, 'class': "focusevent_hilight blur_hilight"},
		},
		"#ffcccc"],
	["focusin", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': true, 'class': "focusevent_hilight focusin_hilight"},
		},
		"#e0e0e0"],
	["focusout", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': true, 'class': "focusevent_hilight focusout_hilight"},
		},
		"#ccffcc"],
	["DOMFocusIn", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': false, 'class': "focusevent_hilight domfocusin_hilight"},
		},
		"#ffffff"],
	["DOMFocusOut", {
		'preventDefault': {'checked': false},
		'stopPropagation': {},
		'ShowEvents': {},
		'Highlight': {'checked': false, 'class': "focusevent_hilight domfocusout_hilight"},
		},
		"repeating-linear-gradient(-45deg, #fcc, #fcc 8px, #fff 8px, #fff 16px)"],
];


function setUserAgentText() {
	var userAgent = navigator.userAgent;
	uaDiv = document.getElementById("useragent");
	setText(uaDiv, userAgent);
}

function resetTable(resetData=true) {
	clearTable();
	initOutputTable(_focus_table_info);

	//setInputFocus(resetData);
}

function init() {
	setUserAgentText();

	createOptions(document.getElementById("options"), _focus_event_info, _focus_table_info, []);
	resetTable(false);

	var input_a = document.getElementById("input_a");
	var input_b = document.getElementById("input_b");
	for (var div of [input_a, input_b]) {
		console.log("addign focus handlers");
		addEventListener(div, "blur", onBlur);
		addEventListener(div, "focusin", onFocusIn);
		addEventListener(div, "focusout", onFocusOut);
		addEventListener(div, "DOMFocusIn", onDomFocusIn);
		addEventListener(div, "DOMFocusOut", onDomFocusOut);
	}
}

// =====
// Focus events: blur, focusin, focusout
// =====

function onBlur(e) {
	handleFocusEvent("blur", e);
}

function onFocusIn(e) {
	handleFocusEvent("focusin", e);
}

function onFocusOut(e) {
	handleFocusEvent("focusout", e);
}

function onDomFocusIn(e) {
	handleFocusEvent("DomFocusIn", e);
}

function onDomFocusOut(e) {
	handleFocusEvent("DOMFocusOut", e);
}

function handleFocusEvent(etype, e) {
	console.log(etype);
	var show = document.getElementById("show_" + etype);
	if (show.checked) {
		addFocusEvent(etype, e);
	}
	handleDefaultPropagation(etype, e);
}

function addFocusEvent(etype, e) {
	if (!e) {
		e = window.event;
	}
	var target = e.target.id;
	var relatedTarget = e.relatedTarget.id;
	var eventinfo = {};
	eventinfo["Event type"] = calcHilightString(etype, e.type);
	eventinfo["A"] = (target == "input_a" ? "A" : "");
	eventinfo["B"] = (target == "input_b" ? "B" : "");
	eventinfo["rA"] = (relatedTarget == "input_a" ? "A" : "");
	eventinfo["rB"] = (relatedTarget == "input_b" ? "B" : "");

	addEventToOutput(eventinfo);
}

// =====
// Helper functions
// =====

/* Set the focus to the input box. */
function setInputFocus(resetData) {
	var input = document.getElementById("input_a");

	if (resetData) {
		input.value = "";
	}

	// Set focus.
	input.focus();
}

function calcHilightString(eventType, data) {
	if (data === undefined) {
		return null;
	}

	var keySpan = document.createElement("span");
	var enableHilight = document.getElementById("hl_" + eventType);
	if (enableHilight && enableHilight.checked) {
		keySpan.classList.add("focusevent_hilight");
		keySpan.classList.add(eventType + "_hilight");
	}
	keySpan.textContent = data;
	return keySpan;
}

