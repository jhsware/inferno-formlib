import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const baseConfig = (outputFormat) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let file;
  switch (outputFormat) {
    case 'cjs':
      file = 'dist/index.' + outputFormat + (isProduction ? '.min' : '') + '.js';
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
      exports: 'named',
      globals: {
        classnames: 'classNames',
        'component-registry': 'componentRegistry',
        'inferno': 'Inferno',
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
  baseConfig('cjs')
];