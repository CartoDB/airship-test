import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { Display, Range, Text } from '@carto/airship'
import Widget from './Widget';
import { C } from '../constants';
import { setPriceFilter } from '../actions';
import { formatPrice, debounce } from '../utils';

const QUERY = `
  SELECT
    min(price),
    max(price)
  FROM airbnb_listings_filtered
`;

class AveragePrice extends Component {
  static propTypes = {
    client: PropTypes.object,
    layers: PropTypes.object,
    map: PropTypes.object,
  }

  state = {
    result: 0,
  }

  constructor(props) {
    super(props);

    const { client, map, layers } = props;
    const { source } = layers.listings;

    const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);

    this.originalQuery = source.getQuery();
    this.dataView = new carto.dataview.Formula(source, 'price', { operation: carto.operation.AVG });
    this.dataView.addFilter(bboxFilter);
    this.dataView.on('dataChanged', this.onDataChanged);

    client.addDataview(this.dataView);
  }

  componentWillMount() {
    fetch(`${C.SQL_API_URL}${QUERY.trim()}`)
      .then(res => res.json())
      .then(data => {
        const { min, max } = data.rows[0];
        this.setState({ range: { min, max } })
        this.props.setPriceFilter({ min, max });
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
    const { source } = this.props.layers.listings;
    const newQuery = `${this.originalQuery} AND price BETWEEN ${min} AND ${max}`;

    source.setQuery(newQuery);
    this.props.setPriceFilter({ min, max })
  }

  render() {
    const { range } = this.state;
    const { min, max } = this.props.priceFilter;

    return (
      <Widget>
        <Widget.Title>Average Price in Madrid</Widget.Title>
        <Widget.Description>Average renting price per night</Widget.Description>

        <Display>{formatPrice(this.state.result)}</Display>

        {(min || max) && (
          <React.Fragment>
            <Text margin="0 0 0.5rem">Filer by price:</Text>
            <Range
              draggable
              value={{ min, max }}
              minValue={range.min}
              maxValue={range.max}
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

const mapStateToProps = state => ({
  client: state.client,
  map: state.map,
  layers: state.layers,
  priceFilter: state.filters.price,
});

const mapDispatchToProps = dispatch => ({
  setPriceFilter: filter => dispatch(setPriceFilter(filter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AveragePrice);
