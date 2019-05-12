<?php
function my_theme_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
}
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );

// Custom JS - if required ======================
//function add_bundle_script() {
//    wp_enqueue_script(
//        'custom-script',
//        get_stylesheet_directory_uri() . '/js/cd-bundle.js',
//        array( 'jquery' )
//    );
//}
//
//add_action( 'wp_enqueue_scripts', 'add_bundle_script' );


// Disable Image Zooom when Hovering - if required ======================
//function remove_image_zoom_support() {
//    remove_theme_support( 'wc-product-gallery-zoom' );
//}
//add_action( 'wp', 'remove_image_zoom_support', 100 );
