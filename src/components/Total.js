import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { Display } from '@carto/airship'
import Widget from './Widget';

class Total extends Component {
  static propTypes = {
    context: PropTypes.shape({
      cartoClient: PropTypes.object,
      cartoLayers: PropTypes.object,
    }),
  }

  state = {
    result: 0,
  }

  constructor(props) {
    super(props);

    const { cartoClient, cartoLayers } = props.context;
    const { source } = cartoLayers.listings;

    this.dataView = new carto.dataview.Formula(source, 'cartodb_id', {
      operation: carto.operation.COUNT
    });

    this.dataView.on('dataChanged', this.onDataChanged);

    cartoClient.addDataview(this.dataView);
  }

  componentWillUnmount() {
    this.dataView.off('dataChanged');
  }

  onDataChanged = (data) => {
    this.setState(data);
  }

  render() {
    const { result } = this.state;

    return (
      <Widget>
        <Widget.Title>Total listings</Widget.Title>
        <Widget.Description>Includes entire homes/apartments, private or shared rooms.</Widget.Description>
        <Display>{result.toLocaleString('es-ES')}</Display>
      </Widget>
    );
  }
}

export default Total;
