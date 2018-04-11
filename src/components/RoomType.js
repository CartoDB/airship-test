import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { DonutChart, Text } from '@carto/airship'
import Widget from './Widget';

const DONUT_COLORS = ['#3AB5F0', '#7E78E2', '#F45171'];

class RoomType extends Component {
  static propTypes = {
    context: PropTypes.shape({
      cartoClient: PropTypes.object,
      cartoLayers: PropTypes.object,
      map: PropTypes.object,
    }),
  }

  state = {
    categories: [],
  }

  constructor(props) {
    super(props);

    const { cartoClient, cartoLayers, map } = props.context;
    const { source } = cartoLayers.listings;

    const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);

    this.dataView = new carto.dataview.Category(source, 'room_type', {
      limit: 10,
      operation: carto.operation.COUNT,
      operationColumn: 'cartodb_id'
    });
    this.dataView.addFilter(bboxFilter);
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

export default RoomType;
