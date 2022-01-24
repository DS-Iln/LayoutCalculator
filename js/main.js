$(function(){
    // Variables Declaration
    const rangeInput = $('.main-controls__range input'), 
          rangeValue = $('.range-value'), 
          screenBtn = $('.screen-btn').first(), 
          screenDelBtn = $('.screen-btn').last(), 
          cloneScreen = $('.screen').clone(), 
          cmsCheck = $('.custom-checkbox').last(), 
          cmsSelectBlock = $('.hidden-cms-variants'),
          calcBtn = $('#start'),
          resetBtn = $('#reset'),
          totalInput = $('input#total'),
          totalCountInput = $('input#total-count'),
          totalCountOtherInput = $('input#total-count-other'),
          totalFullCountInput = $('input#total-full-count'),
          totalCountRollbackInput = $('input#total-count-rollback'),
          hiddenCmsVariants = $('#cms-other-input').parent(),
          cmsOtherInput = $('#cms-other-input');

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
        addServiceValue,
        str;



    // Object With Data For Further Sending
    let dataObj = {
        title: '',
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
            $(screensInputs[index]).on('input', function() {
                if (!$.isNumeric(this.value)) {
                    this.value = '';
                    this.placeholder = 'Введите целое значение';
                }

                return;
            });
        })
    };

    dataInputs();

    // CMS Input 
    $(cmsOtherInput).on('input', function() {
        str = this.value;
        if ('0123456789'.split('').indexOf(str.slice(-1)) <= -1) {
            this.value = str.substring(0, str.length - 1);
        }

        return;
    });

    // Range Input Change
    $(rangeInput).on('input', function() {
        rangeValue.text(`${this.value}%`);

        return;
    });



    // Add/Delete Screen Selection Box
    $(screenBtn).click(function() {
        cloneScreen.clone().insertAfter($('.screen').last());
        dataInputs();

        screens = $('.screen');
        if ($(screens).length > 1) {
            $(screenDelBtn).show();
        } else {
            $(screenDelBtn).hide();
        }

        return;
    });

    $(screenDelBtn).click(function() {
        screens = $('.screen');

        if ($(screens)[2] !== undefined) {
            remScreen = $(screens);
            $(remScreen).last().remove();

            dataInputs();
        }
        if ($(screens)[1] !== undefined) {
            remScreen = $(screens);
            $(remScreen).last().remove();

            dataInputs();
        }

        screens = $('.screen');
        if ($(screens).length > 1) {
            $(screenDelBtn).show();
        } else {
            $(screenDelBtn).hide();
        }

        return;
    });

    // CMS Check
    $(cmsCheck).click(function() {
        if ($(cmsCheck).prop('checked')) {
            $(cmsSelectBlock).prop('style', 'display: ;');
        } else {
            $(cmsSelectBlock).prop('style', 'display: none;');
        }

        return;
    });

    // CMS Select
    $(cmsSelectBlock).change(function() {
        if ($(cmsSelectBlock).children('.main-controls__select').children('select')[0].selectedIndex === 2) {
            $(hiddenCmsVariants).prop('style', 'display: block;');
        } else {
            $(hiddenCmsVariants).prop('style', 'display: none;');
        }

        return;
    });



    // Reset Pagedata
    function resetData() {
        screens = $('.screen');

        if ($(screens).length !== 1) {
            cloneScreen.clone().insertAfter($(screens).last());
            $(screens).remove();
        }

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
            if ($(input).parent().parent().prop('class') === 'main-controls__item screen' || $(input).prop('id') === 'cms-other-input') {
                $(input).val('');
            }
        })
        $(selects).each(function(index) {
            $(selects[index]).prop("disabled", false);
            $(selects)[index].selectedIndex = 0;
        })

        $(rangeInput).val(0);
        $(rangeValue).text('0%');

        $('.screen-btn').first().show();

        $(cmsSelectBlock).prop('style', 'display: none;');
        $(hiddenCmsVariants).prop('style', 'display: none;');
        $(cmsOtherInput).prop('disabled', false);

        $('.main-controls__views.element:not(:last-child), .main-controls__views.cms').css('background-color', '');

        $(totalInput).css('color', 'rgb(84, 84, 84)');
        
        dataObj = {
            title: '',
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
        inputs = $('input:not([type="range"])'), selects = $('select');

        $(inputs).each(function(index) {
            $(inputs[index]).prop("disabled", true);
        })
        $(selects).each(function(index) {
            $(selects[index]).prop("disabled", true);
        })

        $('.screen-btn').hide();

        $('.main-controls__views.element:not(:last-child), .main-controls__views.cms').css('background-color', 'rgba(0, 0, 0, 0.10)');

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

    // Count Screens
    function screensNumber() {
        $(dataObj.screens).each(function(key, value) {
            for(key in value) {
                dataObj.screensCount += value[key];
                if (key === 'undefined') {
                    dataObj.layoutPrice = 'Screens type must be selected';

                    return dataObj;
                } else {
                    dataObj.layoutPrice += key * value[key];
                }
            }
        })

        return dataObj;
    };
    
    // Get & Count Data From Addition Services Checkboxes
    function addServicesCount() {
        if (typeof dataObj.layoutPrice === 'string') {
            dataObj.addServicesPrice = 0;
        } else {
            addServices = $('.custom-checkbox:not("#cms-open")');
    
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
        }

        return dataObj;
    };

    // Count Total Price
    function totalCount() {
        if (typeof dataObj.layoutPrice === 'string') {
            dataObj.totalPrice = 0;
        } else {
            dataObj.totalPrice = dataObj.layoutPrice + dataObj.addServicesPrice;
        }

        return dataObj;
    };

    // Count CMS 
    function cmsCount() {
        addServices = $('#cms-open');
        if (dataObj.totalPrice === 0 || !$(addServices).is(':checked') || $(cmsSelectBlock).children('.main-controls__select').children('select')[0].selectedIndex === 0) {
            return;
        } else {
            cmsSelectValue = $(cmsSelectBlock).children('.main-controls__select').children('#cms-select')[0][$(cmsSelectBlock).children('.main-controls__select').children('#cms-select')[0].selectedIndex].value;

            if (cmsSelectValue === 'other') {
                dataObj.addServicesPrice += Math.round(dataObj.totalPrice * (Number($(cmsOtherInput).val()) / 100));
            } else {
                dataObj.addServicesPrice += Math.round(dataObj.totalPrice * (Number(cmsSelectValue) / 100));
            }
        }

        return dataObj;
    };

    // Count Rollback Price
    rangeInput.on('input', rollbackCount);

    function rollbackCount() {
        if (Number($(rangeInput).val()) !== 0) {
            dataObj.withRollbackPrice = dataObj.totalPrice - Math.round(dataObj.totalPrice * (Number($(rangeInput).val()) / 100));
            dataOutput();
        } else {
            dataObj.withRollbackPrice = 0;
            dataOutput();
        }

        return dataObj;
    };



    // Calculation Button
    $(calcBtn).click(function() {
        disabling();
        getScreenTypes();
        screensNumber();
        addServicesCount();
        totalCount();
        cmsCount();
        totalCount();
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
        if (typeof dataObj.layoutPrice === 'string') {
            $(totalInput).css('color', 'crimson');
        }
        $(totalCountInput).prop('value', `${dataObj.screensCount}`);
        $(totalCountOtherInput).prop('value', `${dataObj.addServicesPrice}`);
        $(totalFullCountInput).prop('value', `${dataObj.totalPrice}`);
        $(totalCountRollbackInput).prop('value', `${dataObj.withRollbackPrice}`);

        return;
    };
})