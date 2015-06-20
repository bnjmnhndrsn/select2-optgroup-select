$.fn.select2.amd.define('optgroupData', [
    'select2/data/select',
    'select2/utils'
], function (SelectAdapter, Utils) {
    
    function OptgroupData ($element, options) {
        OptgroupData.__super__.constructor.apply(this, arguments);
    }
    
    Utils.Extend(OptgroupData, SelectAdapter);
    
    OptgroupData.prototype.current = function (callback) {
        var data = [];
        var self = this;

        this.$element.find(':selected, .selected-custom').each(function () {
            var $option = $(this);
            var option = self.item($option);

            data.push(option);
        });

        callback(data);
    };
    
    OptgroupData.prototype.select = function (data) {
        var self = this;

        data.selected = true;

        // If data.element is a DOM node, use it instead
        if ($(data.element).is('option')) {
            data.element.selected = true;

            this.$element.trigger('change');

            return;
        }

        this.current(function (currentData) {
            var val = [];

            data = data.children.concat(currentData);

            for (var d = 0; d < data.length; d++) {
                var id = data[d].id;

                if ($.inArray(id, val) === -1) {
                    val.push(id);
                }
            }

            self.$element.val(val);
            self.$element.trigger('change');
        });

    };

    OptgroupData.prototype.unselect = function (data) {
      var self = this;

      if (!this.$element.prop('multiple')) {
        return;
      }

      data.selected = false;

      if ($(data.element).is('option')) {
        data.element.selected = false;

        this.$element.trigger('change');

        return;
      }

      this.current(function (currentData) {
        var val = [];

        for (var d = 0; d < currentData.length; d++) {
          var id = currentData[d].id;

          if (id !== data.id && $.inArray(id, val) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);

        self.$element.trigger('change');
      });
    };
    
    return OptgroupData;
});