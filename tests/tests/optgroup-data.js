module('Optgroup-Data');

var Options = require('select2/options');
var OptgroupData = require('optgroup-data');
var selectOptions = new Options({});

// test('current gets default for multiple', function (assert) {
//   var $select = $('#qunit-fixture .multiple');
//
//   var data = new SelectData($select, selectOptions);
//
//   data.current(function (data) {
//     assert.equal(
//       data.length,
//       0,
//       'Multiple selects have no default selection.'
//     );
//   });
// });

// current
test('returns option if they have :selected', function(assert){
    var $select = $('#qunit-fixture .multiple');
    $select.find('option:first, option:last').prop('selected', true);
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 2);
        assert.ok($select.find('option:first').is(current[0].element));
        assert.ok($select.find('option:last').is(current[1].element));
    });
});

test('returns optgroup if they have .selected-custom', function(assert){
    var $select = $('#qunit-fixture .multiple');
    selectOptgroup($select.find('optgroup'));
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 2);
        assert.ok($select.find('optgroup:first').is(current[0].element));
        assert.ok($select.find('optgroup:last').is(current[1].element));
    });
});

test('returns mixed group of option and optgroup', function(assert){
    var $select = $('#qunit-fixture .multiple');
    selectOptgroup($select.find('optgroup:first'));
    $select.find('option:last').prop('selected', true);
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 2);
        assert.ok($select.find('optgroup:first').is(current[0].element));
        assert.ok($select.find('option:last').is(current[1].element));
    });
});

test('does not return option if it returns the optgroup', function(assert){
    var $select = $('#qunit-fixture .multiple');
    selectOptgroup($select.find('optgroup:first'));
    $select.find('optgroup:first option').prop('selected', true);
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 1);
        assert.ok($select.find('optgroup:first').is(current[0].element));
    });
});
//
// // select
// test('selects the option', function(){});
// test('if all sibling elements in optgroup are selected, selects the optgroup', function(){});
//
// // unselect
// test('unselects the option', function(){});
// test('unselects the parent optgroup', function(){});
//
// // optgroup select
// test('selects the optgroup', function(){});
// test('selects all of the child selects', function(){});
//
// // optgroup unselect
// test('unselects the optgroup', function(){});
// test('unselects all of the child elements', function(){});
