// Event test options block
// Gary Kacmarcik - garykac@{gmail|google}.com

_column_info = [
	["preventDefault", "pd_"],
	["stopPropagation", "sp_"],
	["ShowEvents", "show_"],
	["Highlight", "hl_"],
];

function createOptions(options_div, event_info, table_info, extra) {
	var table = document.createElement('table');
	var row, cell;

	table.classList.add("opttable");
	row = document.createElement('tr');

	for (var col of _column_info) {
		var name = col[0];
		var prefix = col[1];
		
		cell = document.createElement('td');
		cell.classList.add("optcell");
		addOptionTitle(cell, name);
		for (var event of event_info) {
			var e = event[0];
			var options = event[1][name];
			addOptionCheckbox(cell, prefix + e, e, options);
		}
		row.appendChild(cell);
	}

	cell = document.createElement('td');
	cell.classList.add("optcell");
	addOptionTitle(cell, "Show Fields");
	for (var group of table_info) {
		var name = group[0];
		var type = group[1];
		var options = group[3];
		options.enabled = true;
		options.class = type + "_header showfieldoption";
		options.onclick = 'showFieldClick(this)';
		if (name != "") {
			addOptionCheckbox(cell, "show_" + type, name, options);
		}
	}
	row.appendChild(cell);
	table.appendChild(row);

	if (extra != undefined && extra.length != 0) {
		var addTitle = true;
		for (var opt of extra) {
			row = document.createElement('tr');
			cell = document.createElement('td');
			cell.classList.add("optcell");
			cell.setAttribute("colspan", "5");

			if (addTitle) {
				addOptionTitle(cell, "General Options");
				addTitle = false;
			}

			var type = opt[0];
			if (type == "checkbox") {
				var name = opt[1];
				var label = opt[2];
				var options = opt[3];
				addOptionCheckbox(cell, name, label, options);
			} else if (type == "text") {
				var text = opt[1];
				cell.appendChild(document.createTextNode(text));
			} else if (type == "input") {
				var name = opt[1];
				var label = opt[2];
				var options = opt[3];
				addOptionInput(cell, name, label, options);
			}

			row.appendChild(cell);
			table.appendChild(row);
		}
	}

	options_div.appendChild(table);
}

function addOptionTitle(cell, title) {
	var span = document.createElement('span');
	span.classList.add("opttitle");
	span.textContent = title;
	cell.appendChild(span);
	cell.appendChild(document.createElement("br"));
}

function addOptionCheckbox(cell, id, text, options) {
	if (options.enabled === undefined)
		options.enabled = true;
	if (options.checked === undefined)
		options.checked = true;

	var input = document.createElement("input");
	input.type = "checkbox";
	input.id = id;
	input.checked = options.checked;
	input.disabled = !options.enabled;
	if (options.onclick != undefined && options.onclick != "") {
		input.setAttribute("onclick", options.onclick);
	}
	cell.appendChild(input);

	var label = document.createElement("label");
	label.setAttribute("for", id);
	var span = document.createElement('span');
	if (options.class !== undefined) {
		for (var c of options.class.split(' ')) {
			span.classList.add(c);
		}
	}
	span.appendChild(document.createTextNode(text));
	label.appendChild(span);
	cell.appendChild(label);

	cell.appendChild(document.createElement("br"));
}

function addOptionInput(cell, id, text, options) {
	var label = document.createElement("label");
	label.setAttribute("for", id);
	var span = document.createElement('span');
	if (options.class !== undefined) {
		for (var c of options.class.split(' ')) {
			span.classList.add(c);
		}
	}

	span.appendChild(document.createTextNode(text));
	label.appendChild(span);
	cell.appendChild(label);

	cell.appendChild(document.createElement("br"));

	if (options.enabled === undefined)
	options.enabled = true;
	if (options.defaultvalue === undefined)
		options.defaultvalue = "";

	var input = document.createElement("input");
	input.type = "text";
	input.id = id;
	input.value = options.defaultvalue;
	input.disabled = !options.enabled;
	if (options.onfocusout !== undefined && options.onfocusout != "") {
		input.setAttribute("onfocusout", options.onfocusout);
	}
	cell.appendChild(input);
}

function addOptionText(cell, prefix, id, text) {
	var span1 = document.createElement('span');
	span1.classList.add("opttext");
	span1.appendChild(document.createTextNode(prefix));

	var span2 = document.createElement('span');
	span2.id = id;
	span2.textContent = 0;
	span1.appendChild(span2);
	span1.appendChild(document.createTextNode(text));

	cell.appendChild(span1);
	cell.appendChild(document.createElement("br"));
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

