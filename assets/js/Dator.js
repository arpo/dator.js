/*
 * Validator 1.0
 *
 * Copyright 2016, Licensed GPL & MIT
 */

var NIBS = NIBS || {};
NIBS.Validator = function ($target, data) {

    var that = this;
    that.$target = $target;
    that.data = data || {};
    that.errorClass = that.data.errorClass || 'dator-error-marker';
    that.mandatoryClass = that.data.mandatoryClass || 'dator-mandatory-marker';
    that.validates = null;
    that.result = [];
    that.id = 'Validator' + NIBS.Validator.getId();
    that.phrases = {
        cantBeEmpty: 'Can\'t be empty',
        iAgree: 'You must agree',
        email: 'The e-mail is malformed',
        wholePositive: 'Number must be a positive integer',
        wholePositiveNegative: 'Number must be an integer',
        fractionalPositive: 'Number must be a positive number',
        fractionalPositiveNegative: 'Is not a valid number'
    };
    that.markMandatory();
    NIBS.Validator.all[that.id] = that;

};

NIBS.Validator.prototype = {};

NIBS.Validator.prototype.markMandatory = function () {

    var that = this;
    that.validates = $('*[data-validate]');   
    that.validates.each(function(index) {

        var $curr = $(this),
            valStr,
            isMandatory;
        
        valStr = $curr.data('validate');
        isMandatory = (valStr.indexOf('mandatory') > - 1) ? true : false;

        if (isMandatory) {
            $curr.addClass(that.mandatoryClass);
        }
        
    });

};


NIBS.Validator.prototype.validate = function () {

	var that = this;

    //Clear previous result

    that.result = [];
    that.result.length = 0;

    that.validates = $('*[data-validate]');
    
    that.validates.each(function(index) {

        var $curr = $(this),
            value,
            valStr,
            isMandatory,
            currentResult = {},
            valArr;
        
        valStr = $curr.data('validate');
        isMandatory = (valStr.indexOf('mandatory') > - 1) ? true : false;
        valArr = valStr.split('|');

        var addCheck = function ($input) {

            if (!currentResult.$input) {
                currentResult.$input = $input;
                currentResult.problem = [];
            }

        };
        
        valArr.forEach(function (action) {

            //console.log($curr);
            var value = NIBS.Validator.getValue($curr);
            //console.log(value);
            //console.log(action);

            if (action === 'agree' && !value) {

                addCheck($curr);
                currentResult.problem.push({
                    iAgree: false,
                    phrase: that.phrases.iAgree
                });

            } else if (action === 'mandatory' && !value) {

                addCheck($curr);
                currentResult.problem.push({
                    filledIn: false,
                    phrase: that.phrases.cantBeEmpty
                });

            }

            NIBS.each(NIBS.Validator.check, function (check, key) {
                
                if (action === key && NIBS.Validator.check[key] && !NIBS.Validator.check[key](value) && (value !== '' || isMandatory)) {

                    addCheck($curr);
                    var problem = {};

                    problem[key] = false;
                    problem.phrase = that.phrases[key];
                    currentResult.problem.push(problem);

                }

            });

        });

        if (currentResult.problem && currentResult.problem.length > 0) {
            that.result.push(currentResult);
        }

    });

    that.$target.find('.' + that.errorClass).removeClass(that.errorClass);

    that.result.forEach(function (res) {

        res.$input.addClass(that.errorClass);
        res.$input.parent().find('label .fa').addClass(that.errorClass);

    });

    return that.result;
    
};

NIBS.Validator.prototype.destroy = function () {

	var that = this;
    delete NIBS.Validator.all[that.id];

};

NIBS.Validator.all = {};

NIBS.Validator.getValue = function  ($target) {

    var rv;

    // console.log($target.attr('id'));
    // console.log($target.prop("tagName"));
    // console.log($target.attr('type'));
    // console.log($target.val());
    // console.log('- - - - - -');

    if ($target.attr('type') !== 'checkbox') {
        rv = $target.val();
    } else {
        rv = $target.prop('checked');
    }

    return rv;

};

NIBS.each = function (target, action) {

    var index = 0;
    for (var key in target) {
        action(target[key], key, index);
        index++;
    }

};

//http://stackoverflow.com/questions/2811031/decimal-or-numeric-values-in-regular-expression-validation

NIBS.Validator.check = {
    wholePositive: function (input) {if (/^(0|[1-9]\d*)$/.test(input)) return true; else return false;},
    wholePositiveNegative: function (input) {if (/^-?(0|[1-9]\d*)$/.test(input)) return true; else return false;},
    fractionalPositive: function (input) {if (/^(0|[1-9]\d*)(\.\d+)?$/.test(input)) return true; else return false;},
    fractionalPositiveNegative: function (input) {if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(input)) return true; else return false;},
    email: function (input) {if (/(?=^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$)(?=^.{1,100}$)/.test(input)) return true; else return false;}
};

NIBS.Validator.getId = function() {
	return (parseInt(String(parseInt(Math.random() * 100)) + (new Date().getTime()) + parseInt(Math.random() * 100))).toString(36);
};