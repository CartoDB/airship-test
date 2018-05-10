import carto from '@carto/carto.js';
import * as actions from './actions';
import { C } from './constants';
import { THEME } from './constants'

export const theme = (state = null, action) => {
  switch (action.type) {
    case actions.TOGGLE_THEME:
      return action.active ? THEME : null;

    default:
      return state;
  }
}

const cartoClient = new carto.Client(C.CLIENT);
export const client = (state = cartoClient, action) => state;

export const map = (state = false, action) => {
  switch (action.type) {
    case actions.SET_MAP:
      return action.map;

    default:
      return state;
  }
}

export const layers = (state = {}, action) => {
  switch (action.type) {
    case actions.STORE_LAYERS:
      return action.layers;

    case actions.TOGGLE_LAYER: {
      const layer = state[action.name];

      layer.visible ? layer.layer.hide() : layer.layer.show();

      return {
        ...state,
        [action.name]: {
          ...layer,
          visible: !layer.visible
        }
      }
    }

    default:
      return state;
  }
}

const FILTERS_INITIAL_STATE = {
  price: false,
  bbox: false,
  neighbourhoods: false,
}
export const filters = (state = FILTERS_INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SET_PRICE: {
      const { min, max } = action.filter;

      return {
        ...state,
        price: `price BETWEEN ${min} AND ${max}`,
      };
    }

    case actions.SET_BBOX: {
      console.log(action.neighbourhoods)
      const [ xmin, ymin, xmax, ymax ] = action.bbox;

      return {
        ...state,
        bbox: `ST_Intersects(the_geom_webmercator, ST_Transform(ST_MakeEnvelope(${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326), 3857))`,
      };
    }

    case actions.SET_NEIGHBOURHOODS: {
      const neighbourhoods = action.neighbourhoods.map(name => `'${name}'`).join(',');

      if (neighbourhoods.length === 0) return {
        ...state,
        neighbourhoods: false,
      };

      return {
        ...state,
        neighbourhoods: `neighbourhood IN (${neighbourhoods})`,
      };
    }

    default:
      return state;
  }
}
