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
    if(prevProps.priceFilter !== this.props.priceFilter || prevProps.bboxFilter !== this.props.bboxFilter) {
      this.fetchData();
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  getQuery() {
    const { min, max } = this.props.priceFilter;
    const [xmin, ymin, xmax, ymax] = this.props.bboxFilter;

    const query = `
      SELECT
        neighbourhood as name,
        count(neighbourhood) as count,
        count(room_type) FILTER (WHERE room_type='Entire home/apt') as entire_homes,
        count(room_type) FILTER (WHERE room_type='Shared room') as shared_rooms,
        count(room_type) FILTER (WHERE room_type='Private room') as private_rooms
      FROM airbnb_listings_filtered
      WHERE price BETWEEN ${min} AND ${max}
      AND ST_Intersects(the_geom, ST_MakeEnvelope(${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326))
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
        <Widget.Description>Description.</Widget.Description>
        {data.length > 0 && (
          <StackedBar
            data={data}
            colors={C.COLORS}
            keys={['entire_homes', 'private_rooms', 'shared_rooms']}
          />
        )}
      </Widget>
    );
  }
}

const mapStateToProps = state => ({
  layers: state.layers,
  priceFilter: state.filters.price,
  bboxFilter: state.filters.bbox,
});

export default connect(mapStateToProps)(TypesPerNeighbourhood);
