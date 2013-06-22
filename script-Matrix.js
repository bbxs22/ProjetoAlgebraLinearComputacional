var Util = Util || {};
var Matrix = Matrix || {};

Matrix.options = { 'class' : 'matrix-content',
                   'parent' : '#content', 
                   'debugModeOn' : true, 
                   'location' : function(){return Matrix.options.parent + ' .' + Matrix.options.class;}
                 };

Matrix.ready = function() {
    jQuery('#matrix-settings #buttonOk').hide();
    jQuery('#matrix-settings #buttonReset').hide();
    jQuery('#matrix-settings #buttonClear').hide();
    jQuery('#matrix-settings .warning').show();
    
    jQuery('#matrix-settings #rows, #matrix-settings #columns').change(function(){
        if (Matrix.getRows() && Matrix.getColumns()) {
            jQuery('#matrix-settings #buttonOk').show();
        }
    });
    
    jQuery('#matrix-settings #buttonOk').click(function(){
        Matrix.load();
        
        if (Matrix.getRows() && Matrix.getColumns()) {
            jQuery('#matrix-settings #buttonOk').hide();
            jQuery('#matrix-settings #buttonReset').show();
            jQuery('#matrix-settings #buttonClear').show();
            jQuery('#matrix-settings .warning').hide();
        }
    });
    
    jQuery('#matrix-settings #buttonReset').click(function(){
        jQuery('#matrix-settings #buttonOk').hide();
        jQuery('#matrix-settings #buttonReset').hide();
        jQuery('#matrix-settings #buttonClear').hide();
        jQuery('#matrix-settings .warning').show();
        Matrix.reset();
    });
    
    jQuery('#matrix-settings #buttonClear').click(function(){
        //Matrix.show( Matrix.getMatrix() );
        Matrix.clear();
    });
};

Matrix.show = function(matrix) {
    var content = Matrix.options.location();
    
    jQuery(Matrix.options.parent).prepend('<div class="' + Matrix.options.class + ' algorithm-result"></div>');
    
    for (var i = 1; i <= matrix.rows; i++) {
        var row_element = jQuery('<div class="row"></div>');
        
        for (var j = 1; j <= matrix.columns; j++) {
            var element = jQuery('<div class="row-element"></div>');
            jQuery(element).append('<span class="value">' + matrix.get(i, j) + '</span>');
            jQuery(row_element).append(element);
        }
        
        jQuery(content).first().append(row_element);
    }
};

Matrix.generateId = function(item, i, j) {
    return item + '' + i + (j ? '' + j : '');
};

Matrix.getRows = function(item, i, j) {
    return parseInt(jQuery('#matrix-settings input[name=rows]').val());
};

Matrix.getColumns = function(item, i, j) {
    return parseInt(jQuery('#matrix-settings input[name=columns]').val());
};

Matrix.load = function() {

    var getId = function(item, i, j) {
        return Matrix.generateId(item, i, j);
    };
    
    var createElements = function(i, j) {
        var element = jQuery('<div id="' + getId('element', i, j) + '" class="row-element"></div>');
        jQuery(element).append('<input type="number" id="' + getId('a', i, j) + '" name="' + getId('a', i, j) + '">');
        return element;
    };

    var addRowElements = function(startRow, endRow, totalColumns) {
        for (var i = startRow; i <= endRow; i++) {
            var row_element = jQuery('<div class="row"></div>');
            
            for (var j = 1; j <= totalColumns; j++) {
                row_element.append(createElements(i, j));
            }
            
            jQuery('#matrix-values').append(row_element);
        }
    };

    var removeRowElements = function(startRow, endRow) {
        for (var i = 0; i < (endRow - startRow); i++)
            jQuery('#matrix-values .row').get(startRow).remove();
    };

    var addColumnElements = function(startColumn, endColumn, totalRows) {
        if (startColumn > endColumn)
            return;
            
        for (var i = 1; i <= totalRows; i++) {
            for (var j = startColumn; j <= endColumn; j++) {
                createElements(i, j).insertAfter('#' + getId('element', i, j-1));
            }
        }
    };

    var removeColumnElements = function(startColumn, endColumn, totalRows) {
        for (var i = 1; i <= totalRows; i++) {
            for (var j = startColumn; j <= endColumn; j++) {
                jQuery('#' + getId('element', i, j)).remove();
            }
        }
    };

    var rows = Matrix.getRows();
    var columns = Matrix.getColumns();
    
    if (jQuery('#matrix-values .row').size() !== 0) {
        var curr_rows = parseInt(jQuery('#matrix-values .row').last().find('.row-element').first().attr('id').split('')[7]);
        var curr_columns = parseInt(jQuery('#matrix-values .row').first().find('.row-element').last().attr('id').split('')[8]);
        
        removeRowElements(rows, curr_rows);
        removeColumnElements(columns + 1, curr_columns, rows);
        addColumnElements(curr_columns + 1, columns, rows);
        addRowElements(curr_rows + 1, rows, columns);
    }
    else {
        addRowElements(1, rows, columns);
    }
};

Matrix.clear = function() {
    var rows = Matrix.getRows();
    var columns = Matrix.getColumns();
    
    for (var i = 1; i <= rows; i++) {
        for (var j = 1; j <= columns; j++) {
            jQuery('#' + Matrix.generateId('a', i, j)).val('');
        }
    }
};

Matrix.reset = function() {
    jQuery('#matrix-settings .warning').show();
    jQuery('#matrix-settings input[name=rows]').val('');
    jQuery('#matrix-settings input[name=columns]').val('');
    jQuery('#matrix-values .row').remove();
};

Matrix.get = function(i, j) {
    if (1 <= i && i <= Matrix.getRows() && 1 <= j && j <= Matrix.getColumns())
        return parseInt(jQuery('#matrix-values #' + Matrix.generateId('a', i, j)).val());
    return NaN;
};

Matrix.getMatrix = function() {
    var matrix = new Util.Matrix(Matrix.getRows(), Matrix.getColumns());
    
    for (var i = 1; i <= Matrix.getRows(); i++) {
        for (var j = 1; j <= Matrix.getColumns(); j++){
            matrix.set(i, j, Matrix.get(i, j));
        }
    }
    
    return matrix;
};