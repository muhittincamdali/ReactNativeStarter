// Metro uses babel-preset-expo without this file; Jest needs it to transform TypeScript and JSX.
module.exports = function config(api) {
  api.cache(true);
  return { presets: ['babel-preset-expo'] };
};
