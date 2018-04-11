import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import L from 'leaflet';
import carto from 'carto.js';
import { Widgets, Legend, AirbnbPopup } from './components';
import { LayersContext } from './store';
import layers from './layers';
import './index.css';

class App extends Component {
  state = {
    basemap: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png',
    basemapLabels: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}.png',
    center: [40.42, -3.7],
    zoom: 14,
    cartoClient: new carto.Client({ apiKey: 'xt6mcTagbA3oWjThAKnAVw', username: 'ruben-carto' })
  }

  componentDidMount() {
    const { basemap, basemapLabels, zoom, center } = this.state;

    const map = L.map('map', { zoomControl: false, maxZoom: 18 }).setView(center, zoom);

    L.tileLayer(basemap).addTo(map);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    this.popup = L.popup({ closeButton: false });

    this.setState({ map }, () => {
      this.setupLayers()

      // Labels need to be added after the layers
      L.tileLayer(basemapLabels).addTo(map);
    });
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

      this.state.cartoClient.addLayer(layer);
      this.state.cartoClient.getLeafletLayer().addTo(this.state.map);

      return { ...all, [layerName]: { source: cartoSource, style: cartoStyle, layer, ...other } };
    }, {});

    this.setState({ cartoLayers })
  }

  setVisibility = (layerName) => {
    const cartoLayer = this.state.cartoLayers[layerName];

    cartoLayer.visible
      ? cartoLayer.layer.hide()
      : cartoLayer.layer.show();

    this.setState(prevState => ({
      cartoLayers: {
        ...prevState.cartoLayers,
        [layerName]: {
          ...cartoLayer,
          visible: !cartoLayer.visible
        }
      }
    }))
  }

  openPopup(featureEvent) {
    this.popup.setContent('');
    this.popup.setLatLng(featureEvent.latLng);

    if (!this.popup.isOpen()) {
      this.popup.openOn(this.state.map);
      ReactDOM.render(<AirbnbPopup {...featureEvent.data} />, this.popup._contentNode);
    }
  }

  render() {
    return (
      <main>
        <div id="map" />
        <LayersContext.Provider value={{ ...this.state, setVisibility: this.setVisibility }}>
          <Legend />
          <Widgets />
        </LayersContext.Provider>
      </main>
    );
  }


}

render(<App />, document.getElementById('root'));
