var Util = Util || {};
var LinearEquations = LinearEquations || {};

LinearEquations.ready = function() {
    jQuery('#lineq-settings #buttonOk').hide();
    jQuery('#lineq-settings #buttonReset').hide();
    jQuery('#lineq-settings #buttonClear').hide();
    jQuery('#lineq-settings .warning').show();
    
    jQuery('#lineq-settings #rows, #lineq-settings #columns').change(function(){
        if (LinearEquations.getRows() && LinearEquations.getColumns()) {
            jQuery('#lineq-settings #buttonOk').show();
        }
    });
    
    jQuery('#lineq-settings #buttonOk').click(function(){
        LinearEquations.load();
        
        if (LinearEquations.getRows() && LinearEquations.getColumns()) {
            jQuery('#lineq-settings #buttonOk').hide();
            jQuery('#lineq-settings #buttonReset').show();
            jQuery('#lineq-settings #buttonClear').show();
            jQuery('#lineq-settings .warning').hide();
        }
    });
    
    jQuery('#lineq-settings #buttonReset').click(function(){
        jQuery('#lineq-settings #buttonOk').hide();
        jQuery('#lineq-settings #buttonReset').hide();
        jQuery('#lineq-settings #buttonClear').hide();
        jQuery('#lineq-settings .warning').show();
        LinearEquations.reset();
    });
    
    jQuery('#lineq-settings #buttonClear').click(function(){
        LinearEquations.clear();
    });
};

LinearEquations.generateId = function(item, i, j) {
    return item + '' + i + (j ? '' + j : '');
};

LinearEquations.getRows = function(item, i, j) {
    return parseInt(jQuery('#lineq-settings input[name=rows]').val());
};

LinearEquations.getColumns = function(item, i, j) {
    return parseInt(jQuery('#lineq-settings input[name=columns]').val());
};

LinearEquations.load = function() {

    var getId = function(item, i, j) {
        return LinearEquations.generateId(item, i, j);
    };
    
    var createAxElements = function(i, j, last) {
        var element = jQuery('<div id="' + getId('element', i, j) + '" class="row-element"></div>');
        
        jQuery(element).append('<input type="number" id="' + getId('a', i, j) + '" name="' + getId('a', i, j) + '">');
        jQuery(element).append('<label for="' + getId('a', i, j) + '" class="variable">x<span class="subscript">' + i + '' + j + '</span></label>');
        
        if (last) {
            jQuery(element).append('<span class="operator">=</span>');
        }
        else {
            jQuery(element).append('<span class="operator">+</span>');
        }
        
        return element;
    };

    var createBElements = function(i) {
        var element = jQuery('<div id="' + getId('element', i) + '" class="row-element"></div>');
        jQuery(element).append('<input type="number" id="' + getId('b', i) + '" name="' + getId('b', i) + '">');
        return element;
    };

    var addRowElements = function(startRow, endRow, totalColumns) {
        for (var i = startRow; i <= endRow; i++) {
            var row_element = jQuery('<div class="row"></div>');
            
            var j = 1;
            while (j < totalColumns) {
                row_element.append(createAxElements(i, j, false));
                j++;
            }
            
            row_element.append(createAxElements(i, j, true));
            row_element.append(createBElements(i));

            jQuery('#lineq-values').append(row_element);
        }
    };

    var removeRowElements = function(startRow, endRow) {
        for (var i = 0; i < (endRow - startRow); i++)
            jQuery('#lineq-values .row').get(startRow).remove();
    };

    var addColumnElements = function(startColumn, endColumn, totalRows) {
        if (startColumn > endColumn)
            return;
            
        for (var i = 1; i <= totalRows; i++) {

            jQuery(jQuery('#lineq-values .row').get(i - 1)).find('.operator').last().text('+');
            
            var j = startColumn;
            while (j < endColumn) {
                createAxElements(i, j, false).insertBefore('#' + getId('element', i));
                j++;
            }
            createAxElements(i, j, true).insertBefore('#' + getId('element', i));
        }
    };

    var removeColumnElements = function(startColumn, endColumn, totalRows) {
        for (var i = 1; i <= totalRows; i++) {
            for (var j = startColumn; j <= endColumn; j++) {
                jQuery('#' + getId('element', i, j)).remove();
            }
            jQuery(jQuery('#lineq-values .row').get(i - 1)).find('.operator').last().text('=');
        }
    };

    var rows = LinearEquations.getRows();
    var columns = LinearEquations.getColumns();
    
    if (jQuery('#lineq-values .row').size() !== 0) {
        var curr_rows = parseInt(jQuery('#lineq-values .row').last().find('.variable').first().text().split('')[1]);
        var curr_columns = parseInt(jQuery('#lineq-values .row').first().find('.variable').last().text().split('')[2]);
        
        removeRowElements(rows, curr_rows);
        removeColumnElements(columns + 1, curr_columns, rows);
        addColumnElements(curr_columns + 1, columns, rows);
        addRowElements(curr_rows + 1, rows, columns);
    }
    else {
        addRowElements(1, rows, columns);
    }
};

LinearEquations.clear = function() {
    var rows = LinearEquations.getRows();
    var columns = LinearEquations.getColumns();
    
    for (var i = 1; i <= rows; i++) {
        for (var j = 1; j <= columns; j++) {
            jQuery('#' + LinearEquations.generateId('a', i, j)).val('');
        }
        jQuery('#' + LinearEquations.generateId('b', i)).val('');
    }
};

LinearEquations.reset = function() {
    jQuery('#lineq-settings .warning').show();
    jQuery('#lineq-settings input[name=rows]').val('');
    jQuery('#lineq-settings input[name=columns]').val('');
    jQuery('#lineq-values .row').remove();
};

LinearEquations.getA = function(i, j) {
    if (1 <= i && i <= LinearEquations.getRows() && 1 <= j && j <= LinearEquations.getColumns())
        return parseInt(jQuery('#lineq-values #' + LinearEquations.generateId('a', i, j)).val());
    return NaN;
};

LinearEquations.getB = function(i) {
    if (1 <= i && i <= LinearEquations.getRows())
        return parseInt(jQuery('#lineq-values #' + LinearEquations.generateId('b', i)).val());
    return NaN;
};

LinearEquations.getAB = function(i, j) {
    if (1 <= i && i <= LinearEquations.getRows() && 1 <= j && j <= LinearEquations.getColumns() + 1)
        if (j == LinearEquations.getColumns() + 1)
            return LinearEquations.getB(i);
        else
            return LinearEquations.getA(i, j);
    return NaN;
};

LinearEquations.getAugmentedMatrix = function() {
    var matrix = new Util.Matrix(LinearEquations.getRows(), LinearEquations.getColumns() + 1);
    
    for (var i = 1; i <= LinearEquations.getRows(); i++) {
        for (var j = 1; j <= LinearEquations.getColumns() + 1; j++){
            matrix.set(i, j, LinearEquations.getAB(i, j));
        }
    }
    
    return matrix;
};