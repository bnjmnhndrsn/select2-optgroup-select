module('Integration');

// changing the val
test('Selecting an unselected optgroup selects all the child elements', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    assert.deepEqual(["one", "two"], $select.val());
});

test('Selecting a partially selected optgroup selects all the child elements', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.val(["one"]);
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    assert.deepEqual(["one", "two"], $select.val());
});

test('Clicking on a selected optgroup unselects all of the options', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    assert.deepEqual(["one", "two"], $select.val());
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    assert.notOk($select.val());
});

// selection

test('Clicking on the optgroup causes the optgroup to display in the selection', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    var title = $select.data('select2').$container.find('.select2-selection__choice').attr('title');
    assert.equal(title, $('#qunit-fixture .multiple optgroup:first').attr('label'));
});

test('Selecting all of the child elements selects the optgroup', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    var $options = $select.data('select2').$results.find('.select2-results__option[aria-selected]');
    $options.eq(0).trigger('mouseup');
    $options.eq(1).trigger('mouseup');
    
    var title = $select.data('select2').$container.find('.select2-selection__choice').attr('title');
    assert.equal(title, $('#qunit-fixture .multiple optgroup:first').attr('label'));
});

test('Unselecting one of the child elements in a fully selected optgroup shows the remaining options', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    
    $select.select2('open');
    var $options = $select.data('select2').$results.find('.select2-results__option[aria-selected]');
    $options.eq(0).trigger('mouseup');
    
    var title = $select.data('select2').$container.find('.select2-selection__choice').attr('title');
    assert.equal(title, $options.eq(1).text());
});

test('Clicking on choice remove link removes all options in the optgroup', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    $select.data('select2').$container.find('.select2-selection__choice__remove').click();
    assert.notOk($select.val());
});

//setClasses
test('Clicking on optgroup sets it to aria-selected=true', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    var $option = $select.data('select2').$results.find('.select2-results__group:first');
    $option.trigger('mouseup');
    assert.equal($option.attr('aria-selected'), 'true');
});

test('Clicking on optgroup sets all the options to aria-selected=true', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    var $option = $select.data('select2').$results.find('.select2-results__group:first');
    $option.trigger('mouseup');
    var $options = $select.data('select2').$results.find('.select2-results__option[aria-selected]');
    assert.equal($options.eq(0).attr('aria-selected'), 'true');
    assert.equal($options.eq(1).attr('aria-selected'), 'true');
});

test('Clicking on selected optgroup sets it to aria-selected=false', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    var $option = $select.data('select2').$results.find('.select2-results__group:first');
    $option.trigger('mouseup');
    $select.select2('open');
    assert.equal($option.attr('aria-selected'), 'true');
    $option = $select.data('select2').$results.find('.select2-results__group:first');
    $option.trigger('mouseup');
    assert.equal($option.attr('aria-selected'), 'false');
});

test('Clicking on selected optgroup sets all of the options to aria-selected=false', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    var $options = $select.data('select2').$results.find('.select2-results__option[aria-selected]');
    assert.equal($options.eq(0).attr('aria-selected'), 'false');
    assert.equal($options.eq(1).attr('aria-selected'), 'false');
});

//closeOnSelect

// test('mouseup on unselected optgroup closes container if closeOnSelect=true', function(){});
// test('mouseup on unselected optgroup keeps container open if closeOnSelect=false', function(){});

