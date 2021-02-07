import { Provide, Inject, Config, Controller, Get, Query } from '@midwayjs/decorator';
import { Context } from 'egg';
import { Configuration, PublicApi } from '@ory/kratos-client';
import { KratosService } from '../service/kratos';


@Provide()
@Controller('/kratos-ui')
export class ViewController {

  @Inject()
  ctx: Context;

  @Config('kratos')
  config;

  @Inject()
  kratosService: KratosService;

  @Get('/home')
  async home() {
    return 'view.ts';
  }

  @Get('/health/alive')
  async alive() {
    return { statsu: 'ok' };
  }

  @Get('/dashboard', { middleware: [ 'kratosMiddleware' ] })
  async dashboard() {
    await this.ctx.render('dashboard.html', { identity: this.ctx.local.identity, traits: JSON.stringify(this.ctx.local.identity.traits, null, 2) });
  }

  @Get('/login')
  async login(@Query('flow') flowId: string) {
    if (!flowId) { // if (!flow || !isString(flow))
      const browser = this.config.browser;
      return this.ctx.redirect(`${browser}/self-service/login/browser`);
    }

    const api = this.config.public;
    const kratos = new PublicApi(new Configuration({ basePath: api }));
    const { data: flow } = await kratos.getSelfServiceLoginFlow(flowId);

    await this.ctx.render('login.html', { form: flow.methods.password.config });
  }

  @Get('/registration')
  async registration(@Query('flow') flowId: string) {
    if (!flowId) { // if (!flow || !isString(flow))
      const browser = this.config.browser;
      return this.ctx.redirect(`${browser}/self-service/registration/browser`);
    }

    const api = this.config.public;
    const kratos = new PublicApi(new Configuration({ basePath: api }));
    const { data: flow } = await kratos.getSelfServiceRegistrationFlow(flowId);

    this.kratosService.sortFields(flow.methods.password.config);
    await this.ctx.render('registration.html', { form: flow.methods.password.config });
  }
}
