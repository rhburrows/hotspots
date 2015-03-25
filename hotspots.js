(function() {
  "use strict";

  // "Game" configuration
  var BOARD_WIDTH  = 25,
      BOARD_HEIGHT = 25,
      MAX_HEAT     = 15;

  var Board = Backbone.Model.extend({
    initialize: function() {
      var cells = [];

      _.times(BOARD_HEIGHT, function() {
        var row = [];
        cells[cells.length] = row;

        _.times(BOARD_WIDTH, function() {
          row[row.length] = 0;
        });
      });

      this.set('cells', cells);
    },

    getCell: function(x, y) {
      return this.get('cells')[x][y];
    },

    setCell: function(x, y, value) {
      this.get('cells')[x][y] = value;

      // We are cheating a little here but lets pretend we changed a real attribute
      this.trigger('change');
    }
  });

  var BoardView = Mn.ItemView.extend({
    template: "#board-template",
    el: "body",

    ui: {
      cells: ".cell"
    },

    events: {
      "click @ui.cells": "handleClick"
    },

    modelEvents: {
      "change": "render"
    },

    handleClick: function(e) {
      var $target = $(e.target);
      var row = $target.data('row');
      var col = $target.data('col');
      var count = this.model.getCell(row, col) + 1;

      if (count <= MAX_HEAT) {
        this.model.setCell(row, col, count);
      }
    }
  })

  var app = new Mn.Application();

  app.on('start', function(options) {
    app.view = new BoardView({ model: options.model });
    app.view.render();
  });

  app.start({
    model: new Board()
  });
})();
