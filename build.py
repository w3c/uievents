import os.path
import re
import subprocess
import sys

def error(msg):
	print 'Error: %s' % (msg)
	sys.exit(1)

class Parser():
	"""Pre-bikeshed parser for uievents spec."""

	TABLE_TYPE_EVENT_SEQUENCE = 'event-sequence'

	def __init__(self):
		self.curr_src = ''
		self.curr_dst = ''

		self.in_table = False
		self.table_type = ''
		self.table_header_data = []
		self.table_row_data = []
		self.is_header_row = False

		self.id = '0'
		self.event = 'evy'
		self.desc = 'desc'

	def event_type(self, type):
		if type == '' or type == '...':
			return type
		return '<a><code>' + type + '</code></a>'

	def table_row(self):
		if self.is_header_row:
			self.table_row_data = self.table_header_data

		if len(self.table_row_data) == 0:
			return '';
		row = '<tr>'
		for i in range(0, len(self.table_row_data)):
			data = self.table_row_data[i]
			colname = self.table_header_data[i]
			pre = '<td>'
			post = '</td>'
			if self.is_header_row:
				pre = '<th>'
				post = '</th>'
			if colname == '#':
				pre = '<td class="cell-number">'
				if self.is_header_row:
					data = ''
			if not self.is_header_row and data != '':
				if colname == 'Event Type':
					data = self.event_type(data)
				if colname == 'DOM Interface':
					data = '{{' + data + '}}'
			row += pre + self.process_text(data) + post
		row += '</tr>\n'
		return row

	def process_text(self, desc):
		m = re.match(r'^(.*)EVENT{(.+?)}(.*)$', desc)
		if m:
			pre = self.process_text(m.group(1))
			name = m.group(2)
			post = self.process_text(m.group(3))
			desc = pre + self.event_type(name) + post

		m = re.match(r'^(.*)CODE{(.*?)}(.*)$', desc)
		if m:
			pre = self.process_text(m.group(1))
			name = m.group(2)
			post = self.process_text(m.group(3))
			desc = '%s<code class="code">"<a href="http://www.w3.org/TR/uievents-code/#code-%s">%s</a>"</code>%s' % (pre, name, name, post)

		m = re.match(r'^(.*)KEY{(.+?)}(.*)$', desc)
		if m:
			pre = self.process_text(m.group(1))
			name = m.group(2)
			post = self.process_text(m.group(3))
			desc = '%s<code class="key">"<a href="http://www.w3.org/TR/uievents-key/#key-%s">%s</a>"</code>%s' % (pre, name, name, post)

		m = re.match(r'^(.*)KEY_NOLINK{(.+?)}(.*)$', desc)
		if m:
			pre = self.process_text(m.group(1))
			name = m.group(2)
			post = self.process_text(m.group(3))
			desc = '%s<code class="key">"%s"</code>%s' % (pre, name, post)

		m = re.match(r'^(.*)KEYCAP{(.+?)}(.*)$', desc)
		if m:
			pre = self.process_text(m.group(1))
			name = m.group(2)
			post = self.process_text(m.group(3))
			desc = pre + '<code class="keycap">' + name + '</code>' + post

		m = re.match(r'^(.*)GLYPH{(.*?)}(.*)$', desc)
		if m:
			pre = self.process_text(m.group(1))
			name = m.group(2)
			post = self.process_text(m.group(3))
			desc = pre + '<code class="glyph">"' + name + '"</code>' + post

		m = re.match(r'^(.*)UNI{(.+?)}(.*)$', desc)
		if m:
			pre = self.process_text(m.group(1))
			name = m.group(2)
			post = self.process_text(m.group(3))
			desc = pre + '<code class="unicode">' + name + '</code>' + post

		return desc

	def process_line(self, line):
		if self.in_table:
			# Header rows begin with =
			m = re.match(r'^\s*\=\|(.*)\|$', line)
			if m:
				self.table_header_data = [x.strip() for x in m.group(1).split('|')]
				self.is_header_row = True
				return ''

			# New data rows begin with =
			m = re.match(r'^\s*\+\|(.*)\|$', line)
			if m:
				result = self.table_row()
				self.table_row_data = [x.strip() for x in m.group(1).split('|')]
				self.is_header_row = False
				return result

			# Separator lines: +---+----+-------+
			m = re.match(r'^\s*\+--', line)
			if m:
				return ''

			# Tables end with: ++---+----+-------+
			m = re.match(r'^\s*\+\+--', line)
			if m:
				self.in_table = False
				return self.table_row() + '</table>\n'

			# Row continued from previous line.
			m = re.match(r'^\s*\|(.*)\|', line)
			if m:
				num_columns = len(self.table_header_data)
				extra_data = [x.strip() for x in m.group(1).split('|')]
				if len(extra_data) != num_columns:
					error('Unexpected number of columns (%d) in row (expected %d):\n%s'
							% (len(extra_data), num_columns, line))
				for i in range(0, len(self.table_header_data)):
					if len(extra_data[i]) != 0:
						if self.is_header_row:
							self.table_header_data[i] += ' ' + extra_data[i]
						else:
							self.table_row_data[i] += ' ' + extra_data[i]
				return ''

			error('Expected table line')
			return('')

		# Tables begin with: ++---+----+-------+
		m = re.match(r'^\s*\+\+--', line)
		if m:
			self.in_table = True
			self.table_type = Parser.TABLE_TYPE_EVENT_SEQUENCE
			self.table_row_data = []
			return '<table class="event-sequence-table">\n'

		return self.process_text(line)

	def process(self, src, dst):
		self.curr_src = src
		self.curr_dst = dst

		if not os.path.isfile(src):
			error('File "%s" doesn\'t exist' % src)

		try:
			infile = open(src, 'r')
		except IOError as e:
			error('Unable to open "%s" for reading: %s' % (src, e))

		try:
			outfile = open(dst, 'w')
		except IOError as e:
			error('Unable to open "%s" for writing: %s' % (dst, e))

		for line in infile:
			new_line = self.process_line(line)
			outfile.write(new_line)

		outfile.close()
		infile.close()


def main():
	sections = [
		'introduction',
		'conventions',
		'architecture',
		'event-interfaces',
		'event-types',
		'keyboard',
		'legacy-event-initializers',
		'legacy-key-attributes',
		'legacy-event-types',
		'extending-events',
		'security',
		'privacy',
		'changes',
		'acknowledgements',
		'glossary',
	]

	for section in sections:
		infilename = 'sections/' + section + '.txt'
		outfilename = 'sections/' + section + '.include'

		# Generate the full bikeshed file.
		parser = Parser()
		parser.process(infilename, outfilename)

	subprocess.call(["bikeshed"])

if __name__ == '__main__':
	main()
