import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from "rollup-plugin-dts";

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