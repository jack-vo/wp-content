<?php
function my_theme_enqueue_styles() {
    wp_enqueue_style(
        'parent-theme',
        get_template_directory_uri() . '/style.css',
        array(),
        et_get_theme_version()
    );

    // Be careful, in the future if this stops working remove this line
    wp_dequeue_style( 'divi-style' );

    // Load child theme based on the modified time of the file
    wp_enqueue_style(
        'child-theme',
        get_stylesheet_uri(),
        array(),
        filemtime( get_stylesheet_directory() . '/style.css' )
    );
}
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles', 20 );

// Custom JS - if required ======================
function add_bundle_script() {
    // Use is_front_page() to check home page
    wp_enqueue_script(
        'custom-script',
        get_stylesheet_directory_uri() . '/js/cd-bundle.js',
        array( 'jquery' ),
        filemtime( get_stylesheet_directory() . '/js/cd-bundle.js' )
    );
}
add_action( 'wp_enqueue_scripts', 'add_bundle_script' );


// Disable Image Zooom when Hovering - if required ======================
//function remove_image_zoom_support() {
//    remove_theme_support( 'wc-product-gallery-zoom' );
//}
//add_action( 'wp', 'remove_image_zoom_support', 100 );
