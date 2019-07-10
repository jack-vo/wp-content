import '../scss/style.scss';
import './../../../vendor/slick';

jQuery(() => {
    const $ = jQuery;
    const $htmlBody = $('html, body');
    const $paginatedProducts = $('#cd-paginated-products');
    const renderProductsWithUrl = (url, $paginatedProducts) => {
        if ($paginatedProducts.hasClass('cd-loading')) {
            return;
        }

        $htmlBody.scrollTop($paginatedProducts.offset().top - 100);

        $paginatedProducts
            .addClass('cd-loading')
            .find('> .et_pb_code_inner')
            .load(url + ' #cd-paginated-products .woocommerce', function () {
                $paginatedProducts.removeClass('cd-loading');
            });
    };

    // Preload CSS if applicable ==========================
    $('link[rel="preload"]').attr('rel', 'stylesheet');

    // Slider==============================================
    $('#cd-slider > .et_pb_column').slick({
        dots: true,
        slidesToShow: 2,
        responsive: [
            {
                breakpoint: 770, // ipad + iphone
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    $('#cd-slider').removeClass('loading');


    // Pagination ===========================================
    if ($paginatedProducts.length) {
        $paginatedProducts.on('click', '.woocommerce-pagination a', function (e) {
            e.preventDefault();

            const $this = $(this);
            const url = $this.attr('href');

            renderProductsWithUrl(url, $paginatedProducts);
        });
    }

    // Sorting  ==============================================
    const $orderByForm = $('.woocommerce-ordering');

    if ($orderByForm.length) {
        $paginatedProducts
            .on('submit', '.woocommerce-ordering', e => {
                e.preventDefault();
            })
            .on('change', 'select.orderby', function () {
                const $this = $(this);
                const name = $this.attr('name');
                const selectedValue = $this.find('option:selected').val();
                const formValueString = `${name}=${selectedValue}`;
                const url = window.location.pathname + '?' + formValueString;

                renderProductsWithUrl(url, $paginatedProducts);
            })
        ;
    }

    // Product - Read More ====================================
    const $shortDescription = $('.woocommerce-product-details__short-description');

    if ($shortDescription && $shortDescription.length) {
        const $readMoreLink = $('<a href="#" class="cd-link__readMore">Read More</a>');

        $readMoreLink.on('click', e => {
            e.preventDefault();
            $shortDescription.toggleClass('cd-expanded');

            const text = $shortDescription.hasClass('cd-expanded') ? 'Show Less' : 'Read More';

            $readMoreLink.text(text);
        });

        $shortDescription.append($readMoreLink);
    }
});
