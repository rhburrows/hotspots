(function() {
  "use strict";

  // "Game" configuration
  var BOARD_WIDTH  = 25,
      BOARD_HEIGHT = 25,
      MAX_HEAT     = 15;

  function empty() {
    var cells = [];

    _.times(BOARD_HEIGHT, function() {
      var row = [];
      cells[cells.length] = row;

      _.times(BOARD_WIDTH, function() {
        row[row.length] = 0;
      });
    });

    return cells;
  }

  var Board = Backbone.Model.extend({
    defaults: {
      cells: []
    },

    getCell: function(x, y) {
      return this.get('cells')[x][y];
    },

    setCell: function(x, y, value) {
      this.get('cells')[x][y] = value;
      // We cheat a little bit here
      this.trigger('change');
    },

    reset: function() {
      this.set('cells', empty());
    }
  });

  var BoardView = Mn.ItemView.extend({
    template: "#board-template",
    el: "body",

    ui: {
      cells: ".cell",
      resetBtn: ".reset-button"
    },

    events: {
      "click @ui.cells": "handleClick",
      "click @ui.resetBtn": "resetBoard"
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
    },

    resetBoard: function() {
      this.model.reset();
    }
  })

  var app = new Mn.Application();

  app.on('start', function(options) {
    app.view = new BoardView({ model: options.model });
    app.view.render();
  });

  setTimeout(function() {
    app.start({
      model: new Board({ id: 1337 })
    });
  }, 500);
})();
