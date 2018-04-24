import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StackedBar } from '@carto/airship'
import Widget from './Widget';
import { C } from '../constants';

class TypesPerNeighbourhood extends Component {
  static propTypes = {
    client: PropTypes.object,
    layers: PropTypes.object,
    map: PropTypes.object,
  }

  state = {
    data: [],
  }

  componentDidUpdate(prevProps) {
    if(prevProps.filters !== this.props.filters) {
      this.fetchData();
      this.updateLayer();
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  updateLayer() {
    const { bbox, ...others } = this.props.filters;
    const { source, query } = this.props.layers.listings;

    const filters = Object.values(others).filter(filter => !!filter);

    const newQuery = filters.length === 0
      ? query
      : `${query} AND ${filters.join(' AND ')}`;

    source.setQuery(newQuery);
  }

  getFilters() {
    const filters = Object.values(this.props.filters).filter(filter => !!filter);

    if (!filters.length) return '';

    return `AND ${filters.join(' AND ')}`;
  }

  getQuery() {
    const query = `
      SELECT
        neighbourhood as name,
        count(room_type) FILTER (WHERE room_type='Entire home/apt') as entire_homes,
        count(room_type) FILTER (WHERE room_type='Shared room') as shared_rooms,
        count(room_type) FILTER (WHERE room_type='Private room') as private_rooms
      FROM airbnb_listings_filtered
      WHERE availability_365 > 0
      ${this.getFilters()}
      GROUP BY neighbourhood
    `;

    return query.trim();
  }

  fetchData() {
    fetch(`${C.SQL_API_URL}${this.getQuery()}`)
      .then(res => res.json())
      .then(data => this.setState({ data: data.rows }))
      .catch(error => console.log(error));
  }

  render() {
    const { data } = this.state;

    return (
      <Widget>
        <Widget.Title>Room types per neighbourhood</Widget.Title>
        {data.length > 0 && (
          <StackedBar
            data={data}
            colors={this.props.hasCustomTheme ? C.COLORS.NIGHT : C.COLORS.DEFAULT}
            keys={['entire_homes', 'private_rooms', 'shared_rooms']}
          />
        )}
      </Widget>
    );
  }
}

const mapStateToProps = state => ({
  layers: state.layers,
  filters: state.filters,
  hasCustomTheme: !!state.theme,
});

export default connect(mapStateToProps)(TypesPerNeighbourhood);
