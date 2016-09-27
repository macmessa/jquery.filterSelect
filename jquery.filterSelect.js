/*
 * jQuery filterSelect plugin
 * Version 1.0  (22/07/2015)
 * @requires jQuery v1.2.6 or above
 *
 * Examples at: ''''http://urlToExamples''''
 * Copyright (c) 2015 Marco Aurelio Messa.
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

/**
 * 
 * @example
 * 
 * 1# Step
 * Create a select element with plugin specific attributes:
 * <select name="selName" id="selId" filters="#selId" filterName="selNameRequest" targetFields="#selNameTarget" selectedValue="<%=Request.QueryString("selName")%>">
 * 
 * 2# Step
 * Initialize the plugin (basic configuration):
 * $('select').filterSelect(
 *     url: 'process.asp'
 * );
 * 
 * @desc Applies a filter method to an select element that requires data from server based on a select element value
 * 
 * @name filterSelect
 * @type jQuery
 * @cat Plugins/Ajax
 * @return Select's options HTML string
 * @author Marco Aurelio Messa (https://www.linkedin.com/in/macmessa)
*/
(function($){
	$.fn.filterSelect = function(options) {
		var defaults = {
			url: window.location.href,
			filters : 'filters',
			filterName : 'filterName',
			targetFields : 'targetFields',
			nextAction : 'nextAction',
			selectedValue : 'selectedValue',
			returnValueDelimiter : ';',
			serverParameter : 'filter'
		};
		
		var settings = $.extend({}, defaults, options);
		
		return this.each(function() {
			/*
			 * url: URL that values will come from (Same url by default)
			 * filters: Fields that have the values to require value from server
			 * filterName: Name that will be used in the server request
			 * targetFields: Fields that will receive the return data
			 * nextAction: Next change event that will be executed
			 * selectedValue: The value that will be selected in element (Usually comes from page Request)
			 * returnValueDelimiter: Determines what character will separate values for multiple target elements
			 * serverParameter: A name that will be used on server side request to identify wich element is requesting
			*/
			$(this).filter('[' + settings.filters + ']').change(function() {
				var vArrayFields = new Array();
				var vArrayData = new Array();
				var vFilters = $(this).attr(settings.filters);
				var vFilterName = $(this).attr(settings.filterName);
				var vTargetFields = $(this).attr(settings.targetFields);
				var vNextAction = $(this).attr(settings.nextAction);
				var vSelectedValue = typeof settings.selectedValue == 'undefined' ? 'value' : settings.selectedValue;
				
				var vActiveElementSelectedValue = $(this).attr(vSelectedValue)
				vActiveElementSelectedValue = typeof vActiveElementSelectedValue == 'undefined' ? $(this).find(':selected').val() : vActiveElementSelectedValue;
				
				//-----------------------------------------------------------------------------
				// Distribute fields into an array
				vArrayFields = vFilters.split(';');
				vFilters = '';
				
				// Select the previous value for the current element if exists and the current value is empty
				if (vActiveElementSelectedValue != '' && $(this).find(':selected').val() == '')
					$(this).val(vActiveElementSelectedValue);
				
				// In case the field has filters
				if (vArrayFields instanceof Array) {
					// Group all filters in a string
					for (i = 0; i < vArrayFields.length; i++) {
						// In case the element that has the filter value is not set yet, gets the value from previous selected value
						if ($(vArrayFields[i]).find(':selected').val() == '' || typeof $(vArrayFields[i]).find(':selected').val() == 'undefined')
							vFilters = vFilters + $(vArrayFields[i]).attr(settings.filterName) + '=' + vActiveElementSelectedValue + "&";
						else
							vFilters = vFilters + $(vArrayFields[i]).attr(settings.filterName) + '=' + $(vArrayFields[i]).find(':selected').val() + "&";
					}
					
					// Fill the filter string
					vFilters = vFilters + settings.serverParameter + '=' + vFilterName;
					
					// Fill the array with the target fields
					vArrayFields = vTargetFields.split(';');
					
					//-----------------------------------------------------------------------------
					// Requires data from server
					$.get(settings.url + '?' + vFilters,
						function(data) {
							// Verify if retrieved any data
							if (data != '') {
								// Split returned values into the array
								vArrayData = data.split(settings.returnValueDelimiter);
								
								// Fills each target field
								for (i = 0; i < vArrayData.length; i++) {
									$(vArrayFields[i]).html(vArrayData[i]);
								}
							}
							
							// Select the previous selected value
							for (i = 0; i < vArrayFields.length; i++) {
								$(vArrayFields[i]).val($(vArrayFields[i]).attr(vSelectedValue));
							}
							
							if (typeof vNextAction != 'undefined') {
								// Fill the array with the next action fields
								vArrayFields = vNextAction.split(';');
								
								// Execute each next action
								for (i = 0; i < vArrayFields.length; i++) {
									// Execute the next change method
									$(vArrayFields[i]).change();
								}
							}
						}
					);
				}
			});
		});
	}; 
})( jQuery );