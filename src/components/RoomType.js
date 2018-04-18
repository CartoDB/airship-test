import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { DonutChart, Text } from '@carto/airship'
import Widget from './Widget';

const DONUT_COLORS = ['#3AB5F0', '#7E78E2', '#F45171'];

class RoomType extends Component {
  static propTypes = {
    client: PropTypes.object,
    layers: PropTypes.object,
    map: PropTypes.object,
  }

  state = {
    categories: [],
  }

  constructor(props) {
    super(props);

    const { client, layers, map } = props;
    const { source } = layers.listings;

    const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);

    this.dataView = new carto.dataview.Category(source, 'room_type', {
      limit: 10,
      operation: carto.operation.COUNT,
    });
    this.dataView.addFilter(bboxFilter);
    this.dataView.on('dataChanged', this.onDataChanged);

    client.addDataview(this.dataView);
  }

  componentWillUnmount() {
    this.dataView.off('dataChanged');
  }

  onDataChanged = (data) => {
    this.setState(data);
  }

  render() {
    const { categories } = this.state;

    return (
      <Widget>
        <Widget.Title>Room Type</Widget.Title>
        <Widget.Description>Airbnb hosts can list entire homes/apartments, private or shared rooms.</Widget.Description>
        <Text margin="0 0 2rem" color="#747474">Depending on the room type, availability, and activity, an airbnb listing could be more like a hotel, disruptive for neighbours, taking away housing, and illegal.</Text>

        {categories.length > 0 && (
          <DonutChart data={categories} colors={DONUT_COLORS} />
        )}
      </Widget>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client,
  map: state.map,
  layers: state.layers,
});

export default connect(mapStateToProps)(RoomType);
