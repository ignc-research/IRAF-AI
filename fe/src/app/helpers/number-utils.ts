export class NumberUtils {
  public static deg2Rad = (val: number) =>  val * (Math.PI / 180.0);

  public static rad2Deg = (val: number) => val * 180.0 / Math.PI;
}