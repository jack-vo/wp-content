import './vendor/slick';

jQuery(() => {
    const $ = jQuery;
    const $body = $('body');

    $('#cd-slider > .et_pb_column').slick({
        dots: true,
        slidesToShow: 2,
        responsive: [
            {
                breakpoint: 720,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    $('#cd-slider').removeClass('loading');
});
