import { test } from 'node:test';
import assert from 'node:assert/strict';

test('node --test is wired up', () => {
  assert.equal(1 + 1, 2);
});
