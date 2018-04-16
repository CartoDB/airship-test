import React from 'react';
import { connect } from 'react-redux';
import { toggleLayer } from '../actions';
import { Legend, Collapsible, Subheader, Toggle, Text } from '@carto/airship';

const CustomLegend = Legend.extend`
  position: absolute;
  z-index: 1000;
  top: 16px;
  left: 16px;
`;

const LegendContainer = ({ layers, toggleLayer }) => (
  <CustomLegend>
    <Legend.Panel>
      <Collapsible>
        <Collapsible.Header>
          <Subheader>Layer selector</Subheader>
        </Collapsible.Header>
        <Collapsible.Content>
          {Object.keys(layers).map(layerName => (
            <Toggle
              key={layerName}
              htmlFor={layerName}
              checked={layers[layerName].visible}
              onChange={() => toggleLayer(layerName)}
            >
              <Text>{layers[layerName].name || layerName}</Text>
            </Toggle>
          ))}
        </Collapsible.Content>
      </Collapsible>
    </Legend.Panel>
  </CustomLegend>
);

const mapStateToProps = state => ({
  layers: state.layers,
});

const mapDispatchToProps = dispatch => ({
  toggleLayer: name => dispatch(toggleLayer(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LegendContainer);
