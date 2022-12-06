import { AppSettings } from "../../../AppSettings";
import Requests from "./Requests";

export class GeneratorApi {
    requests = new Requests(AppSettings.generatorApi);
    constructor() {
    }

    urdfs = async () => await this.requests.getJsonData('urdf');
}