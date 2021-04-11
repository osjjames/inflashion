// Used https://dev.to/swyx/how-to-set-up-svelte-with-tailwind-css-4fg5

const defaultTheme = require("tailwindcss/defaultTheme");

const isProduction = !process.env.ROLLUP_WATCH; // or some other env var like NODE_ENV
module.exports = {
    theme: {
        fontFamily: {
            sans: ['Montserrat', ...defaultTheme.fontFamily.sans]
        },
        boxShadow: {
            'flash-blue': '0px 0px 15px -2px rgba(36,197,210,0.7)',
            'palette-1': '0px 0px 6px 0px #E62B96',
            'palette-2': '0px 0px 6px 0px #b16ddf',
            'palette-3': '0px 0px 6px 0px #4e98fd'
        },
        stroke: theme => ({
            'current': 'currentColor',
            'white': theme('colors["flash-gray"].50'),
            'gray': theme('colors["flash-gray"].300'),
            'palette': {
                '1': theme('colors["flash-palette"].1'),
                '2': theme('colors["flash-palette"].2'),
                '3': theme('colors["flash-palette"].3'),
                '4': theme('colors["flash-palette"].4'),
                '5': theme('colors["flash-palette"].5'),
            }
        }),
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
                },
                'flash-palette': {
                    '1': '#E62B96',
                    '2': '#b16ddf',
                    '3': '#4e98fd',
                    '4': '#00b4f2',
                    '5': '#24c5d2'
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
            },
            height: {
                'fit': 'fit-content'
            },
            width: {
                'fit': 'fit-content'
            },
            minWidth: {
                '2.5': '0.625rem',
            },
            minHeight: {
                '2.5': '0.625rem',
            },
            strokeWidth: {
                '3': '3',
                '4': '4',
            },
            transformOrigin: {
                'bottom-center': '50% 100%'
            }
        }
    },
    variants: {
        extend: {
            margin: ['last']
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