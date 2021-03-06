// Used https://dev.to/swyx/how-to-set-up-svelte-with-tailwind-css-4fg5

const defaultTheme = require("tailwindcss/defaultTheme");

const isProduction = !process.env.ROLLUP_WATCH; // or some other env var like NODE_ENV
module.exports = {
    theme: {
        fontFamily: {
            sans: ['Montserrat', ...defaultTheme.fontFamily.sans]
        },
        boxShadow: {
            'flash-blue': '0px 0px 15px -2px rgba(36,197,210,0.7)'
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
            },
            gridTemplateColumns: {
                'bc-controller': '1em 1fr',
            },
            gridTemplateRows: {
                'bc-controller': '1fr 1em',
            },
            backgroundImage: {
                // 'flash-gradient': "linear-gradient(60deg, #e62b96, #d847b4, #c45ecf, #aa72e4, #8a83f2, #6492fb, #329efe, #00a9fb, #00b2f4, #00b9ea, #00c0de, #24c5d2)"
                'flash-gradient': "linear-gradient(60deg, #e62b96 0%, #62a3f9 65%, #24c5d2 100%)"
            },
            cursor: {
                'crosshair': 'crosshair'
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