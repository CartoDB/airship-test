import React from 'react';
import styled from 'styled-components';
import { ReviewScores, AveragePrice, RoomType, Neighbourhoods, TypesPerNeighbourhood } from './index';

const Widgets = styled.section`
  width: 280px;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

export default () => (
  <Widgets>
    <RoomType />
    <AveragePrice />
    <TypesPerNeighbourhood />
    <Neighbourhoods />
    <ReviewScores />
  </Widgets>
);
