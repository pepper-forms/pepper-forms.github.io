import sys
import os
import re


def get_html_element(elem_type, name):
    if elem_type == 'text':
        return '<input type="text" name="%s"/>' % name
    if elem_type == 'span':
        return '<span name="%s">%s</span>' % (name, name)
    if elem_type == 'textarea':
        return '<textarea name="%s"></textarea>' % name
    return '%' + elem_type + ':' + name + '%'


if len(sys.argv) < 3:
    print('\u001b[31musage\u001b[0m: %s input_file output_file' % sys.argv[0])
    sys.exit(1)

input_file = sys.argv[1]
if not os.path.exists(input_file):
    print('\u001b[31minput file %s does not exists\u001b[0m' % sys.argv[1])
    sys.exit(1)


with open(input_file, 'r') as f:
    input_stream = f.read()


keys = re.findall(r'(?<=%)[a-z0-9_:]+?(?=%)', input_stream)
for key in keys:
    elem_type, key = key.split(':')
    print('Found key: \u001b[35m%s\u001b[0m (type: %s)' % (key, elem_type))
    print('Processing...', end=" ")
    regexp = re.compile('%'+ elem_type + ':' + key + '%')
    input_elem = get_html_element(elem_type, key)
    input_stream = re.sub(regexp, input_elem, input_stream)
    print('done!')

print('\u001b[35mSaving result into %s...\u001b[0m' % sys.argv[2])
with open(sys.argv[2], 'w') as f:
    f.write(input_stream)

print('\u001b[32m\u001b[1mSuccess!\u001b[0m')
