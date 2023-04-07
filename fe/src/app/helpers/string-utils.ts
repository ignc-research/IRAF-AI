export class StringUtils {
    public static getFileName = (path: string) => path.replace(/^.*[\\\/]/, '');

    public static getFileNameWithoutExt = (path: string) => this.getFileName(path).split('.')[0];
}