function getId(item, i, j) {
    return item + '' + i + (j ? '' + j : '');
}

function matrixAx(i, j, last) {
    var element = jQuery('<span id="' + getId('element', i, j) + '"></span>');
    
    jQuery(element).append('<input type="number" id="' + getId('a', i, j) + '" name="' + getId('a', i, j) + '">');
    jQuery(element).append('<label for="' + getId('a', i, j) + '" class="variable">x' + i + '' + j + '</label>');
    
    if (last) {
        jQuery(element).append('<span class="operator">=</span>');
    }
    else {
        jQuery(element).append('<span class="operator">+</span>');
    }
    
    return element;
}

function matrixB(i) {
    var element = jQuery('<span id="' + getId('element', i) + '"></span>');
    jQuery(element).append('<input type="number" id="' + getId('b', i) + '" name="' + getId('b', i) + '">');
    return element;
}

function addMatrixRows(startRow, endRow, totalColumns) {
    for (var i = startRow; i <= endRow; i++) {
        var row_element = jQuery('<div class="matrix-row"></div>');
        
        var j = 1;
        while (j < totalColumns) {
            row_element.append(matrixAx(i, j, false));
            j++;
        }
        
        row_element.append(matrixAx(i, j, true));
        row_element.append(matrixB(i));

        jQuery('#matrix-values').append(row_element);
    }
}

function removeMatrixRows(startRow, endRow) {
    for (var i = 0; i < (endRow - startRow); i++)
        jQuery('#matrix-values .matrix-row').get(startRow).remove();
}

function addMatrixColumns(startColumn, endColumn, totalRows) {
    if (startColumn > endColumn)
        return;
        
    for (var i = 1; i <= totalRows; i++) {

        jQuery(jQuery('#matrix-values .matrix-row').get(i - 1)).find('.operator').last().text('+');
        
        var j = startColumn;
        while (j < endColumn) {
            matrixAx(i, j, false).insertBefore('#' + getId('element', i));
            j++;
        }
        matrixAx(i, j, true).insertBefore('#' + getId('element', i));
    }
}

function removeMatrixColumns(startColumn, endColumn, totalRows) {
    for (var i = 1; i <= totalRows; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
            jQuery('#' + getId('element', i, j)).remove();
        }
        jQuery(jQuery('#matrix-values .matrix-row').get(i - 1)).find('.operator').last().text('=');
    }
}

function loadMatrix() {
    var rows = parseInt(jQuery('#matrix-settings input[name=rows]').val());
    var columns = parseInt(jQuery('#matrix-settings input[name=columns]').val());
    
    if (jQuery('#matrix-values .matrix-row').size() !== 0) {
        /* remove linhas */
        var curr_rows = parseInt(jQuery('#matrix-values .matrix-row').last().find('.variable').first().text().split('')[1]);
        removeMatrixRows(rows, curr_rows);
            
        /* remove elementos das linhas */
        var curr_columns = parseInt(jQuery('#matrix-values .matrix-row').first().find('.variable').last().text().split('')[2]);
        removeMatrixColumns(columns + 1, curr_columns, rows)
        
        /* adiciona colunas */
        addMatrixColumns(curr_columns + 1, columns, rows);
        
        /* adiciona linhas */
        addMatrixRows(curr_rows + 1, rows, columns);
    }
    else {
        addMatrixRows(1, rows, columns);
    }
}
