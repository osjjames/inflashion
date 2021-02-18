// Used https://dev.to/swyx/how-to-set-up-svelte-with-tailwind-css-4fg5

const defaultTheme = require("tailwindcss/defaultTheme");

const isProduction = !process.env.ROLLUP_WATCH; // or some other env var like NODE_ENV
module.exports = {
    theme: {
        fontFamily: {
            sans: ['Montserrat', ...defaultTheme.fontFamily.sans]
        },
        extend: {
            colors: {
                'flash-pink': '#E62B96',
                'flash-blue': '#24C5D2',
                'flash-gray': {
                    '50': '#FCFBFE',  // light text
                    '100': '#75767B', // icons
                    '200': '#68676C', // less faded text (eg x buttons)
                    '300': '#515056', // faded text
                    '600': '#29282D', // disabled buttons
                    '800': '#212025', // lighter bg
                    '900': '#1A191E'  // darker bg
                }
            }
        }
    },
    plugins: [
        // other plugins here
    ],
    purge: {
        content: [
            "./src/**/*.svelte",
            // may also want to include HTML files
            // "./src/**/*.html"
        ],
        // this is for extracting Svelte `class:` syntax. Got from https://github.com/tailwindlabs/tailwindcss/discussions/1731#discussioncomment-294774
        defaultExtractor: content => [
            ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
            ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
        ],
        enabled: isProduction // disable purge in dev
    },
};