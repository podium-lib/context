export default {
    input: 'lib/context.js',
    external: [
        'original-url',
        'camelcase',
        'url',
    ],
    output: [
        {
            exports: 'auto',
            format: 'cjs',
            dir: 'dist/',
            preserveModules: true,
        }
    ],
};
