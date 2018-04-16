import carto from 'carto.js';
import * as actions from './actions';
import { C } from './constants';


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

const filtersInital = {
  price: { min: 0, max: 0 },
  bbox: [0, 0, 0, 0],
}
export const filters = (state = filtersInital, action) => {
  switch (action.type) {
    case actions.SET_PRICE:
      return {
        ...state,
        price: action.filter,
      };

    case actions.SET_BBOX:
      return {
        ...state,
        bbox: action.bbox,
      };

    default:
      return state;
  }
}
