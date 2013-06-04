/* Convert <key> tags into a proper <table> of key info.
 */
function create_key_table() {
	var tablediv = document.getElementById('keytable');
	if (!tablediv) {
		return;
	}

	var table = document.createElement('table');
	table.setAttribute('class', 'data-table');

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
		
	var keys = document.getElementsByTagName('key');
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
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

	// Remove all <key> tags from the 'keytable'.
	while (tablediv.hasChildNodes()) {
		tablediv.removeChild(tablediv.lastChild);
	}
	
	tablediv.appendChild(table);
}

if (window.addEventListener) {
	window.addEventListener('load', create_key_table, false);
}
