module('Optgroup-Data');

// current
test('returns option if they have :selected', function(assert){
    
});

test('returns optgroup if they have .selected-custom');
test('returns mixed group of option and optgroup');
test('does not return option if it returns the optgroup');

// select
test('selects the option');
test('if all sibling elements in optgroup are selected, selects the optgroup');

// unselect
test('unselects the option');
test('unselects the parent optgroup');

// optgroup select
test('selects the optgroup');
test('selects all of the child selects');

// optgroup unselect
test('unselects the optgroup');
test('unselects all of the child elements');
