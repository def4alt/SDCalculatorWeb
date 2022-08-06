const path = require("path");
const tailwindcss = require("tailwindcss");
const purgeCSS = require("@fullhuman/postcss-purgecss");
/**
 * Function that mutates the original webpack config.
 * Supports asynchronous changes when a promise is returned (or it's an async function).
 *
 * @param {import('preact-cli').Config} config - original webpack config
 * @param {import('preact-cli').Env} env - current environment and options pass to the CLI
 * @param {import('preact-cli').Helpers} helpers - object with useful helpers for working with the webpack config
 * @param {Record<string, unknown>} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
 */
export default (config, env, helpers, options) => {
    config.resolve.alias = {
        src: path.resolve(__dirname, "src"),
        ...config.resolve.alias,
    };

    const postCssLoaders = helpers.getLoadersByName(config, "postcss-loader");
    postCssLoaders.forEach(({ loader }) => {
        const plugins = loader.options.postcssOptions.plugins;

        // Add tailwindcss to top of plugins list
        plugins.unshift(tailwindcss("./tailwind.config.js"));

        // Purging enabled only during production build
        if (env.production) {
            plugins.push(
                purgeCSS({
                    content: [
                        "./src/**/*.ts",
                        "./src/**/*.js",
                        "./src/**/*.html",
                        "./src/**/*.svg",
                        "./src/**/*.tsx",
                    ],
                    keyframes: true,
                    defaultExtractor: (content) =>
                        content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
                })
            );
        }
    });

    return config;
};
