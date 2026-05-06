import { describe, expect, it } from 'vitest';

import { fileExt } from '../fileExt';

describe('fileExt', () => {
  it('returns lowercased extension when present', () => {
    expect(fileExt('avatar.PNG')).toBe('png');
  });

  it('returns jpg when extension is missing', () => {
    expect(fileExt('profile-photo')).toBe('jpg');
  });

  it('uses the last extension segment for compound names', () => {
    expect(fileExt('archive.backup.JPEG')).toBe('jpeg');
  });
});
