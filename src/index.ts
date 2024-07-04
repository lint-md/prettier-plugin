import type { Plugin } from 'prettier';
import markdown from 'prettier/plugins/markdown.js';
import { lintMarkdown } from '@lint-md/core';
import { getRules, readConfig } from './utils';
import { LintOptions } from './types';

export const PARSER_NAME = 'markdown';

/**
 * 如果不想传递prettier options，可以在函数内部传递参数，同样也是支持的
 *
 * @param {Partial<LintOptions>} [ruleOptions={}]
 * @return {*}  {Plugin}
 */
export const prettierLintMd = (
  ruleOptions: Partial<LintOptions> = {},
): Plugin => {
  return {
    languages: [
      {
        name: 'prettier-plugin-lint-md',
        parsers: [PARSER_NAME],
      },
    ],
    options: getRules(),
    parsers: {
      [PARSER_NAME]: {
        ...markdown.parsers.markdown,
        preprocess: (text, options) => {
          const lint = readConfig({
            ...ruleOptions,
            configFile: options.configFile || ruleOptions.configFile,
          });
          const result = lintMarkdown(text, lint, true);
          return result.fixedResult?.result || text;
        },
      },
    },
  };
};

export default prettierLintMd();
