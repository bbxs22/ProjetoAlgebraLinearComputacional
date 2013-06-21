var Util = Util || {};

Util.options = { 'debugModeOn' : true };

Util.ready = function() {};

Util.debug = function(message) {
    if (Util.options.debugModeOn)
        console.log(message);
};

function Matrix(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.values = [];
    
    this.position = function(i, j) {
        return (i-1) * this.columns + (j-1)
    };
    
	this.set = function(i, j, value) {
        this.values[this.position(i, j)] = value;
    };
    
	this.get = function(i, j) {
        return this.values[this.position(i, j)];
    };
    
    this.exchangeRows = function(row1, row2) {
        for (var j = 1; j <= this.columns; j++) {
            var temp = this.get(row1, j);
            this.set(row1, j, this.get(row2, j));
            this.set(row2, j, temp);
        }
    };
    
    this.print = function() {
        var matrixStr = '';
        for (var i = 1; i <= this.rows; i++) {
            for (var j = 1; j <= this.columns; j++) {
                matrixStr += this.get(i, j) + '  ';
            }
            matrixStr += '\n';
        }
        return matrixStr.trim();
    };
};