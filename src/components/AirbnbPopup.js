import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Text } from '@carto/airship';
import { formatPrice } from '../utils';

const AirbnbPopup = ({ name, neighbourhood, price, room_type, picture_url }) => (
  <Popup image={picture_url}>
    <Text color="#747474">Name</Text>
    <Text margin="0 0 1rem">{name}</Text>

    <Text color="#747474">Room Type</Text>
    <Text margin="0 0 1rem">{room_type}</Text>

    <Text color="#747474">Price</Text>
    <Text margin="0 0 1rem">{formatPrice(price)}</Text>

    <Text color="#747474">Neighbourhood</Text>
    <Text margin="0 0 1rem">{neighbourhood}</Text>
  </Popup>
);

AirbnbPopup.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
};

export default AirbnbPopup;
