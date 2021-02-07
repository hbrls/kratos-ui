import { Inject, Provide } from '@midwayjs/decorator';
import { Context } from 'egg';


const FIELD_ORDER = {
  'traits.email': 1,
  'password': 2,
  'traits.name.first': 3,
  'traits.name.last': 4,
};

function getOrder(name: string) {
  const order = FIELD_ORDER[name];
  return order || Infinity;
}


@Provide()
export class KratosService {

  @Inject()
  ctx: Context;

  sortFields(config: any) {
    config.fields.sort((a: any, b: any) => getOrder(a.name) - getOrder(b.name));
  }
}
