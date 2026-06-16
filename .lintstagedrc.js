export default {
  '**/*.{js,ts,vue}': (filenames) => {
    const files = filenames.join(' ');

    return [`eslint --fix ${files}`];
  },
};
