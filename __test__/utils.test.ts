import { expect, test } from 'vitest';
import { getRules, readJson } from '../src/utils';

test(`readJson`, () => {
  expect(readJson('./package.json')?.name).toBeTypeOf('string');
  expect(readJson('./package1.json')).toBeNull();
});

test(`getRules`, () => {
  expect(getRules()).toHaveProperty('no-space-in-inline-code');
  expect(Object.keys(getRules())).toHaveLength(16);
});
