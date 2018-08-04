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
var MAX_OUTPUT_ROWS = 100 + NUM_HEADER_ROWS;

// Sequence ID for numbering events.
var _seqId = 1;

var _table_info;

function initOutputTable(table_info) {
	_table_info = table_info;
	createTableHeader(table_info);
	_seqId = 1;
}

function createTableHeader(table_info) {
	var table = document.getElementById("output");
	var head = table.createTHead();
	var row1 = head.insertRow(-1);  // For column group names
	var row2 = head.insertRow(-1);  // For column names

	for (var group of table_info) {
		var group_title = group[0]
		var group_type = group[1]
		var group_style = group_type + '_header'
		var columns = group[2	]
		addTableCellText(row1, group_title, group_type, group_style, columns.length);

		for (var col of columns) {
			var title = col[0];
			var type = col[1]
			var style = [type + '_header', 'subheader']
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
	addTableCellText(row, _seqId, "etype");
	addTableCell(row, eventinfo["Event type"], "etype");
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
	addTableCellText(row, eventinfo["locale"], "proposed");
	addTableCellText(row, eventinfo["Input field"], "inputbox");
	_seqId++;
}

// extra_class: Additional CSS class to add to this row.
function addOutputRow(extra_class) {
	var table = document.getElementById("output");

	while (table.rows.length >= MAX_OUTPUT_ROWS) {
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
