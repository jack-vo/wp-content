// This script is loaded both on the frontend page and in the Visual Builder.

jQuery(function($) {
    if (typeof EVDB !== 'undefined') {
        return;
    }

    // load eventful api
    (() => {
        const script = document.createElement('script');

        script.src = '//api.eventful.com/js/api';
        script.onerror = function () {
            window.console.error('Failed loading Eventful API, can\'t load: ' + script.src);
        };

        document.getElementsByTagName('head')[0].appendChild(script);
    })();

    // Interaction
    $('[data-component="toggle-categories"]').click(function () {
        $(this).next('[data-component="categories"]').toggle();
    });

    const getCategories = $categories => {
        const result = [];

        $categories
            .find('input:checked')
            .each(function () {
                result.push($(this).val());
            });

        return result.join(',');
    };
    const setAllInputsDisableState = function ($form, disabled) {
        $form
            .find('input,button')
            .prop('disabled', !!disabled);
    };
    const $eventsResult = $('[data-component="events-result"]');
    const renderEventsResult = function (data) {
        debugger;

        $eventsResult
            .empty()
            .removeClass('loading');

        const events = (data.events && data.events.event) || [];
        const $list = $('<ul class="jv-finder-list"/>');

        $.each(events, (index, event) => {
            $item
                .append($('<div class="jv-finder-listItem__title"/>').text(event.title))
                .append($('<div class="jv-finder-listItem__desc"/>').text(event.description))
                .append($('<div class="jv-finder-listItem__startTime"/>').text(event.start_time))
                .append(
                    $('<div class="jv-finder-listItem__venue"/>')
                        .append($('<span/>').text(event.venue_name))
                        .append($('<span/>').text(event.venue_address))
                )

            $list.append($item);
        });
    };
    let loading = false;

    // Process form
    $('[data-component="finder-form"]')
        .submit(function (event) {
            if (typeof EVDB === 'undefined') {
                alert('Our Eventful API is failed to load. Please contact our admin at jack@yourgoodtimes.com. Sorry for all the inconvenient!');
            }

            if (loading) {
                return;
            }

            event.preventDefault();

            const $form = $(this);
            const searchArgs = {
                app_key: 'wbBNBH5VMp6fH4G7',
                location: $form.find('[name="location"]').val(),
                category: getCategories($form.find('[data-component="categories"]')),
                within: $form.find('[name="within"]').val(),
                sort_order: $form.find('[name="sort_order"]').val(),
                page_size: 5
            };

            setAllInputsDisableState($form, true);

            $eventsResult
                .empty()
                .addClass('loading');

            console.log(searchArgs);

            EVDB.API.call('/events/search', searchArgs, function (data) {
                setAllInputsDisableState($form, false);
                renderEventsResult(data);
            });
        });
});
