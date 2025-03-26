import { expect, test } from 'vitest';
import { format } from 'prettier';
import { prettierLintMd, PARSER_NAME } from '../src/index';
import fs from 'node:fs';
import path from 'node:path';

test(`no-space-in-inline-code`, async () => {
  const md = '- right `      const a = 1     ` 你好';

  await expect(
    format(md, {
      parser: PARSER_NAME,
      plugins: [
        prettierLintMd({
          'no-space-in-inline-code': true,
        }),
      ],
    }),
  ).resolves.toBe('- right `const a = 1` 你好\n');
});

test(`no-space-in-inline-code 配置文件`, async () => {
  const configPath = path.join(process.cwd(), '.test');

  fs.writeFileSync(
    configPath,
    JSON.stringify({ 'no-space-in-inline-code': true }),
    'utf-8',
  );

  const md = '- right `      const a = 1     ` 你好';

  await expect(
    format(md, {
      parser: PARSER_NAME,
      plugins: [
        prettierLintMd({
          configFile: configPath,
        }),
      ],
    }),
  ).resolves.toBe('- right `const a = 1` 你好\n');

  fs.rmSync(configPath);
});
