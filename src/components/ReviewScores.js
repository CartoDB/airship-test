import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { Histogram } from '@carto/airship';
import Widget from './Widget';

class ReviewScores extends Component {
  static propTypes = {
    context: PropTypes.shape({
      cartoClient: PropTypes.object,
      cartoLayers: PropTypes.object,
      map: PropTypes.object,
    }),
  }

  state = {
    data: [],
  }

  constructor(props) {
    super(props);

    const { cartoClient, cartoLayers, map } = props.context;
    const { source } = cartoLayers.listings;

    const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);

    this.dataView = new carto.dataview.Histogram(source, 'availability_365', {
      bins: 160,
      operation: carto.operation.COUNT
    });
    this.dataView.addFilter(bboxFilter);
    this.dataView.on('dataChanged', this.onDataChanged);

    cartoClient.addDataview(this.dataView);
  }

  componentWillUnmount() {
    this.dataView.off('dataChanged');
  }

  onDataChanged = (data) => {
    this.setState({
      data: data.bins.map(bin => ({ name: bin.bin.toString(), value: bin.freq || 0 }))
    });
  }

  render() {
    return (
      <Widget>
        <Widget.Title>Availability</Widget.Title>
        <Widget.Description>
          Entire homes or apartments highly available year-round for tourists, probably don't have the owner present, could be illegal, and more importantly, are displacing residents.
        </Widget.Description>

        <Histogram data={this.state.data} />
      </Widget>
    );
  }
}

export default ReviewScores;
