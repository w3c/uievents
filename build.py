import os.path
import re
import subprocess
import sys

DEBUG = False

class Parser():
	"""Pre-bikeshed parser for uievents spec."""

	TABLE_TYPE_EVENT_SEQUENCE = 'event-sequence'
	TABLE_TYPE_EVENT_DEFINITION = 'event-definition'

	def __init__(self):
		self.curr_src = ''
		self.curr_dst = ''

		self.in_table = False
		self.table_type = ''
		self.table_header_data = []
		self.table_column_format = []
		self.table_row_data = []
		self.is_header_row = False

		self.id = '0'
		self.event = 'evy'
		self.desc = 'desc'

	def error(self, msg):
		print self.curr_src, self.line
		print 'Error: %s' % (msg)
		sys.exit(1)

	def event_type(self, type):
		if type == '' or type == '...':
			return type
		return '<a><code>' + type + '</code></a>'

	def table_row(self):
		# Don't print header row for event-definition.
		if self.is_header_row and self.table_type == Parser.TABLE_TYPE_EVENT_DEFINITION:
			return ''
			
		if self.is_header_row:
			self.table_row_data = self.table_header_data

		if len(self.table_row_data) == 0:
			return ''
		row = '<tr>'
		for i in range(0, len(self.table_row_data)):
			data = self.table_row_data[i]
			colname = self.table_header_data[i]
			align = self.table_column_format[i]
			style = ''
			if align == 'right':
				style = ' style="text-align:right"'
			elif align == 'center':
				style = ' style="text-align:center"'
			pre = '<td%s>' % style
			post = '</td>'
			if self.is_header_row or colname == '%':
				pre = '<th%s>' % style
				post = '</th>'
			if colname == '#':
				pre = '<td class="cell-number"%s>' % style
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
			if name[0:2] != 'U+':
				self.error('Invalid Unicode value (expected U+xxxx): %s\n' % name)
			desc = pre + '<code class="unicode">' + name + '</code>' + post

		return desc

	def process_line(self, line):
		if self.in_table:
			# Header rows begin with '=|'
			m = re.match(r'^\s*\=\|(.*)\|$', line)
			if m:
				self.table_header_data = [x.strip() for x in m.group(1).split('|')]
				self.is_header_row = True
				return ''

			# New data rows begin with '+|'
			m = re.match(r'^\s*\+\|(.*)\|$', line)
			if m:
				result = self.table_row()
				self.table_row_data = [x.strip() for x in m.group(1).split('|')]
				self.is_header_row = False
				return result

			# Tables end with: '++--'
			m = re.match(r'^\s*\+\+--', line)
			if m:
				self.in_table = False
				return self.table_row() + '</table>\n'

			# Separator lines begin with ' +' and end with '+'
			# They may only contain '-', '+' and 'o'.
			m = re.match(r'^\s* \+([\-\+o]+)\+', line)
			if m:
				# Separator lines may contain column formatting info.
				num_columns = len(self.table_header_data)
				format_data = [x.strip() for x in m.group(1).split('+')]
				if len(format_data) != num_columns:
					self.error('Unexpected number of columns (%d) in row (expected %d):\n%s'
							% (len(format_data), num_columns, line))
				for i in range(0, len(self.table_header_data)):
					align = 'left'
					if len(format_data[i]) != 0:
						if format_data[i][0] == 'o':
							align = 'left'
						elif format_data[i][-1] == 'o':
							align = 'right'
						elif 'o' in format_data[i]:
							align = 'center'
					self.table_column_format.append(align)
				return ''

			# Row continued from previous line: ' |'
			m = re.match(r'^\s*\|(.*)\|', line)
			if m:
				num_columns = len(self.table_header_data)
				extra_data = [x.strip() for x in m.group(1).split('|')]
				if len(extra_data) != num_columns:
					self.error('Unexpected number of columns (%d) in row (expected %d):\n%s'
							% (len(extra_data), num_columns, line))
				for i in range(0, len(self.table_header_data)):
					if len(extra_data[i]) != 0:
						if self.is_header_row:
							self.table_header_data[i] += ' ' + extra_data[i]
						else:
							self.table_row_data[i] += ' ' + extra_data[i]
				return ''

			self.error('Expected table line: ' + line)
			return('')

		# Tables begin with: ++---+----+-------+
		m = re.match(r'^\s*\+\+--[\-\+]*\+(?P<class> [\-a-z]+)?$', line)
		if m:
			table_class = m.group('class')
			if table_class == None:
				table_class = 'event-sequence-table'
				self.table_type = Parser.TABLE_TYPE_EVENT_SEQUENCE
			else:
				table_class = table_class[1:]
				self.table_type = Parser.TABLE_TYPE_EVENT_DEFINITION
			self.in_table = True
			#self.table_type = Parser.TABLE_TYPE_EVENT_SEQUENCE
			self.table_header_data = []
			self.table_column_format = []
			self.table_row_data = []
			return '<table class="%s">\n' % table_class

		return self.process_text(line.rstrip()) + '\n'

	def process(self, src, dst):
		print 'Processing', src
		self.curr_src = src
		self.curr_dst = dst

		if not os.path.isfile(src):
			self.error('File "%s" doesn\'t exist\n' % src)

		try:
			infile = open(src, 'r')
		except IOError as e:
			self.error('Unable to open "%s" for reading: %s\n' % (src, e))

		try:
			outfile = open(dst, 'w')
		except IOError as e:
			self.error('Unable to open "%s" for writing: %s\n' % (dst, e))

		self.line = 0
		for line in infile:
			self.line += 1
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

	print 'Bikeshedding...'
	cmd = ["bikeshed", "spec"]
	if DEBUG:
		cmd.append('--line-numbers')
	subprocess.call(cmd)

if __name__ == '__main__':
	main()
