$(function(){
    // Variables Declaration
    const rangeInput = $('.main-controls__range input'), 
          rangeValue = $('.range-value'), 
          screenBtn = $('.screen-btn').first(), 
          cloneScreen = $('.screen').clone(), 
          screenDelBtn = $('.screen-btn').last(), 
          cmsCheck = $('.custom-checkbox').last(), 
          cmsSelect = $('.hidden-cms-variants'),
          calcBtn = $('#start'),
          resetBtn = $('#reset'),
          totalInput = $('input#total'),
          totalCountInput = $('input#total-count'),
          totalCountOtherInput = $('input#total-count-other'),
          totalFullCountInput = $('input#total-full-count'),
          totalCountRollbackInput = $('input#total-count-rollback');

    let screensInputs = $('.screen .main-controls__input input'), 
        screens, 
        remScreen,
        inputs,
        selects,
        screen,
        count,
        screensTypes,
        screensCount,
        arrKeys = [],
        input,
        addServices,
        checkbox,
        addServiceValue;



    // Object With Data For Further Sending
    let dataObj = {
        screens: {},
        layoutPrice: 0,
        screensCount: 0,

        addServicesPrice: 0,

        totalPrice: 0,

        withRollbackPrice: 0
    };



    // Screens Inputs Change
    function dataInputs() {
        screensInputs = $('.screen .main-controls__input input');

        $(screensInputs).each(function(index) {
            $(screensInputs[index]).change(function() {
                if (!$.isNumeric(this.value)) {
                    this.value = '';
                    this.placeholder = 'Введите целое значение больше нуля';
                }
                if (!Number.isInteger(Number(this.value))) {
                    this.value = '';
                    this.placeholder = 'Введите целое значение больше нуля';
                }
                if (parseInt(this.value) === 0 || parseInt(this.value) < 0) {
                    this.value = '';
                    this.placeholder = 'Введите целое значение больше нуля';
                }

                return;
            });
        })
    };

    dataInputs();

    // Range Input Change
    $(rangeInput).on('input', function() {
        rangeValue.text(`${this.value}%`);

        return;
    });



    // Add/Delete Screen Selection Box
    $(screenBtn).click(function() {
        cloneScreen.clone().insertAfter($('.screen').last());
        dataInputs();
        $('.screen')[0].last().remove();

        return;
    });

    $(screenDelBtn).click(function() {
        screens = $('.screen');

        if ($(screens)[2] !== undefined) {
            remScreen = $(screens);
            $(remScreen).last().remove();

            dataInputs();

            return;
        }
        if ($(screens)[1] !== undefined) {
            remScreen = $(screens);
            $(remScreen).last().remove();
            dataInputs();

            return;
        }
    });

    // CMS Check
    $(cmsCheck).click(function() {
        if ($(cmsCheck).prop('checked')) {
            $(cmsSelect).prop('style', 'display: ;');
        } else {
            $(cmsSelect).prop('style', 'display: none;');
        }

        return;
    });



    // Reset Pagedata
    function resetData() {
        inputs = $('input'), selects = $('select');
        $(inputs).each(function(index) {
            input = $(inputs[index]);
            if ($(input).parent().prop('class') !== 'main-controls__input' && $(input).prop('class') !== 'total-input' || $(input).parent().parent().prop('class') === 'main-controls__item screen') {
                $(input).prop("disabled", false);
            }
            if ($(input).is(':checked')) {
                $(input).prop('checked', false);
            }
            if ($(input).parent().parent().prop('class') !== 'main-controls__item other-items percent' && $(input).parent().parent().prop('class') !== 'main-controls__item other-items number' && $(input).prop('class') !== 'custom-checkbox') {
                $(input).val('0');
            }
            if ($(input).parent().parent().prop('class') === 'main-controls__item screen') {
                $(input).val('');
            }
        })
        $(selects).each(function(index) {
            $(selects[index]).prop("disabled", false);
            $(selects)[index].selectedIndex = 0;
        })

        $(rangeInput).val(0);
        $(rangeValue).text('0%');

        $('.screen-btn').show();

        $('.main-controls.elements').css('background-color', '');
        
        dataObj = {
            screens: {},
            layoutPrice: 0,
            screensCount: 0,
    
            addServicesPrice: 0,
    
            totalPrice: 0,
    
            withRollbackPrice: 0
        };

        arrKeys = [];

        return dataObj, arrKeys;
    };

    // Counting Disable
    function disabling() {
        inputs = $('input'), selects = $('select');

        $(inputs).each(function(index) {
            $(inputs[index]).prop("disabled", true);
        })
        $(selects).each(function(index) {
            $(selects[index]).prop("disabled", true);
        })

        $('.screen-btn').hide();

        $('.main-controls.elements').css('background-color', 'rgba(0, 0, 0, 0.15)');

        return;
    }

    

    // Get Data From Screen Selection Boxes
    function getScreenTypes() {
        screensTypes = $('.main-controls__select > select[name="views-select"]:not("#cms-select")');
        screensCount = $('.screen > .main-controls__input input');

        $(screensTypes).each(function(index) {
            screen = Number($(screensTypes)[index][$(screensTypes)[index].selectedIndex].value);
            if (screen !== 0) {
                arrKeys.push(screen);
                dataObj.screens[screen] = 0;
            }
        })
        $(screensCount).each(function(index) {
            count = Number($(screensCount)[index].value);
            if (count !== 0) {
                dataObj.screens[arrKeys[index]] = count;
            } else {
                delete dataObj.screens[arrKeys[index]];
            }
        })

        return dataObj, arrKeys;
    };

    // Count Screens Number
    function screensNumber() {
        $(dataObj.screens).each(function(key, value) {
            for(key in value) {
                dataObj.layoutPrice += key * value[key];
                dataObj.screensCount += value[key];
            }
        })

        return dataObj;
    };
    
    // Get & Count Data From Addition Services Checkboxes
    function addServicesCount() {
        addServices = $('.custom-checkbox');

        $(addServices).each(function(index) {
            checkbox = $(addServices)[index];
            if ($(checkbox).is(':checked')) {
                addServiceValue = Number($(checkbox).parent().parent().children('.main-controls__input').children('input').val());

                if (index === 0 || index === 1) {
                    dataObj.addServicesPrice += Math.round(dataObj.layoutPrice * (addServiceValue / 100));
                } else {
                    dataObj.addServicesPrice += addServiceValue;
                }
            }
        })

        return dataObj;
    };

    // Count Total Price
    function totalCount() {
        dataObj.totalPrice = dataObj.layoutPrice + dataObj.addServicesPrice;
    };

    // Count Rollback Price
    function rollbackCount() {
        if (Number($(rangeInput).val()) !== 0) {
            dataObj.withRollbackPrice = dataObj.totalPrice - Math.round(dataObj.totalPrice * (Number($(rangeInput).val()) / 100));
        }

        return dataObj;
    };



    // Calculation Button
    $(calcBtn).click(function() {
        disabling();
        getScreenTypes();
        screensNumber();
        addServicesCount();
        totalCount()
        rollbackCount();
        dataOutput();

        $(calcBtn).prop('style', 'display: none;');
        $('#reset').prop('style', 'display: ;');
    });

    // Reset Button
    $(resetBtn).click(function() {
        resetData();
        dataOutput();

        $(resetBtn).prop('style', 'display: none;');
        $('#start').prop('style', 'display: ;');
    });

    // Data Output
    function dataOutput() {
        $(totalInput).prop('value', `${dataObj.layoutPrice}`);
        $(totalCountInput).prop('value', `${dataObj.screensCount}`);
        $(totalCountOtherInput).prop('value', `${dataObj.addServicesPrice}`);
        $(totalFullCountInput).prop('value', `${dataObj.totalPrice}`);
        $(totalCountRollbackInput).prop('value', `${dataObj.withRollbackPrice}`);

        return;
    };
})