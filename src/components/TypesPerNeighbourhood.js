import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { StackedBar } from '@carto/airship'
import Widget from './Widget';
import { C } from '../constants';

const QUERY = `
SELECT
  neighbourhood as name,
  count(neighbourhood) as count,
  count(room_type) FILTER (WHERE room_type='Entire home/apt') as entire_homes,
  count(room_type) FILTER (WHERE room_type='Shared room') as shared_rooms,
  count(room_type) FILTER (WHERE room_type='Private room') as private_rooms
 FROM airbnb_listings_filtered
 GROUP BY neighbourhood
`

class TypesPerNeighbourhood extends Component {
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

  componentWillMount() {
    fetch(`${C.SQL_API_URL}${QUERY}`)
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

export default TypesPerNeighbourhood;
