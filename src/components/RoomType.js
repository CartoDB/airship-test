import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { DonutChart } from '@carto/airship'
import Widget from './Widget';
import { C } from '../constants';

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

        {categories.length > 0 && (
          <DonutChart
            data={categories}
            colors={this.props.hasCustomTheme ? C.COLORS.NIGHT : C.COLORS.DEFAULT}
          />
        )}
      </Widget>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client,
  map: state.map,
  layers: state.layers,
  hasCustomTheme: !!state.theme,
});

export default connect(mapStateToProps)(RoomType);
