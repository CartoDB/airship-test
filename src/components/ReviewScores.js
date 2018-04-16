import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { Histogram } from '@carto/airship';
import Widget from './Widget';

class ReviewScores extends Component {
  static propTypes = {
    client: PropTypes.object,
    layers: PropTypes.object,
    map: PropTypes.object,
  }

  state = {
    data: [],
  }

  constructor(props) {
    super(props);

    const { client, layers, map } = props;
    const { source } = layers.listings;

    const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);

    this.dataView = new carto.dataview.Histogram(source, 'availability_365', {
      bins: 160,
      operation: carto.operation.COUNT
    });
    this.dataView.addFilter(bboxFilter);
    this.dataView.on('dataChanged', this.onDataChanged);

    client.addDataview(this.dataView);
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

const mapStateToProps = state => ({
  client: state.client,
  map: state.map,
  layers: state.layers,
});

export default connect(mapStateToProps)(ReviewScores);
