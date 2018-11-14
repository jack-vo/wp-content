// This script is loaded both on the frontend page and in the Visual Builder.

jQuery(function($) {
    // Interaction
    $('[data-component="toggle-categories"]').click(function () {
        $(this)
            .toggleClass('active')
            .next('[data-component="categories"]').toggle();
    });
});
