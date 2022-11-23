import { AppSettings } from "../AppSettings";
import xml2js from "xml2js";
import { ToastHelper } from '../ToastHelper';

export class ConfigHelper {
    static mergeConfigs(poses, newConfig) {
        for (let i = 0; i < poses.length; i++) {
            const baseEntry = poses[i];
            const matchedEntry = newConfig.find(x => x.name == baseEntry.name);
            if (!matchedEntry) {
                throw `Configs do not match. Could not find ${baseEntry.name}`;
            }

            for (let j = 0; j < baseEntry.points.length; j++) {
                baseEntry.points[j].frames.push(matchedEntry.points[j].frames[0]);
            }

        }
        return poses;
    }

    static parseVek(vek) {
        return {
            x: (+vek.X) * AppSettings.scaleFactor,
            y: (+vek.Y) * AppSettings.scaleFactor,
            z: (+vek.Z) * AppSettings.scaleFactor,
        }
    }

    static mapConfig(layerName, config) {
        const naht = config["FRAME-DUMP"].SNaht;
        return naht.map(x => {
            return {
                name: x.$.Name,
                wkzName: x.$.WkzName,
                points: x.Kontur[0].Punkt.map((y, i) => {
                    const matchedFrame = x.Frames[0].Frame[i];
                    return {
                        position: this.parseVek(y.$),
                        frames: [
                            {
                                name: layerName,
                                position: this.parseVek(matchedFrame.Pos[0].$),
                                rotation: {
                                    xVec: this.parseVek(matchedFrame.XVek[0].$),
                                    yVec: this.parseVek(matchedFrame.YVek[0].$),
                                    zVec: this.parseVek(matchedFrame.ZVek[0].$),
                                }
                            }
                        ]
                    }
                })
            }
        });
    }

    static parseConfig(name, xmlConfig, poses) {
        const parsedConfig = this.mapConfig(name, xmlConfig);
        if (!poses || poses.length < 1) {
            return parsedConfig;
        }
        else if (JSON.stringify(parsedConfig) == JSON.stringify(poses)) {
            throw "Config already imported!";
        }
        else {
            return this.mergeConfigs(poses, parsedConfig);
        }
    }

    static getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    static async addLayer(xmlString, groupName, layerName, type, existingWelds, existingLayers, model=undefined) {
        const id = crypto.randomUUID();
        const color = this.getRandomColor();
        const xml = await xml2js.parseStringPromise(xmlString);

        const newLayers= {...existingLayers};
        newLayers[id] = { color: color, groupName, layerName, type, xml: { file: xmlString, name: layerName }, model };
        return { welds: ConfigHelper.parseConfig(id, xml, existingWelds), layers: newLayers }
    }

    static async addLayers(prediction, model, existingWelds, existingLayers) {
        let newLayers = {...existingLayers};
        let newWelds = [...existingWelds];

        for (let i = 0; i < prediction.layers.length; i++) {
            const addResult = await ConfigHelper.addLayer(prediction.layers[i].xml, prediction.name, prediction.layers[i].name, model.name, newWelds, newLayers, model);
            newLayers = addResult.layers;
            newWelds = addResult.welds;
        }

        return { welds: newWelds, layers: newLayers };
    }

    static removeConfig(name, welds, configs) {

        const newConfigs = {...configs};
        delete newConfigs[name];

        const newWelds = Object.keys(newConfigs).length > 0 ? [...welds] : [];
        newWelds.forEach(x => {
            for (let i = x.points.length - 1; i >= 0; i--) {
                const findEl = x.points[i].frames.find(y => y.name == name);
                x.points[i].frames.splice(x.points[i].frames.indexOf(findEl), 1);
            }
        });
        return { welds: newWelds, configs: newConfigs }
    }

    static getValueError(gt, pr) {
        const threshold = .0000001;
        if (Math.abs(gt) < threshold)
            gt = 0;
        if (Math.abs(pr) < threshold)
            pr = 0
        const val = (pr / gt) - 1;
        return !isFinite(val) || isNaN(val) ? 0 : Math.abs(val);
    }

    static getVectorError(gtValue, predictValue) {
        return [this.getValueError(gtValue.x, predictValue.x), this.getValueError(gtValue.y, predictValue.y), this.getValueError(gtValue.z, predictValue.z)];
    }

    static getAvgErrorsForConfig(welds, configs, config) {
        const groundTruth = Object.keys(configs).find(x => configs[x].type == "GroundTruth");
        const errors = []
        welds.forEach(x => {
            x.points.forEach(y => {
                const gt = y.frames.find(z => z.name == groundTruth);
                const configVal = y.frames.find(z => z.name == config);
                const avg = [];
                avg.push(...this.getVectorError(gt.position, configVal.position));
                avg.push(...this.getVectorError(gt.rotation.xVec, configVal.rotation.xVec));
                avg.push(...this.getVectorError(gt.rotation.yVec, configVal.rotation.yVec));
                avg.push(...this.getVectorError(gt.rotation.zVec, configVal.rotation.zVec));
                const error = (avg.reduce((a, b) => a + b, 0) / avg.length) * 100;
                errors.push(error);
            });
        })
        return errors;
    }

    static getEval(welds, configs) {

        return Object.keys(configs).map(x => {
            const config = configs[x];
            const duration = configs[x].model?.prediction_duration ?? 0;
            const errors = this.getAvgErrorsForConfig(welds, configs, x);
            // const error = configs[x].type == "GroundTruth" ? 0 : Math.random() * 30;
            return { config, duration, errors };
        });
    }

}