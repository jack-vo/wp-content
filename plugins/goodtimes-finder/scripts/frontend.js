// This script is loaded both on the frontend page and in the Visual Builder.

jQuery(function($) {
    const hideCategories = event => {
        const target = event.target;

        if (!target) {
            return;
        }

        const $target = $(target);

        if ($target.attr('data-component') === 'categories' ||
            $target.closest('[data-component="categories"]').length
        ) {
            return;
        }

        $('[data-component="toggle-categories"]').removeClass('active');
        $('[data-component="categories"]').addClass('hidden');
    };

    // Interaction
    $('[data-component="toggle-categories"]').click(function () {
        const $categories = $(this)
            .toggleClass('active')
            .next('[data-component="categories"]')
            .toggleClass('hidden');

        document.removeEventListener('click', hideCategories);

        requestAnimationFrame(() => {
            if (!$categories.hasClass('hidden')) {
                document.addEventListener('click', hideCategories);
            }
        });
    });

    $('[data-component="toggle-advancedOptions"]').click(function () {
        $(this)
            .toggleClass('active')
            .parent()
            .next('[data-component="advancedOptions"]')
            .toggleClass('invisible');
    });
});
