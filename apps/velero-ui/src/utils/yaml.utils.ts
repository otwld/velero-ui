import { stringify } from 'yaml';

export const parseYaml = (data: object): string[] => {
  const yaml = stringify(data);
  return yaml.split('\n');
};

export const indentYaml = (line: string) => {
  return {
    'padding-left': `${line.search(/\S/) * 0.5}rem`,
  };
};
