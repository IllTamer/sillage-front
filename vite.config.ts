import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { prismjsPlugin } from "vite-plugin-prismjs";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { build } from 'esbuild';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    prismjsPlugin({
      languages: 'all',
      plugins: ['line-numbers'], //配置显示行号插件
      theme: 'coy', //主题名称
      css: true,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  server: {
    open: true,
    cors: true,
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       // 文件区块划分
  //       manualChunks: {
  //         Prism: ['Prism']
  //       }
  //     }
  //   }
  // }
});