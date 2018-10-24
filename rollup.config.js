import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const baseConfig = (outputFormat) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let file;
  switch (outputFormat) {
    case 'umd':
    case 'cjs':
      file = 'dist/' + outputFormat + '/index' + (isProduction ? '.min' : '') + '.js';
      break;

    default:
      throw new Error('Unsupported output format: ' + outputFormat);
  }

  return {
    input: 'src/index.js',
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**',  // Default: undefined
      }),
      babel({
        plugins: [
          // Ensure "external-helpers" is only included in rollup builds
          // Issue: https://github.com/rollup/rollup/issues/1595
          '@babel/external-helpers'
        ],
        runtimeHelpers: true
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      isProduction ? minify({
        comments: false,
      }) : false,
    ],
    external: [
      'classnames',
      'component-registry',
      'inferno',
      'inferno-animation',
      'inferno-create-element',
      'inferno-popper',
      'isomorphic-schema',
      'lodash.tonumber'
    ],
    output: {
      name: 'InfernoBootstrap',
      file: file,
      format: outputFormat,
      sourcemap: true,
      globals: {
        classnames: 'classNames',
        'component-registry': 'componentRegistry',
        inferno: 'Inferno',
        'inferno-animation': 'infernoAnimation',
        'inferno-create-element': 'infernoCreateElement',
        'inferno-popper': 'infernoPopper',
        'isomorphic-schema': 'isomorphicSchema',
        'lodash.tonumber': 'toNumber'
      },
    },
  };
};

export default [
  baseConfig('cjs'),
  baseConfig('umd'),
];