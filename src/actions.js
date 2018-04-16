export const STORE_LAYERS = '@Layers/STORE';
export const storeLayers = layers => ({
  type: STORE_LAYERS,
  layers,
});

export const SET_MAP = '@Map/SET';
export const setMap = map => ({
  type: SET_MAP,
  map,
});

export const SET_PRICE = '@Filters/SET_PRICE';
export const setPriceFilter = filter => ({
  type: SET_PRICE,
  filter,
});

export const SET_BBOX = '@Filters/SET_BBOX';
export const setBboxFilter = bbox => ({
  type: SET_BBOX,
  bbox,
});

export const TOGGLE_LAYER = '@Layers/TOGGLE';
export const toggleLayer = name => ({
  type: TOGGLE_LAYER,
  name,
});
