# sillage-front

## Introduction

Front-end implementation source code of IllTamer's personal blog.

## Technology stack

- vue3 + ts + less + vite

- bootstrap3 + jquery (deprecated)

- element-plus

- plugins
  
  - vue-router
  - axios
  - prismjs
  - editor-md
  - aplayer

## Dev-env-config

### jquery

1. powershell

    ```powershell
    npm install jquery
    npm install @types/jquery
    ```
2. main.ts

    ```ts
    import $ from 'jquery'
    createApp(App).use($)
    ```
3. vite-env.d.ts

    ```ts
    declare module jQuery {}	
    ```
4. usage

    ```ts
    import $ from 'jquery';
    ```

### prismjs

1. powershell

    ```powershell
    npm i prismjs -S
    npm i  @types/prismjs -D
    npm install vite-plugin-prismjs -D
    ```
2. vite.config.ts

    ```ts
    import prismjs from "vite-plugin-prismjs";
    plugins: [
        vue(),
        prismjsPlugin({
        languages: 'all',
        plugins: ['line-numbers'], //配置显示行号插件
        theme: 'coy', //主题名称
        css: true,
        })
    ],
    ```

3. usage

    ```ts
        import Prism from 'prismjs';
        // 资源刷新后
        .then((): void => {Prism.highlightAll()});
    ```

### editor-md

1. powershell

    ```powershell
    npm i md-editor-v3
    ```

## TODO

- bootstrap3 -> element-plus