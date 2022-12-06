import { AppSettings } from "../../../AppSettings";
import { SelectedFile } from "../FileSelector";
import Requests from "./Requests";

export class PoseEstimationApi {
    requests = new Requests(AppSettings.poseEstimationApi);

    // Remove file fields as log requests gets sent frequently
    getSlimModel = (model: any) => {
    const newModel = {...model}
    Object.keys(model).filter(x => typeof(model[x]) == 'object').forEach(x => {
        newModel[x] = {...model[x]};
        Object.keys(newModel[x]).forEach(y => {
        if (newModel[x][y].type == "file" || newModel[x][y].type == "multifile") {
            delete newModel[x][y];
        }
        });
    });
    return newModel;
    }

    log = async (type: string, model: any) => await this.requests.postJsonData(type + '/Log', { model: this.getSlimModel(model) });

    getModels = async() => await this.requests.getJsonData('Models');

    training = async (model: any) => await this.requests.postJsonData('Training', { model });

    predict = async (model: any, obj: SelectedFile, xml: SelectedFile, mtl: SelectedFile) => await this.requests.postJsonData('Prediction', { model, obj, xml, mtl });
}