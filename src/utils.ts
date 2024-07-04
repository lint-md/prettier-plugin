import path from 'node:path';
import fs from 'node:fs';
import * as rules from './rules';
import { LintOptions } from './types';
import { SupportOptions } from 'prettier';

/**
 * 读取 JSON 文件
 * 如果异常返回 null
 * @param file JSON 路径，可以为绝对地址也可以为相对地址
 * @returns
 */
export const readJson = (file: string) => {
  if (!file) {
    return null;
  }
  const p = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
  if (!fs.existsSync(p)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
};

/**
 * 读取配置文件
 *
 * @param {Partial<LintOptions>} [config={}]
 * @return {*}
 */
export const readConfig = (config: Partial<LintOptions> = {}) => {
  const { configFile = '.lintmdrc', ...rest } = config;
  const userConfig = readJson(configFile);
  const lint = {
    ...userConfig,
    ...rest,
  };
  /*
   * 对 lint进行转换
   * 如果是一个数字，那么表示规则的等级：
   * 0：忽略（off），不检查该规则
   * 1：警告（warning），仅出现警告，程序正常退出，不会阻断 CI
   * 2：错误（error），出现错误，程序异常退出，会阻断 CI
   */
  for (const [key, value] of Object.entries(lint)) {
    if (typeof value == 'boolean') {
      lint[key] = value ? 1 : 0;
    }
  }
  return lint;
};

export const getRules = () => {
  const obj: SupportOptions = {};
  /*
   * ts 写法问题，目前只有 string
   */
  for (const iterator of Object.values(rules)) {
    if ('type' in iterator) {
      switch (iterator.type) {
        case 'string':
          obj[iterator.name] = {
            type: 'string',
            description: iterator.description,
            category: 'Global',
          };
          break;
      }
    } else {
      obj[iterator.name] = {
        type: 'boolean',
        description: iterator.description,
        category: 'Global',
      };
    }
  }
  return obj;
};
