import { escapeRegExp } from './escape-regexp';

export const searchRegexp = (search: string) =>
  new RegExp(
    search
      .trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .map((w) => `(?=.*${escapeRegExp(w)})`)
      .join('') + '.+',
    'gi',
  );
