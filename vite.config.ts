import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        // sourcemap: true,
        rollupOptions: {
            external: ['/test-cases'],
            input: ['./index.html', './src/index.js'],
            output: {
                entryFileNames: chunk => {
                    if (chunk.facadeModuleId?.endsWith('index.js')) {
                        return 'canvas-test.js';
                    } else if (chunk.facadeModuleId?.endsWith('index.html')) {
                        return 'app.js';
                    }
                },
                exports: 'named',
                minifyInternalExports: false,
            }
        },
        emptyOutDir: false,
    },

    base: './',

    server: {
        proxy: {
            // '/test-cases': 'http://localhost:8000',
            '/test-cases': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                configure: (proxy, options) => {
                    console.log("#### PROXY", proxy)
                    console.log("#### OPTIONS", options)
                }
            }
        }
    }
});


/*import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],

    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'canvas-test',
            fileName: 'canvas-test',
        },
        rollupOptions: {
            external: ['/assets/test-cases.js', '/test-cases', 'vue'],
            output: {
                globals: {
                    vue: 'Vue',
                }
            }
        },
    }
});*/
