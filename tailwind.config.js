// Used https://dev.to/swyx/how-to-set-up-svelte-with-tailwind-css-4fg5

const isProduction = !process.env.ROLLUP_WATCH; // or some other env var like NODE_ENV
module.exports = {
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