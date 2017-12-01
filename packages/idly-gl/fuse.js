const { FuseBox, JSONPlugin } = require('fuse-box');
const fuse = FuseBox.init({
  plugins: [JSONPlugin()],
  homeDir: 'src',
  output: 'test/$name.js',
  target: 'browser',
  sourceMaps: true,
  useJsNext: true
});
fuse.bundle('app').instructions('>index.ts');
fuse.run();
