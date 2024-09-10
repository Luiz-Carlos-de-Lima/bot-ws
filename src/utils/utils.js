export default class Utils {

  static delay(ms) {
    return new Promise(_ => setTimeout(_, ms));
  }

}
