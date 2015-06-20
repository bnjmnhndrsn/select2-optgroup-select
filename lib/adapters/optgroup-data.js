$.fn.select2.amd.define('optgroupData', [
    'select2/data/select',
    'select2/utils'
], function (SelectAdapter, Utils) {
    
    function OptgroupData ($element, options) {
        OptgroupData.__super__.constructor.apply(this, arguments);
    }
    
    Utils.Extend(OptgroupData, SelectAdapter);
    
    SelectAdapter.prototype.current = function (callback) {
      var data = [];
      var self = this;

      this.$element.find(':selected, .selected-custom').each(function () {
        var $option = $(this);

        var option = self.item($option);

        data.push(option);
      });

      callback(data);
    };
    
    return OptgroupData;
});