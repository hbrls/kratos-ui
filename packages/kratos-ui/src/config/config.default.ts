import * as fs from 'fs';
import * as path from 'path';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as envfileParser from 'egg-web/config/envfileParser';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  const properties = fs.readFileSync(path.resolve(__dirname, './application.properties'), 'utf-8');
  const props = envfileParser(properties);

  config.keys = appInfo.name + '-secret-key';

  config.middleware = [];

  config.static = {
    prefix: '/kratos-ui/',
    buffer: true,
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.kratos = {
    browser: props['kratos.browser'],
    public: props['kratos.public'],
    admin: props['kratos.admin'],
  };

  return config;
};
