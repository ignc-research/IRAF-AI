import { AppSettings } from "../../AppSettings";

export default class Requests {

  static async getJsonData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(`${AppSettings.apiURL}${url}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

    static async postJsonData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(`${AppSettings.apiURL}${url}`, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      // Remove file fields as log requests gets sent frequently
      static getSlimModel = model => {
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

      static log = async (type, model) => await this.postJsonData(type + '/Log', { model: Requests.getSlimModel(model) });

      static getModels = async() => await this.getJsonData('Models');

      static training = async (model) => await this.postJsonData('Training', { model });

      static predict = async (model, obj, xml, mtl) => await this.postJsonData('Prediction', { model, obj, xml, mtl });
}