const path = require('path');
const fs = require('fs');
const prependFile = require('prepend-file');
const theme = (() => {
    const args = process.argv;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg.indexOf('--theme=') === 0) {
            return arg.split('=')[1];
        }
    }
})();
const themeCommentFilePath = path.resolve(__dirname, `../src/themes/${theme}-child-1/scss/_themeComment.scss`);
const content = fs.readFileSync(themeCommentFilePath, 'utf8');

prependFile(`./themes/${theme}-child-1/style.css`, content, function (err) {
    if (err) {
        console.log('error');
        return;
    }

    // Success
    console.log(`${theme}-child 1 style.css has been built!`);
});