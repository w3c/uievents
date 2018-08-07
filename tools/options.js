
_column_info = [
	["preventDefault", "pd_"],
	["stopPropagation", "sp_"],
	["ShowEvents", "show_"],
	["Highlight", "hl_"],
];

function createOptions(options_div, event_info, table_info) {
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
		var options = {
			"checked": true,
			"class": type + "_header showfieldoption",
		};
		if (name != "") {
			addOptionCheckbox(cell, "show_" + name, name, options);
		}
	}
	row.appendChild(cell);
	table.appendChild(row);

	row = document.createElement('tr');
	cell = document.createElement('td');
	cell.classList.add("optcell");
	cell.setAttribute("colspan", "5");
	addOptionTitle(cell, "General Options");
	addOptionCheckbox(cell, "combine_mousemove", "Combine mousemove events with same target", {"checked": true});
	row.appendChild(cell);
	table.appendChild(row);

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
    var label = document.createElement("label");

    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.checked = options.checked;
    input.disabled = options.disabled;
    label.appendChild(input);

    var span = document.createElement('span');
    if (options.class !== undefined) {
	    for (var c of options.class.split(' ')) {
		    span.classList.add(c);
		}
	}
    span.appendChild(document.createTextNode(" " + text));
    label.appendChild(span);
    cell.appendChild(label);

    cell.appendChild(document.createElement("br"));
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
