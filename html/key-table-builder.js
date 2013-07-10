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
	table.setAttribute('class', 'data-table');
	table.setAttribute('width', '100%');

	var row = table.insertRow(-1);
	var cell;

	// Build the header row.
	cell = document.createElement('th');
	cell.appendChild(document.createTextNode('Key'));
	row.appendChild(cell);
	cell = document.createElement('th');
	cell.appendChild(document.createTextNode('Char'));
	row.appendChild(cell);
	cell = document.createElement('th');
	cell.appendChild(document.createTextNode('Typical Usage (Informative)'));
	row.appendChild(cell);
	cell = document.createElement('th');
	cell.appendChild(document.createTextNode('Category (Informative)'));
	row.appendChild(cell);

	while (tablediv.hasChildNodes()) {
		var key = tablediv.removeChild(tablediv.firstChild);
		if (key.nodeType != 1) {
			continue;
		}
		console.log(key);
		var keyname = key.getAttribute('name');
		var keychar = key.getAttribute('char') || '';
		var keycat = key.getAttribute('cat');
		
		row = table.insertRow(-1);
		var code;
		
		cell = row.insertCell(-1);
		code = document.createElement('code');
		code.id = 'key-' + keyname;
		code.setAttribute('class', 'key');
		code.appendChild(document.createTextNode("'" + keyname + "'"));
		cell.appendChild(code);

		cell = row.insertCell(-1);
		code = document.createElement('code');
		code.id = 'key-U-' + keyname;
		code.setAttribute('class', 'char');
		if (keychar != '') {
			keychar = "'\\u" + keychar + "'";
		}
		code.appendChild(document.createTextNode(keychar));
		cell.appendChild(code);

		cell = row.insertCell(-1);
		while (key.hasChildNodes()) {
			var child = key.removeChild(key.firstChild);
			cell.appendChild(child);
		}

		cell = row.insertCell(-1);
		cell.setAttribute('class', 'category');
		cell.appendChild(document.createTextNode(keycat));
	}

	tablediv.appendChild(table);
}

if (window.addEventListener) {
	window.addEventListener('load', create_key_tables, false);
}
