import { isObject, transform } from 'lodash';

export class RemoveNullUndefined {
  public static isNullOrUndefined(value) {
    return value === undefined || value === null;
  }

  public static removeNullOrUndefined(obj: any): any {
    if (!obj || !isObject(obj)) {
      return obj;
    }
    // @ts-ignore
    return transform(obj, (o, v, k) => {
      const isNullOrUndefined = v === null || v === undefined;
      if (!isNullOrUndefined && typeof v === 'object') {
        o[k] = RemoveNullUndefined.removeNullOrUndefined(v);
      } else if (!isNullOrUndefined) {
        o[k] = v;
      }
    });
  }
}
