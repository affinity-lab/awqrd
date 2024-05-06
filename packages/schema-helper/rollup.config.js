import typescript from "@rollup/plugin-typescript";

const config = [
    {
        // input: 'build/schema-helper/src/index.js',
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'es',
        },
        plugins: [typescript()]
    }
];
export default config;