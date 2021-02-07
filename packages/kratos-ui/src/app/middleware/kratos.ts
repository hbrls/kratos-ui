import { Provide, ScopeEnum, Scope, Config } from '@midwayjs/decorator';
import { Configuration, PublicApi } from '@ory/kratos-client';


@Provide('kratosMiddleware')
@Scope(ScopeEnum.Singleton)
export class KratosMiddleware {

  @Config('kratos')
  config;

  resolve() {
    return async (ctx, next) => {
      const api = this.config.public;

      const kratos = new PublicApi(new Configuration({ basePath: api }));
      // ctx.logger.info(kratos);

      try {
        const { data: session } = await kratos.whoami(ctx.get('Cookie'), ctx.get('Authorization'));
        const { id: sid, identity /* active, authenticated_at, issued_at, expires_at, */ } = session;
        const { id: uid, /* traits, schema_id, schema_url, recovery_addresses, verifiable_addresses, */ } = identity;
        // ctx.logger.info(uid, sid, active, traits);
        ctx.local = { uid, sid, identity };
      } catch(e) {
        ctx.response.redirect('/kratos-ui/login');
        return;
      }

      await next();
    }
  }
}
