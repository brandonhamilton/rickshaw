Rickshaw.namespace('Rickshaw.Graph.Behavior.Series.Toggle');

Rickshaw.Graph.Behavior.Series.Toggle = Rickshaw.Class.create({

    initialize: function (args) {

        this.graph = args.graph;
        this.legend = args.legend;

        this._interceptSortable();
        this._addAnchors();
        this._addBehavior();

        this._lines = {};

        this.updateBehaviour = this._addBehavior;

        this.graph.onSeriesChange(function () {
            this._addAnchors();
            this._addBehavior();

        }.bind(this));
    },

    _addAnchors: function () {

        if (!this.selectAll) {
            var header = document.createElement('div');
            header.className = 'legend_header';
            this.selectAll = document.createElement('div');
            this.selectAll.className = 'legend_button';
            this.selectAll.innerHTML = 'Select All';
            header.appendChild(this.selectAll);
            this.legend.element.insertBefore(header, this.legend.element.firstChild);

            this.selectAll.addEventListener('click', function () {
                this.legend.lines.forEach(function (l) {
                    l.series.enable();
                    l.element.classList.remove('disabled');
                    l.element.firstChild.innerHTML = '&#10004;';
                });
            }.bind(this));
        }

        this.legend.lines.forEach(function (l) {
            this.addAnchor(l);
        }.bind(this));
    },

    addAnchor: function (line) {

        if (line._hasToggleEvents) return;
        line._hasToggleEvents = true;

        var anchor = document.createElement('a');
        anchor.innerHTML = '&#10004;';
        anchor.classList.add('action');

        line.element.insertBefore(anchor, line.element.firstChild);

        anchor.addEventListener('click', function () {

            if (line.series.disabled) {
                line.series.enable();
                line.element.classList.remove('disabled');
                anchor.innerHTML = '&#10004;';
            } else {
                var onlyLine = true;
                this.legend.lines.forEach(function (l) {
                    if (line.series === l.series) return;
                    if (l.series.disabled) return;
                    onlyLine = false;
                });
                if (!onlyLine) {
                    line.series.disable();
                    line.element.classList.add('disabled');
                    anchor.innerHTML = '&#10006;';
                }
            }

        }.bind(this));

        var label = line.element.getElementsByTagName('span')[0];

        label.addEventListener('click', function () {

            var disableAllOtherLines = line.series.disabled;

            if (!disableAllOtherLines) {

                this.legend.lines.forEach(function (l) {

                    if (line.series === l.series) return;
                    if (l.series.disabled) return;

                    disableAllOtherLines = true;
                });
            }

            if (disableAllOtherLines) {

                line.series.enable();
                line.element.classList.remove('disabled');
                line.element.firstChild.innerHTML = '&#10004;';

                this.legend.lines.forEach(function (l) {

                    if (line.series === l.series) return;

                    l.series.disable();
                    l.element.classList.add('disabled');
                    l.element.firstChild.innerHTML = '&#10006;';
                });

            } else {

                this.legend.lines.forEach(function (l) {
                    l.series.enable();
                    l.element.classList.remove('disabled');
                    l.element.firstChild.innerHTML = '&#10004;';
                });
            }

        }.bind(this));
    },

    _interceptSortable: function () {

        if (this.legend) {

            if (typeof $ != 'undefined' && $(this.legend.list).sortable) {

                $(this.legend.list).sortable({
                    start: function (event, ui) {
                        ui.item.bind('no.onclick',

                        function (event) {
                            event.preventDefault();
                        });
                    },
                    stop: function (event, ui) {
                        setTimeout(function () {
                            ui.item.unbind('no.onclick');
                        }, 250);
                    }
                });
            }

        }
    },

    _addBehavior: function () {
        var g = this.graph;
        this.graph.series.forEach(function (s) {

            s.disable = function () {

                if (g.series.length <= 1) {
                    throw ('only one series left');
                }

                s.disabled = true;
                g.update();

            }.bind(this);

            s.enable = function () {
                s.disabled = false;
                g.update();

            }.bind(this);
        });
    }
});