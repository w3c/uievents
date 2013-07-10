/* Convert <key> tags into a proper <table> of key info.
 * The document must be structured as follows:
 *   <div class="key-table">
 *     <key name="name" cat="cat" char="0000">Key description.</key>
 *     ...
 *   </div>
 * where:
 *   name: The name of the 'key' attribute.
 *   cat: The category (e.g.: 'General' or 'Math') of the key.
 *   char: (optional) The 4-digit hexadecimal Unicode value.
 *
 * Multiple key-tables can be present in a single document.
 */
function create_key_tables() {
	keytables = document.getElementsByClassName("key-table");
	for (var i = 0; i < keytables.length; i++) {
		create_key_table(keytables[i]);
	}
}

function create_key_table(tablediv) {
	var table = document.createElement('table');
	table.setAttribute('class', 'data-table key-value-table');

	var row = table.insertRow(-1);
	var cell;

	// Build the header row.
	cell = document.createElement('th');
	cell.setAttribute('width', '20%');
	cell.appendChild(document.createTextNode('Key'));
	row.appendChild(cell);
	cell = document.createElement('th');
	cell.setAttribute('width', '80%');
	cell.appendChild(document.createTextNode('Typical Usage (Informative)'));
	row.appendChild(cell);

	while (tablediv.hasChildNodes()) {
		var key = tablediv.removeChild(tablediv.firstChild);
		if (key.nodeType != 1) {
			continue;
		}
		var keyname = key.getAttribute('name');
		
		row = table.insertRow(-1);
		var code;
		
		cell = row.insertCell(-1);
		cell.setAttribute('class', 'key-table-key');
		code = document.createElement('code');
		code.id = 'key-' + keyname;
		code.setAttribute('class', 'key');
		code.appendChild(document.createTextNode("'" + keyname + "'"));
		cell.appendChild(code);

		cell = row.insertCell(-1);
		while (key.hasChildNodes()) {
			var child = key.removeChild(key.firstChild);
			cell.appendChild(child);
		}
	}

	tablediv.appendChild(table);
}

if (window.addEventListener) {
	window.addEventListener('load', create_key_tables, false);
}
