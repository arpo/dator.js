/**
 * @version 0.1
*/

var NIBS = window.NIBS || {};
NIBS.main = (function () {

	var _dator,
		_report;

	function _validate(e) {
		
		_report = _dator.validate.call(_dator);
		console.log(_report);

		if (_report.length > 0) {
			$('.dator-error-message').slideDown(150);
		} else {
			$('.dator-error-message').slideUp(150);
		}

	}

	function _init () {

		$(document.body).on('click', 'button.ok', _validate);

		_dator = new NIBS.Validator($('.form'), {
			mandatoryClass: 'dator-mandatory-marker', //<-- this is the default class
			errorClass: 'dator-error-marker', //<-- so they can be omited
		});

	}

	return {
		init: _init
	};
}());