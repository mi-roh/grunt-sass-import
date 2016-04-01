# grunt-sass-import

> A Grunt module for importing Sass partials with (some very basic) notion of source order

## What is this?
If you use Sass to generate your stylesheets, then you're probably using partials to keep your code modular by separating it into different files. You probably also have different files for global rules, mixins, variables and whatnots. If this is the case, you probably have a main file where you `@import` all the other files.

The annoying thing is that if you have a directory full of partials, you have to include them individually because Sass does not support globbing in the `@import` statements (i.e. you **can't** do `@import mixins/*`).

This Grunt plugin brings that functionality and allows you to import entire directories into your Sass structure. Since source order actually matters in Sass, it offers a *very basic* mechanism for managing import order.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sass-import --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sass-import');
```

## The "sass_import" task

### Overview
In your project's Gruntfile, add a section named `sass_import` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sass_import: {
    options: {},
    dist: {
      files: {
        'destination file': [source files]
      }
    },
  },
});
```

### Options

#### options.allowedExtensions
- Type: `Array`
- Default value: `['.sass', '.scss']`

Defines the allowed file extensions.

#### options.includeExtension
- Type: `Boolean`
- Default value: `false`

Whether to include file extensions in the `@import` statements (e.g. `@import file.scss` rather than `@import file`)

### Including files
One of the main issues with Sass partial loaders is the source order is important. For example, if you declare a variable in partial `_a.scss` and make use of it in `_b.scss`, you have to import `_a.scss` and then `_b.scss`, otherwise you'll see an error.
This Grunt plugin offers support for manipulating source order.

#### Basic syntax
If you don't care about source order, you can simply pass an array of file paths to be included.

```js
grunt.initConfig({
  sass_import: {
    options: {},
    dist: {
      files: {
        'main.scss': ['base/*', 'mixins/*', 'modules/*']
      }
    }
  },
});
```

In this case, all the files from `base/*` will be included in their natural order (alphabetically), as well as all the files from `mixins/*` and finally `modules/*`.

#### Advanced syntax
If you have a partial that depends on others within the same directory, you can chose to include it after all the other files.

```js
grunt.initConfig({
  sass_import: {
    options: {},
    files: {
      'main.scss': [
        'global/*', 
        '!global/_global.scss'
        'global/_global.scss'
      ]
    },
  },
});
```

Conversely, you can choose to import a file first, before all the other files in a directory.

```js
grunt.initConfig({
  sass_import: {
    options: {},
    files: {
      'main.scss': [
        'global/_headings.scss',
        'global/*'
      ]
    },
  },
});
```

Exclude Files if necessary. 
Targetfiles will not import theme self.

```js
grunt.initConfig({
  sass_import: {
    options: {},
    files: {
      'lib/_all.scss': [
        'lib/**/*',
        '!lib/_disable.scss'
      ]
    },
  },
});
```


### Typical use case
A typical use case is to have `sass_import` creating a main Sass file with all the imports which will then feed into a Sass task to generate the CSS code.

```js
grunt.initConfig({
  path : {
    css : {
      src : 'sass/',
      dist : 'css/'
    }
  }
  sass_import: {
    options: {
    },
    files: {
      '<%= path.css.src %>main.scss': [
        '<%= path.css.src %>global/_headings.scss',
        '<%= path.css.src %>global/*'
      ]
    },
  },

  sass: {
    dist: {
      options: {
        style: 'compressed'
      },
      files: {
        '<%= path.css.dist %>main.css': '<%= path.css.src %>main.scss'
      }
    }
  },

  watch: {
    stylesheets: {
      files: [
        '<%= path.css.dist %>**/*.scss',
        '<%= path.css.dist %>**/*.sass'
      ],
      tasks: ['sass_import', 'sass']
    }
  },
});
```

## Contributing
Feel free to contribute with issues/code/love.

## Release History
v0.1.0 - Still testing the whole thing.
