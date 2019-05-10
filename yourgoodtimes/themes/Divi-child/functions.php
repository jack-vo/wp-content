<?php
function my_theme_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );

    if(is_page()){
        $slug = basename(get_permalink());

        if ($slug === 'good-times-finder') {
            wp_enqueue_script('custom_script', get_stylesheet_directory_uri() . '/includes/js/goodtimesFinder.js', [], '0.1.0', true);
        }
    }
}
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );
