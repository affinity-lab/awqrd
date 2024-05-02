import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from "rollup-plugin-dts";

// export default {
//     input: 'src/index.ts',
//     output: {
//         file: 'dist/bundle.js',
//         format: 'cjs',
//         sourcemap: true
//     },
//     plugins: [
//         resolve(),
//         commonjs(),
//         typescript(),
//         dts()
//     ],
// };

const config = [
    {
        input: 'build/schema-helper/src/index.js',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
        },
        external: ['axios', 'os', 'url'],
        plugins: [
            commonjs()]
    }, {
        input: 'build/schema-helper/src/index.d.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'cjs'
        },
        plugins: [resolve(),
            commonjs(),
            dts()]
    }
];
export default config;