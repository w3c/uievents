// Event test output table
// Gary Kacmarcik - garykac@{gmail|google}.com

// Output table
// Assumes:
// * The html contains and empty <table> with id="output".
//   <table id="output"></table>
// * First column of table is '#' and will contain an auto-generated sequence id.
// * For each group-type, there is a CSS class with that name and one for the header
//   with a '_header' suffix.
// * There is a 'subheader' CSS class for the 2nd header row.

var NUM_HEADER_ROWS = 2;
var DEFAULT_MAX_OUTPUT_ROWS = 100;

// Sequence ID for numbering events.
var _seqId = 1;


// Output table info
// Format:
// array of <group-info>
// <group-info> : [ <group-title>, <group-type>, <styles>, <num-cols>, <columns> ]
//   <group-title> : 
//   <group-type> : cell type for style
//   <columns> : an array of <col-info>
// <col-info> : [ <title>, <cell-type>, <options> ]
// <options> : dict of options:
//   'align': left
var _table_info;

function initOutputTable(table_info) {
	_table_info = table_info;
	createTableHeader();
	_seqId = 1;
}

function createTableHeader(table_info) {
	var table = document.getElementById("output");
	var head = table.createTHead();
	var row1 = head.insertRow(-1);  // For column group names
	var row2 = head.insertRow(-1);  // For column names

	for (var group of _table_info) {
		var group_title = group[0];
		var group_type = group[1];
		var group_style = group_type + '_header';
		var columns = group[2];
		var options = group[3];
		if (options.grouplabel != undefined && !options.grouplabel) {
			group_title = "";
			group_style = "";
		}
		addTableCellText(row1, group_title, group_type, group_style, columns.length);

		for (var col of columns) {
			var title = col[0];
			var type = col[1];
			var format = col[2];
			var options = col[3];

			var style = [type + '_header', 'subheader'];
			if (options && options['style']) {
				style.push(options['style']);
			}

			addTableCellText(row2, title, type, style);
		}
	}
}

function clearTable() {
	clearChildren(document.getElementById("output"));
}

/* Create the event table row from the event info */
function addEventToOutput(eventinfo, extra_class) {
	var row = addOutputRow(extra_class);

	for (var group of _table_info) {
		var columns = group[2];
		for (var col of columns) {
			var title = col[0];
			var type = col[1];
			var format = col[2];
			var options = col[3];
			
			var val = eventinfo[title];
			if (title == '#') {
				val = _seqId;
			}
			
			var style = undefined;
			var align = undefined;
			if (options && val != "") {
				style = options['style'];
				align = options['align'];
			}
			
			if (format == 'text')
				addTableCellText(row, val, type, style, undefined, align);
			else if (format == 'bool')
				addTableCellBoolean(row, val, type, style, undefined, align);
			else
				addTableCell(row, val, type, style, undefined, align);
		}
	}

	_seqId++;
}

// Delete the most recent output row.
function deleteLastOutputRow() {
	var table = document.getElementById("output");
	table.deleteRow(NUM_HEADER_ROWS);
}

// extra_class: Additional CSS class to add to this row.
function addOutputRow(extra_class) {
	var table = document.getElementById("output");

	while (table.rows.length >= maxNumberOfRows()) {
		table.deleteRow(-1);
	}
	// Insert after the header rows.
	var row = table.insertRow(NUM_HEADER_ROWS);
	if (extra_class) {
		row.classList.add(extra_class);
	}
	return row;
}

function addTableCellBoolean(row, key, celltype) {
	var modstyle = key ? "modOn" : "modOff";
	addTableCellText(row, calcBoolean(key), celltype, modstyle);
}

function calcBoolean(key) {
	return key ? "✓" : "✗";
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
	if (style !== undefined && style != "") {
		if (style instanceof Array) {
			for (var i = 0; i < style.length; i++) {
				cell.classList.add(style[i]);
			}
		} else {
			cell.classList.add(style);
		}
	}
	if (celltype == "etype") {
		return;
	}
	// Hide this cell if it belongs to a hidden celltype.
	var show = document.getElementById("show_" + celltype).checked;
	if (!show) {
		cell.style.display = "none";
	}
}

// =====
// Helper functions
// =====

function clearChildren(e) {
	while (e.firstChild !== null) {
		e.removeChild(e.firstChild);
	}
}

function setText(e, text) {
	clearChildren(e);
	e.appendChild(document.createTextNode(text));
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

	// Safari doesn't define getModifierState for mouse events.
	if (e.getModifierState === undefined) {
		return "Undefined";
	}

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

function getEventPhase(e) {
	var p = e.eventPhase;
	var phase = '?';
	if (p == 0)
		phase = 'None';
	else if (p == 1)
		phase = 'Capturing';
	else if (p == 2)
		phase = 'AtTarget';
	else if (p == 3)
		phase = 'Bubbling';
	return phase;
}

function calcString(data) {
	if (data === undefined) {
		return data;
	}
	return "'" + data + "'";
}

function maxNumberOfRows() {
	var input = document.getElementById("numberOfRows");
	var numberOfRows = DEFAULT_MAX_OUTPUT_ROWS;
	if (input !== undefined) {
		numberOfRows = parseInt(input.value);
	}

	var maxRows = numberOfRows + NUM_HEADER_ROWS;
	return maxRows;
}