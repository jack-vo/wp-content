(function () {
    // bootstrap EVDB
    if (!window.EVDB) {
        var proto;void 0===window.EVDB&&(window.EVDB={}),void 0===EVDB.API&&(EVDB.API={}),EVDB.API.idRequest=1,EVDB.API.requests=[],EVDB.API.elHead=null,void 0!==window&&void 0!==window.location&&void 0!==window.location.protocol&&(proto=window.location.protocol),void 0!==proto&&""!==proto&&" "!==proto&&"file:"!==proto||(proto="http:"),EVDB.API.URL=proto+"//api.eventful.com/json",EVDB.API.version=.41,EVDB.API.call=function(e,r,o){try{if("object"==typeof r)EVDB.API.app_key&&(r.app_key=EVDB.API.app_key),EVDB.API.user&&(r.user=EVDB.API.user),EVDB.API.user_key&&(r.user_key=EVDB.API.user_key),r=EVDB.API._serialize(r);else{var t={};EVDB.API.app_key&&(t.app_key=EVDB.API.app_key),EVDB.API.user&&(t.user=EVDB.API.user),EVDB.API.user_key&&(t.user_key=EVDB.API.user_key),r+=(r.length?"&":"")+EVDB.API._serialize(t)}var n=document.createElement("script");n.type="text/javascript",n.src=EVDB.API.URL+e+"?"+r+"&json_request_id="+EVDB.API.idRequest,EVDB.API.requests[EVDB.API.idRequest++]={el:n,cb:o},EVDB.API.elHead||(EVDB.API.elHead=document.getElementsByTagName("head")[0]),EVDB.API.elHead.appendChild(n)}catch(e){return EVDB.API.error(e.toString()),!1}return!0},EVDB.API.error=function(e){var r=document.createElement("div");return r.appendChild(document.createTextNode(e)),document.body.insertBefore(r,document.body.firstChild),r.setAttribute("style","margin:1em;padding:0.5em;border:2px dashed #ff9999;font-size:12px;color:red;"),!0},EVDB.API._complete=function(e,r){var o=EVDB.API.requests[e]||null;if(o){if("function"==typeof o.cb){var t=o.cb;try{EVDB.API.elHead.removeChild(o.el)}catch(e){}return EVDB.API.requests[e]=null,t(r),!0}EVDB.API.error("Invalid callback function.")}else EVDB.API.error("Invalid request id.");return!1},EVDB.API._serialize=function(e){var r=[];for(var o in e)r.push(encodeURIComponent(o)+"="+encodeURIComponent(e[o]));return r.join("&")};
    }

    const $ = window.jQuery;
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
        const events = (data.events && data.events.event) || [];
        const $list = $('<ul class="jv-finder-list"/>');
        const getStartTime = function (time) {
            var date  = new Date(time);

            return date.toLocaleDateString("en-US", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
        };

        $.each(events, (index, event) => {
            const $item = $('<li class="jv-finder-listItem"/>');

            $item
                .append(
                    $('<div class="jv-finder-listItem__imgWrapper"/>')
                    .append(
                        $('<img class="jv-finder-listItem__img"/>')
                        .attr('alt', event.title)
                        .attr('src', event.image && event.image.medium && event.image.medium.url)
                    )
                )
                .append(
                    $('<div class="jv-finder-listItem__content"/>')
                        .append($('<div class="jv-finder-listItem__title"/>').html(event.title))
                        .append($('<div class="jv-finder-listItem__desc"/>').html(event.description))
                        .append(
                            $('<div class="jv-finder-listItem__startTime"/>')
                            .html(getStartTime(event.start_time))
                        )
                        .append(
                            $('<div class="jv-finder-listItem__venue"/>')
                                .append($('<span class="jv-finder-listItem__venue-name"/>').html(event.venue_name))
                                .append($('<span class="jv-finder-listItem__venue-address"/>').html(event.venue_address))
                        )
                )
                

            $list.append($item);
        });

        $eventsResult
            .empty()
            .removeClass('loading')
            .append($list);
    };
    let loading = false;
    const $form = $('[data-component="finder-form"]');
    const loadEvents = function () {
        if (loading) {
            return;
        }

        const searchArgs = {
            app_key: 'wbBNBH5VMp6fH4G7',
            location: $form.find('[name="location"]').val(),
            // category: getCategories($form.find('[data-component="categories"]')),
            category: 'music',
            within: $form.find('[name="within"]').val(),
            sort_order: 'popularity',
            page_size: 20
        };

        setAllInputsDisableState($form, true);

        $eventsResult
            .empty()
            .addClass('loading');

        EVDB.API.call('/events/search', searchArgs, function (data) {
            setAllInputsDisableState($form, false);
            renderEventsResult(data);
        });
    };

    // Process form
    $form.submit(function (event) {
        event.preventDefault();
        loadEvents();
    });

    // Check if the GET variable is ready
    var $_GET = {};
    if(document.location.toString().indexOf('?') !== -1) {
        var query = document.location
                    .toString()
                    // get the query string
                    .replace(/^.*?\?/, '')
                    // and remove any existing hash string (thanks, @vrijdenker)
                    .replace(/#.*$/, '')
                    .split('&');

        for(var i = 0, l = query.length; i < l; i++) {
            var aux = decodeURIComponent(query[i]).split('=');
            $_GET[aux[0]] = aux[1];
        }
    }

    if ($_GET.get_request) {
        loadEvents();
    }
})();