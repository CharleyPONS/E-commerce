export class ObjectUtils {
  public static objectDiffChecker(objFrom: any, objTo: any) {
    if (objFrom instanceof Object && objTo instanceof Object) {
      return Object.keys(objFrom).filter(k => objFrom[k] !== objTo[k]);
    }
  }
}
