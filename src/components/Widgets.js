import React from 'react';
import styled from 'styled-components';
import { LayersContext } from '../store';
import { ReviewScores, AveragePrice, RoomType, Neighbourhoods, TypesPerNeighbourhood } from './index';

const Widgets = styled.section`
  width: 280px;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

export default (props) => (
  <LayersContext.Consumer>
    {(context) => (
      context.cartoLayers &&
      <Widgets>
        <RoomType context={context} />
        <AveragePrice context={context} />
        <TypesPerNeighbourhood context={context} />
        <Neighbourhoods context={context} />
        <ReviewScores context={context} />
      </Widgets>
    )}
  </LayersContext.Consumer>
);
