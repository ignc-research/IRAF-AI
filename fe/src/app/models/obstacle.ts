import { Parameters } from 'src/app/models/parameters';

export type ObstacleDefinition = {
  name: string;
  urdf: string;
  urdfs?: string[];
  movable: boolean;
  params: Parameters;
}

export const getObstacleUrl = (obstacleDef: ObstacleDefinition) => {
    if (obstacleDef.params) {
        var queryString = Object.keys(obstacleDef.params).map(key => key + '=' + obstacleDef.params[key].value).join('&');
        return `/obstacle/${obstacleDef.name}/${obstacleDef.urdf}?${queryString}`;
    }
    else {
        return `/obstacle/${obstacleDef.name}/${obstacleDef?.urdf}`;
    }
}