module('Optgroup-results')

//setClasss
test('it sets all aria-selected[false] options in data to true');
test('it unsets all aria-selected[true] options not in the data');
test('it does not change all aria-selected[true] in the data');
test('it does not change all aria-selected[false] in the data');

test('it sets all aria-selected[false] groups in data to true');
test('it unsets all aria-selected[true] groups not in the data');
test('it does not change all aria-selected[true] groups in the data');
test('it does not change all aria-selected[false] groups the data');

//bind
test('mouseup on selected optgroup triggers optgroup:unselect and calls setClasses');
test('mouseup on unselected optgroup triggers optgroup:select and calls setClasses');
test('mouseup on unselected optgroup closes container if closeOnSelect=true');
test('mouseup on unselected optgroup keeps container open if closeOnSelect=false');

//option
//var $label = $(option).find('.select2-results__group');
test('gives the group role=treeitem, aria-selected=false')
test('gives the group.data')
