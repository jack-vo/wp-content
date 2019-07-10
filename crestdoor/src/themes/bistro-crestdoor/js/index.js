import '../scss/style.scss';

jQuery(() => {
    const $ = jQuery;
    const $htmlBody = $('html, body');
    const $body = $('body');
    const renderSinglePage = () => {
        // Update price
        const $price = $body.find('.product_title + .price');
        const $variationWrap = jQuery('.single_variation_wrap');
        const updatePrice = function () {
            $price
                .fadeIn()
                .html($variationWrap.find('.woocommerce-variation-price').html())
                .find('.price').removeClass('price');
        };

        if (typeof woo_discount_rules !== 'undefined') {
            $variationWrap.on('woo_discount_rules_after_variant_strikeout', updatePrice);
        } else {
            $variationWrap.on('show_variation', updatePrice);
        }

        // Add sizechart button
        $('.reset_variations')
            .after('<a id="cd-product-info-link" href="#tab-title-size_chart">Size chart</a>')
            .remove();

        $('#cd-product-info-link').on('click', function (e) {
            e.preventDefault();

            const href = this.getAttribute('href');
            const $tab = $(href);

            if ($tab.length) {
                $tab.find('a').trigger('click');
                $htmlBody.stop().animate({ scrollTop: $tab.offset().top - 150 });
            }
        });
    };

    // Single page
    if ($body.hasClass('single-product')) {
        renderSinglePage();
    }
});