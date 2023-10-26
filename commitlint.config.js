module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      'alway',
      [
        'build',
        'chore',
        'feat',
        'fix',
        'version',
        'refactor',
        'style',
        'landing',
        'document',
      ],
    ],
  },
};
