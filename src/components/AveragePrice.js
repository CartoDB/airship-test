import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { Display, Range, Text } from '@carto/airship'
import Widget from './Widget';
import { C } from '../constants';
import { formatPrice, debounce } from '../utils';

const QUERY = 'SELECT min(price), max(price) FROM airbnb_listings_filtered WHERE price < 800';

class AveragePrice extends Component {
  static propTypes = {
    context: PropTypes.shape({
      cartoClient: PropTypes.object,
      map: PropTypes.object,
      cartoLayers: PropTypes.object,
    }),
  }

  state = {
    result: 0,
  }

  constructor(props) {
    super(props);

    const { cartoClient, map, cartoLayers } = props.context;
    const { source } = cartoLayers.listings;

    const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);

    this.originalQuery = source.getQuery();
    this.dataView = new carto.dataview.Formula(source, 'price', { operation: carto.operation.AVG });
    this.dataView.addFilter(bboxFilter);
    this.dataView.on('dataChanged', this.onDataChanged);

    cartoClient.addDataview(this.dataView);
  }

  componentWillMount() {
    fetch(`${C.SQL_API_URL}${QUERY}`)
      .then(res => res.json())
      .then(data => {
        const { min, max } = data.rows[0];
        this.setState({ min, max })
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount() {
    this.dataView.off('dataChanged');
  }

  onDataChanged = (data) => {
    this.setState(data);
  }

  onRangeChanged = ({ min, max }) => {
    const { source } = this.props.context.cartoLayers.listings;
    const newQuery = `${this.originalQuery} AND price BETWEEN ${min} AND ${max}`;

    source.setQuery(newQuery);
  }

  render() {
    const { min, max } = this.state;

    return (
      <Widget>
        <Widget.Title>Average Price</Widget.Title>
        <Widget.Description>Average renting price per night</Widget.Description>

        <Display>{formatPrice(this.state.result)}</Display>

        {(min || max) && (
          <React.Fragment>
            <Text margin="0 0 0.5rem">Filer by price:</Text>
            <Range
              draggable
              value={{ min, max }}
              minValue={min}
              maxValue={max}
              onChange={debounce(this.onRangeChanged)}
              formatLabel={(value) => `${value} €`}
            />
          </React.Fragment>
        )}
        <br/>
      </Widget>
    );
  }
}

export default AveragePrice;
