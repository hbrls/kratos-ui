import { Provide, Inject, Controller, Get } from '@midwayjs/decorator';
import { Context } from 'egg';


@Provide()
@Controller('/kratos-ui')
export class ViewController {

  @Inject()
  ctx: Context;

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
}
