const prependFile = require('prepend-file');
const content = `
/*
 Theme Name:     Divi Child - 1
 Theme URI:      https://www.elegantthemes.com/gallery/divi/
 Description:    Divi Child Theme
 Author:         Elegant Themes
 Author URI:     https://www.elegantthemes.com
 Template:       Divi
 Version:        1.0.0
*/


/* =Theme customization starts here
------------------------------------------------------- */
`;

prependFile('./themes/Divi-child-1/style.css', content, function (err) {
    if (err) {
        console.log('error');
        return;
    }

    // Success
    console.log('Divi-child 1 style.css has been built!');
});