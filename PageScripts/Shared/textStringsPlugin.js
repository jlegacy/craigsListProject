(function () {

	var $TextStringsPlugin = function () {};
	$TextStringsPlugin.dataCaptureRegions = [];

	var populateFieldOptions = function (el) {
		var options = {};
		var dArray = [];
		var name;

		options.types = ($App.textStringValues);

		var selectOptionsTemplate = $App.LoadTemplate('templates/addSelectOptions_template.html');
		var inputTemplate = $App.LoadTemplate('templates/addTextStringInputOption_template.html');
		var selectTemplate = $App.LoadTemplate('templates/addTextStringSelectOption_template.html');

		var container = el.closest('li');
		switch (el.val()) {
			//static block//
		case '0':
			container.find('.String-value-container').empty();
			container.find('.String-value-container').html(inputTemplate());
			break;
			//dynamic block//
		case '1':
			container.find('.String-value-container').empty();
			name = 'dataCaptureRegionSelector';
			container.find('.String-value-container').html(selectTemplate(name));
			container.find('select[name=dataCaptureRegionSelector]').append(selectOptionsTemplate($TextStringsPlugin.dataCaptureRegions));
			break;
			//job data//
		case '2':
			container.find('.String-value-container').empty();
			name = 'jobTicketSelector';
			container.find('.String-value-container').html(selectTemplate(name));
			container.find('select[name=jobTicketSelector]').append(selectOptionsTemplate($App.textStringValues));
			break;
			//CLRF
		case '3':
			container.find('.String-value-container').empty();
			break;

		default:
		}
	};

	var populateTextStrings = function (elements) {

		$.each(elements, function (key, value) {
			$('#addString').trigger('click');
			//get line just added
			container = $('#builder-basic_String_' + (key + 1));
			//set values using existing 'click' logic
			container.find('#stringTypes').val(value.type);
			container.find('#stringTypes').trigger('change');

			container.find('#jobTicketSelector').val(value.jobTicketSelector);
			container.find('#dataCaptureRegionSelector').val(value.dataCaptureRegionSelector);
			container.find('#text').val(value.text);
		});
	};

	$TextStringsPlugin.initPrintTraceStrings = function (elements, type, readOnly) {

		var template,template2;
		var counter = 0;
		var options = {};
		var data = {},userDictionary = [],container;

		template = $App.LoadTemplate('templates/addString_template.html');
		template2 = $App.LoadTemplate('templates/addSelectOptions_template.html');

		if (type === "PrintTrace") {
			options.types = ($App.PrintTraceRegionsTextStringTypes);
		} else {
			options.types = ($App.OtherTraceRegionsTextStringTypes);
		}

		$('#addString').on('click', function () {
			counter = counter + 1;
			options.counter = counter;
			var data = {},userDictionary = [],container;
			
			$('#Strings').append(template(options));

			$("[id^='stringTypes']").off();
			$("[id^='stringTypes']").on('change', function () {
				populateFieldOptions($(this));
			});

			$("[name^='DeleteString']").off();
			$("[name^='DeleteString']").on('click', function () {
				var z = $('#Strings').find('li');
				$('#Strings').find($(this)).closest('li').remove();
			});

			$('#errorContainer').hide();
			
			//Set Added Drop Down to CLRF
			container = $( "[id^='builder-basic_String_']" ).last();
			container.find('#stringTypes').val(3);
			container.find('#stringTypes').trigger('change');
		
		});

		$.when($DataCaptureRegionsModels.GetDataCaptureRegionsSelectListDeferred()).done(function (data) {

			$TextStringsPlugin.dataCaptureRegions = [];
			$.each(data.dataCaptureRegions, function (i, val) {
				var options = {};
				options.value = val.id;
				options.text = val.name;
				$TextStringsPlugin.dataCaptureRegions.push(options);
			});

			if (elements.length > 0) {
				populateTextStrings(elements);
			};

			if (readOnly) {
				$('#Strings').find("select").attr("disabled", "disabled");
				$('#Strings').find("button").attr("disabled", "disabled");
				$('#addString').attr("disabled", "disabled");
				$('#Strings').find('input').each(function () {
					$(this).prop('disabled', true);
				});

			} else {
				//Delete the dynamic option//
				dragula([document.querySelector('#Strings')], {
					moves : function (el, container, handle) {
						return handle.className === 'dragDropGraphic';
					}
				});
			}

		});

	};

	$TextStringsPlugin.convertTextStringsToJSONData = function (id) {
		var pData = {};
		var data = {};

		//set up region variable
		//pData.regionId = region;

		//Set up elements
		pData.textElements = [];

		var resultSetId = 0;

		value = $("[id^='builder-basic_String_']");
		$.each(value, function () {
			data = {};
			data.type = $(this).find('#stringTypes').val();
			data.jobTicketSelector = $(this).find('#jobTicketSelector').val();
			data.dataCaptureRegionSelector = $(this).find('#dataCaptureRegionSelector').val();
			data.text = $(this).find('#text').val();
			if (id) {
				data.regionId = id;
			}
			pData.textElements.push(data);
		});
		return pData;
	};

	window.$TextStringsPlugin = $TextStringsPlugin;
	return (this);
}
	());
