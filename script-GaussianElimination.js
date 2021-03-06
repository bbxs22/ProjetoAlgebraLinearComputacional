var Util = Util || {};
var LinearEquations = LinearEquations || {};
var GaussianElimination = GaussianElimination || {};

GaussianElimination.options = { 'class' : 'gausselim-content',
                                'parent' : '#content', 
                                'applyPivoting' : false,
                                'debugModeOn' : true, 
                                'location' : function(){return GaussianElimination.options.parent + ' .' + GaussianElimination.options.class;}
                              };

GaussianElimination.ready = function() {    
    jQuery('#gausselim-settings #buttonRun').click(function() {
        var matrix = LinearEquations.getAugmentedMatrix();
        GaussianElimination.run(matrix);
    });
    
    LinearEquations.options.parent = GaussianElimination.options.parent;
};

GaussianElimination.run = function(matrix, pause) {
    GaussianElimination.showLinearEquations(matrix);
    GaussianElimination.findEchelonForm(matrix);
    GaussianElimination.findGaussianElimination(matrix);
    GaussianElimination.show(matrix);
};

GaussianElimination.debug = function(message) {
    if (GaussianElimination.options.debugModeOn)
        Util.debug(message)
};

GaussianElimination.showLinearEquations = function(matrix) {
    LinearEquations.show(matrix);
    jQuery(LinearEquations.options.location()).first().hide();
};

GaussianElimination.show = function(matrix) {
    var content = GaussianElimination.options.location();
    
    jQuery(GaussianElimination.options.parent).prepend('<div class="' + GaussianElimination.options.class + ' algorithm-result"></div>');
    
    for (var i = 1; i <= matrix.rows; i++) {
        var row_element = jQuery('<div class="row"></div>');
        
        for (var j = 1; j <= matrix.columns - 2; j++) {
            var element = jQuery('<div class="row-element"></div>');
            jQuery(element).append('<span class="value">' + matrix.get(i, j) + '</span>');
            jQuery(element).append('<span class="variable">x<span class="subscript">' + i + '' + j + '</span>');
            jQuery(element).append('<span class="operator">+</span>');
            jQuery(row_element).append(element);
        }
        
        var j = matrix.columns - 1;
        var element = jQuery('<div class="row-element"></div>');
        jQuery(element).append('<span class="value">' + matrix.get(i, j) + '</span>');
        jQuery(element).append('<span class="variable">x<span class="subscript">' + i + '' + j + '</span>');
        jQuery(element).append('<span class="operator">=</span>');
        jQuery(row_element).append(element);
        
        j = matrix.columns;
        element = jQuery('<div class="row-element"></div>');
        jQuery(element).append('<span class="value">' + matrix.get(i, j) + '</span>');
        jQuery(row_element).append(element);
        
        jQuery(content).first().append(row_element);
        
    }
    jQuery(content).first().prepend('<div class="icons"></div>')
    
    jQuery(content).first().find('.icons').append(
        jQuery('<a href="#" class="delete"></a>').click(function() {
            console.log(jQuery(this));
            jQuery(this).parent().parent().next().remove();
            jQuery(this).parent().parent().remove();
        })
    ).append(    
        jQuery('<a href="#" class="view"></a>').click(function() {
            jQuery(this).parent().parent().next().toggle();
        })
    );
};

GaussianElimination.pivoting = function(matrix, row) {
    GaussianElimination.debug('Starting Pivoting...');	
    GaussianElimination.debug('Given matrix:\n' + matrix.print());
    GaussianElimination.debug('Trying to find pivot at row ' + row);
    
    var pivot = {'row': row, 'column': row, 'value': matrix.get(row, row)};
        
    if (GaussianElimination.applyPivoting) {
        for (var i = row; i <= matrix.rows; i++) {
            if (Math.abs(pivot.value) < Math.abs(matrix.get(i, pivot.column))) {
                pivot.value = matrix.get(i, pivot.column);
                pivot.row = i;
            }
        }

        GaussianElimination.debug('Pivot found at (' + pivot.row + ',' + pivot.column + '). Value: ' + pivot.value);

        GaussianElimination.debug('Exchanging rows.');
        matrix.exchangeRows(row, pivot.row);
        pivot.row = row;
    }
    
    GaussianElimination.debug('Pivot is at (' + pivot.row + ',' + pivot.column + '). Value: ' + pivot.value);
    GaussianElimination.debug('Returning matrix:\n' + matrix.print());
    GaussianElimination.debug('End Pivoting.');
    
    return pivot;
};

GaussianElimination.findEchelonForm = function(matrix) {
    GaussianElimination.debug('Starting algorithm to find Echelon Form...');	
    GaussianElimination.debug('Given matrix:\n' + matrix.print());
    
    for (var i = 1; i <= matrix.rows; i++) {
        GaussianElimination.debug('Looking row ' + i + '.');
    
        var pivot = GaussianElimination.pivoting(matrix, i);

        GaussianElimination.debug('Using pivot ' + pivot.value + ' found at (' + pivot.row + ',' + pivot.column + ').');
        
        if (pivot.value === 0) {
            GaussianElimination.debug('Pivot zero found! Heading to next line.');
            continue;
        }
        
        for (var row = pivot.row+1; row <= matrix.rows; row++) {
            GaussianElimination.debug('Calculating factor...');
            var m = matrix.get(row, pivot.column) / pivot.value;
            GaussianElimination.debug('Factor for row ' + row + ' is ' + m + '.');
            for (var column = 1; column <= matrix.columns; column++) {
                matrix.set(row, column, matrix.get(row, column) - m * matrix.get(pivot.row, column));
                GaussianElimination.debug('After applying factor ' + m + ' at (' + row + ',' + column + '):\n' + matrix.print());
            }
        }
    }

    GaussianElimination.debug('Returning matrix:\n' + matrix.print());
    GaussianElimination.debug('End algorithm to find Echelon Form.');
};

GaussianElimination.findGaussianElimination = function(matrix) {
    GaussianElimination.debug('Starting algorithm to apply Gaussian Elimination...');	
    GaussianElimination.debug('Given matrix:\n' + matrix.print());
    
    for (var i = matrix.rows; i >= 1; i--) {
        GaussianElimination.debug('Looking row ' + i + '.');
        
        var pivot = {'row': i, 'column': i, 'value': matrix.get(i, i)};
        
        GaussianElimination.debug('Using pivot ' + pivot.value + ' found at (' + pivot.row + ',' + pivot.column + ').');

        if (pivot.value === 0) {
            GaussianElimination.debug('Pivot zero found! Heading to next line.');
            continue;
        }
        
        for (var row = pivot.row-1; row >= 1; row--) {
            GaussianElimination.debug('Calculating factor...');
            var m = matrix.get(row, pivot.column) / pivot.value;
            GaussianElimination.debug('Factor for row ' + row + ' is ' + m + '.');
            for (var column = matrix.columns; column >= 1 ; column--) {
                matrix.set(row, column, matrix.get(row, column) - m * matrix.get(pivot.row, column));
            }
            GaussianElimination.debug('After applying factor ' + m + ' at (' + row + ',' + column + '):\n' + matrix.print());
        }
        
        for (var column = 1; column <= matrix.columns; column++) {
            matrix.set(pivot.row, column, matrix.get(pivot.row, column) / pivot.value);
        }
        GaussianElimination.debug('After adjusting pivot row ' + pivot.row + ':\n' + matrix.print());
    }
    
    GaussianElimination.debug('Returning matrix:\n' + matrix.print());
    GaussianElimination.debug('End algorithm to apply Gaussian Elimination.');
};