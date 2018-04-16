import React, { Component } from 'react';
import { render } from 'react-dom';
import L from 'leaflet';
import carto from 'carto.js';
import { connect } from 'react-redux';
import { storeLayers, setMap, setBboxFilter } from './actions';
import { Widgets, Legend, AirbnbPopup } from './components';
import layers from './layers';
import { C } from './constants';
import './index.css';

const { BASEMAP, BASEMAP_LABELS, CENTER, ZOOM } = C.MAP;

class App extends Component {
  componentDidMount() {
    const map = L.map('map', { zoomControl: false, maxZoom: 18 }).setView(CENTER, ZOOM);

    L.tileLayer(BASEMAP).addTo(map);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    this.popup = L.popup({ closeButton: false });

    this.setBbbox(map.getBounds());

    map.on('moveend', event => {
      const boundingBox = event.target.getBounds();
      this.setBbbox(boundingBox);
    });

    this.props.setMap(map);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.map && this.props.map) {
      this.setupLayers();
    }
  }

  setBbbox(bbox) {
    this.props.setBboxFilter([
      bbox.getSouthWest().lng,
      bbox.getSouthWest().lat,
      bbox.getNorthEast().lng,
      bbox.getNorthEast().lat,
    ]);
  }

  setupLayers() {
    const cartoLayers = Object.keys(layers).reduce((all, layerName) => {
      const { source, style, options, ...other} = layers[layerName];

      const cartoSource = new carto.source.SQL(source);
      const cartoStyle = new carto.style.CartoCSS(style);
      const layer = new carto.layer.Layer(cartoSource, cartoStyle, options);

      if(options.featureClickColumns) {
        layer.on('featureClicked', this.openPopup.bind(this));
      }

      this.props.client.addLayer(layer);
      this.props.client.getLeafletLayer().addTo(this.props.map);

      return { ...all, [layerName]: { source: cartoSource, style: cartoStyle, layer, ...other } };
    }, {});

    // Labels need to be added after the layers
    L.tileLayer(BASEMAP_LABELS).addTo(this.props.map);

    this.props.storeLayers(cartoLayers)
  }

  openPopup(featureEvent) {
    this.popup.setContent('');
    this.popup.setLatLng(featureEvent.latLng);

    if (!this.popup.isOpen()) {
      this.popup.openOn(this.props.map);
      render(<AirbnbPopup {...featureEvent.data} />, this.popup._contentNode);
    }
  }

  render() {
    const hasLayers = Object.keys(this.props.layers).length > 0;

    return (
      <main>
        <div id="map" />
        {hasLayers && (
          <React.Fragment>
            <Legend />
            <Widgets />
          </React.Fragment>
        )}
      </main>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client,
  map: state.map,
  layers: state.layers
});

const mapDispatchToProps = dispatch => ({
  storeLayers: layers => dispatch(storeLayers(layers)),
  setMap: map => dispatch(setMap(map)),
  setBboxFilter: bbox => dispatch(setBboxFilter(bbox)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
