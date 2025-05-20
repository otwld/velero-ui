import { stringify } from 'yaml';

export const parseYaml = (data: object): string[] => {
  const yaml = stringify(data);
  return yaml ? yaml.split('\n') : [];
};

export const indentYaml = (line: string) => {
  return {
    'padding-left': `${line.search(/\S/) * 0.5}rem`,
  };
};

export const highlightIndent = (line) => {
  const match = line.match(/^(\s*)(.*)$/);

  if (!match) {
    return line;
  }

  const [_, indent, content] = match;
  const spaceCount = indent.length;
  const safeContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<span class="whitespace-pre">${' '.repeat(spaceCount)}</span>${safeContent}`;
};
