# Setup

## Building Project

1. Run "npm run dev" to build app in development mode or "npm run prod" to run in production mode.
2. Move files from /client/dist to /server/web. The server will be looking for files here to serve to users.

## Initial Project Setup

The client directory was created using npx create-react-app name-of-app --template typescript
[Reference](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)

The tsconfig.json file was edited to match more closely to the Airbnb style guide.

Webpack is used to compile the project instead of npm create react app for more visibility and configurability into the process. Setup based on [Webpack's Getting Started](https://webpack.js.org/guides/getting-started/) and [Webpack's Typescript](https://webpack.js.org/guides/typescript/) and [Webpack's Production](https://webpack.js.org/guides/production/).

# Configuration

The below items should be updated for your copies of the site.

-   webpack.common.js
    -   title
-   package.json
    -   name and version
-   Index.html
    -   Meta tages for Author and Description
-   Favicons and site.webmanifest
    -   Files live in /public
    -   Examples created using [favicon.io](https://favicon.io/favicon-converter/)
-   Profile image
    -   Hard coded to /public/images/profile_square_small.jpg
-   Contact Info
    -   Links to various social medias and communication options
    -   GITHUB_LINK, LINKEDIN_LINK, EMAIL_ADDRESS in .env files
-   About Me and Home page text
    -   Text shown in those components live in the aboutme.tsx and home.tsx files respectively
-   reCAPTCHA site key - Spam protection. [Sign up here](https://developers.google.com/recaptcha) - RECAPTCHA_SITE_KEY in .env files
    The below items may be updated if desired.
-   APIs
    -   CONTACT_FORM_API, PRODUCT_API, ERROR_API, CHECKOUT_API in .env files
    -   these should match the routes from the server file

# File descriptions

## index.d.ts

> For this project's purposes, the file is used to make .jpg files available to import into components. You should not have to mess with this much until you get significanly more involved in customizing the project source code.

The `index.d.ts` file is a declaration file that contains type definitions for your project. It is used by TypeScript to check the types of your variables, functions, classes and other entities. It can also provide code completion and documentation for your project in editors that support TypeScript.

Some of the information that you can specify in the `index.d.ts` file are:

-   `export`: A keyword that indicates that a variable, function, class or interface is exported from your module and can be imported by other modules.
-   `import`: A keyword that indicates that a variable, function, class or interface is imported from another module and can be used in your module.
-   `declare`: A keyword that indicates that a variable, function, class or interface is declared but not defined in your module. It can be used to describe external entities that are not part of your module, such as global variables or third-party libraries.
-   `interface`: A keyword that defines a type that describes the shape of an object. It can have properties and methods that specify the names and types of the object's members.
-   `type`: A keyword that defines a type alias that can be used as a shorthand for a more complex type. It can be composed of primitive types, union types, intersection types, literal types or other type aliases.

You can find more information about the `index.d.ts` file and its syntax on the [official TypeScript documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).

## package.json

> This is a project configuration file that tells the npm tool what to do. Some fields like name, version will need to be updated for your copy of the project. The scripts fields may need to be updated if you change webpack files.

The `package.json` file is a manifest file that contains metadata about your project and its dependencies. It is used by `npm` (Node Package Manager) to install, update and manage the packages that your project needs.

You should update the `package.json` file whenever you want to change the name, version, description, main, scripts, dependencies, devDependencies, peerDependencies or engines of your project. You can use the `npm init` command to create or update the `package.json` file interactively, or you can edit it manually using a text editor. You should also commit the `package.json` file to your version control system, such as Git, to keep track of the changes and share them with other developers or environments.

Some of the information that you can specify in the `package.json` file are:

-   `name`: The name of your project. It should be unique and follow the [npm naming guidelines](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#name).
-   `version`: The current version of your project. It should follow the [semantic versioning](https://semver.org/) scheme.
-   `description`: A short description of your project. It can be used by search engines and other tools to display information about your project.
-   `main`: The entry point of your project. It is the file that will be executed when you run `npm start` or `node .`.
-   `scripts`: A set of commands that you can run using `npm run <script-name>`. For example, you can define a script to build, test or deploy your project.
-   `dependencies`: A list of packages that your project depends on. These packages will be installed in the `node_modules` folder when you run `npm install`.
-   `devDependencies`: A list of packages that are only needed for development purposes, such as testing or linting tools. These packages will not be installed in production environments.
-   `peerDependencies`: A list of packages that your project expects to be installed by the user or the host environment. These packages will not be installed by `npm`, but will be checked for compatibility.
-   `engines`: A list of Node.js versions that your project supports. This can help prevent installation errors or runtime issues on incompatible platforms.

You can find more information about the `package.json` file and its properties on the [official npm documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json).

## package-lock.json

> This is a bookkeeping file. It should be kept up-to-date automatically when running standard npm commands and not require manual handling.

The `package-lock.json` file is a lock file that contains the exact versions of the packages that your project depends on. It is generated by `npm` when you run `npm install` or `npm update`. It ensures that your project will always use the same versions of the packages, regardless of any changes in the `package.json` file or the `npm` registry.

You do not need to manually update the `package-lock.json` file. It will be automatically updated by `npm` whenever you install, update or remove a package from your project. You should not edit the `package-lock.json` file by hand, as it may cause inconsistencies or errors in your project. You should also commit the `package-lock.json` file to your version control system, such as Git, to ensure that other developers or environments can use the same versions of the packages as you do.

Some of the information that you can find in the `package-lock.json` file are:

-   `name`: The name of your project, as specified in the `package.json` file.
-   `version`: The version of your project, as specified in the `package.json` file.
-   `lockfileVersion`: The version of the lock file format. It should be 1 for `npm` versions 5 and 6, and 2 for `npm` version 7 or higher.
-   `requires`: A boolean value that indicates whether the dependencies are specified with a range or an exact version in the `package.json` file.
-   `dependencies`: An object that contains the information about each package that your project depends on. It includes the name, version, resolved URL, integrity hash, dependencies and other metadata of each package.

You can find more information about the `package-lock.json` file and its structure on the [official npm documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json).

## tsconfig.json

> This is a file describing how code is checked and handled. This project's tsconfig.json is configured with moderately strict type checking settings. You should not have to update anything here unless you want to how your editor handles code checking.

The `tsconfig.json` file is a configuration file that contains options for the TypeScript compiler. It is used by TypeScript to compile your `.ts` and `.tsx` files into JavaScript files that can run in the browser or Node.js.

Some of the options that you can specify in the `tsconfig.json` file are:

-   `compilerOptions`: An object that contains various settings for the TypeScript compiler, such as the target JavaScript version, the module system, the source map generation, the type checking rules and more.
-   `include`: An array of glob patterns that specify which files or folders to include in the compilation. By default, all `.ts` and `.tsx` files in your project are included.
-   `exclude`: An array of glob patterns that specify which files or folders to exclude from the compilation. By default, the `node_modules`, `bower_components`, `jspm_packages` and `<outDir>` folders are excluded.
-   `extends`: A string that specifies another configuration file to inherit from. This can be useful to share common settings across multiple projects or environments.

You can find more information about the `tsconfig.json` file and its options on the [official TypeScript documentation](https://www.typescriptlang.org/tsconfig).

## webpack.common.js

> Webpack turns source code into final files that can be used by the client. This shared config file uses fairly simple and stardard options. It is referenced when running `npm run dev` or `npm run prod` commands. You may need to update if you change up the names or locations of project files.

The `webpack.common.js` file is a shared configuration file that contains common options for Webpack, a module bundler for JavaScript and TypeScript applications. It is used by Webpack to bundle your `.js`, `.ts` and `.tsx` files into one or more output files that can run in the browser or Node.js. This file is setup based on [Webpack's Getting Started guide](https://webpack.js.org/guides/getting-started/) and [Webpack's Typescript documentation](https://webpack.js.org/guides/typescript/).

This file is used as a base for webpack settings that are the extended by the `webpack.dev.js` and `webpack.prod.js` files (see below).

Some of the options that you can specify in the `webpack.common.js` file are:

-   `entry`: An object that specifies the entry points of your application. Each entry point is a file that imports or requires other files and modules. Webpack will start from these files and create a dependency graph of your application.
-   `output`: An object that specifies the output options for your bundles. It includes the path, filename, public path and other properties of the output files.
-   `output.filename: '[name].[contenthash].js'`: This sets the output filename to include a content-based hash, which helps with caching and invalidation. ²
-   `module`: An object that specifies how different types of modules are treated by Webpack. It includes rules for loaders, which are plugins that transform the source code of your modules before bundling them.
-   `plugins`: An array of plugins that enhance the functionality of Webpack. Plugins can perform tasks such as generating HTML files, optimizing bundles, injecting variables and more.
-   `resolve`: An object that specifies how Webpack resolves the modules that are imported or required by your files. It includes extensions, aliases, modules and other properties that affect the module resolution process.

You can find more information about the `webpack.common.js` file and its options on the [official Webpack documentation](https://webpack.js.org/configuration/).

### HtmlWebpackPlugin

> This plugin updates our basic "template" HTML file to use the final code files and references created when compiling the project. You will need to update the title to match your project, and potentially the template if you update the name or location of the "root" HTML file.

The HtmlWebpackPlugin is a webpack plugin that simplifies the creation of HTML files to serve your webpack bundles. It is especially useful for webpack bundles that include a hash in the filename which changes every compilation. You can either let the plugin generate an HTML file for you, supply your own template using lodash templates, or use your own loader. It currently uses the html file specified in `./public/index.html`.

For all configuration options, please see the [plugin documentation](https://webpack.js.org/plugins/html-webpack-plugin/).

### MiniCssExtractPlugin

> This plugin improves performance when loading the site. It should not need to be edited.

The MiniCssExtractPlugin is a webpack plugin that extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps. This can improve the performance and caching of your application, as well as enable code splitting and lazy loading of CSS.

For all configuration options, please see the [plugin documentation](https://webpack.js.org/plugins/mini-css-extract-plugin/).

### CopyPlugin

> This plugin is currently used to copy non-code files like favicon images that are not otherwise processed by webpack to the final webpack destination. You will need to update this if you move or rename files in the public folder.

The CopyPlugin is a webpack plugin that copies individual files or entire directories, which already exist, to the build directory. It is useful for copying static assets such as images, fonts, icons, etc. that are not imported by webpack modules.

For all configuration options, please see the [plugin documentation](https://webpack.js.org/plugins/copy-webpack-plugin/).

## webpack.dev.js

> Webpack turns source code into final files that can be used by the client. This webpack configuration file is used with running `npm run dev` as specified in `package.json`. It tells webpack to use the dev.env file with the testing configuration options.

The `webpack.dev.js` file is a configuration file that contains development-specific options for Webpack, a module bundler for JavaScript and TypeScript applications. It is used by Webpack to bundle your `.js`, `.ts` and `.tsx` files into one or more output files that can run in the browser or Node.js in development mode.

Some of the options that you can specify in the `webpack.dev.js` file are:

-   `mode`: A string that specifies the mode of Webpack. It can be either `development` or `production`. Setting it to `development` enables some optimizations and features that are useful for development, such as source maps, caching and hot module replacement¹.
-   `devtool`: A string that specifies the type of source map to generate for debugging purposes. Source maps are files that map the bundled code to the original source code, allowing you to inspect and debug your code in the browser¹⁴.

You can find more information about the `webpack.dev.js` file and its options at [Webpack's Production](https://webpack.js.org/guides/production/).

### Dotenv Plugin

> This plugin specifies which .env file is used by project. It should point to your testing/development specific .env file.

The dotenv module is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. It is useful for storing configuration variables that are different for each environment, such as API keys, database credentials, etc. However, the dotenv module only works in Node.js and does not expose the environment variables to the browser.

`dotenv-webpack` automatically loads the `.env` file and replaces any instances of `process.env.*` in your code with the values from the file. By default, it will look for a `.env` file in your project root. You can also specify a different path or name for your `.env` file using the `path` option. For example:

```js
new Dotenv({
	path: "./config/.env", // load this now instead of the default .env
});
```

To use the environment variables in your code, simply access them via `process.env.*`. For example:

```js
console.log(process.env.API_KEY); // prints the value of API_KEY from .env file
```

You can find more information about the `dotenv-webpack` plugin and its options on its GitHub repository:

-   [https://github.com/mrsteele/dotenv-webpack](https://github.com/mrsteele/dotenv-webpack)

## webpack.prod.js

> Webpack turns source code into final files that can be used by the client. This webpack configuration file is used with running `npm run prod` as specified in `package.json`. It tells webpack to use the prod.env file with the live production configuration options.

The `webpack.prod.js` file is a configuration file for Webpack that is used to build and optimize the production version of a React application. The `webpack.prod.js` file usually extends from a common webpack configuration file (`webpack.common.js`) that contains the shared settings for both development and production environments It contains settings and plugins that are specific to the production environment, such as:

Some of the configuration options that would be used for a production webpack file and why are they used are:

-   `mode: 'production'`: This sets the mode to production, which enables various optimizations for the code, such as tree shaking, code splitting, minification, etc. ²
-   `devtool: 'source-map'`: This sets the devtool to source-map, which generates separate source map files for debugging the minimized code. ²
-   `optimization.minimize: true`: This tells webpack to minimize the bundle using the TerserPlugin or other plugins specified in `optimization.minimizer`. ¹

You can find more information about the `webpack.prod.js` file and its options at [Webpack's Production](https://webpack.js.org/guides/production/).

### CompressionPlugin

> Enable for performance and should not need to be changed.

The CompressionPlugin is a webpack plugin that prepares compressed versions of assets to serve them with Content-Encoding. It can compress files using various algorithms such as gzip, brotli, zopfli, etc. It can improve the performance and bandwidth of your application by reducing the size of the assets.

For all configuration options, please see the [plugin documentation](https://webpack.js.org/plugins/compression-webpack-plugin/).

### Terser Plugin

> Enable for performance and should not need to be changed.

The terser plugin is a plugin that uses the [terser](https://terser.org/) library to minify/minimize your JavaScript code. It removes comments, makes variable names smaller, and removes whitespace. It also supports ES6+ syntax and can compress and mangle the code to reduce the size and improve the performance.

The terser plugin can be used with webpack by installing it as a dependency and adding it to the `optimization.minimizer` array in the webpack configuration. It can also accept various options to customize the minification process, such as:

### MiniCssExtractPlugin

> This plugin improves performance when loading the site. It should not need to be edited.

The MiniCssExtractPlugin is a webpack plugin that extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps. This can improve the performance and caching of your application, as well as enable code splitting and lazy loading of CSS.

For all configuration options, please see the [plugin documentation](https://webpack.js.org/plugins/mini-css-extract-plugin/).

### Dotenv Plugin

> This plugin specifies which .env file is used by project. It should point to your production specific .env file.

The dotenv module is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. It is useful for storing configuration variables that are different for each environment, such as API keys, database credentials, etc. However, the dotenv module only works in Node.js and does not expose the environment variables to the browser.

`dotenv-webpack` automatically loads the `.env` file and replaces any instances of `process.env.*` in your code with the values from the file. By default, it will look for a `.env` file in your project root. You can also specify a different path or name for your `.env` file using the `path` option. For example:

```js
new Dotenv({
	path: "./config/.env", // load this now instead of the default .env
});
```

To use the environment variables in your code, simply access them via `process.env.*`. For example:

```js
console.log(process.env.API_KEY); // prints the value of API_KEY from .env file
```

You can find more information about the `dotenv-webpack` plugin and its options on its GitHub repository:

-   [https://github.com/mrsteele/dotenv-webpack](https://github.com/mrsteele/dotenv-webpack)
