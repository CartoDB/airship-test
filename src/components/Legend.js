import React from 'react';
import { connect } from 'react-redux';
import { toggleLayer, toggleTheme } from '../actions';
import { Legend, Collapsible, Subheader, Toggle, Text } from '@carto/airship';

const CustomLegend = Legend.extend`
  position: absolute;
  z-index: 1000;
  top: 16px;
  left: 16px;
  @media(max-width: 600px){
    position: relative;
    height: calc(100vh - 40px);
    width: 100vw;
    top: 0px;
    left: 0px;
  }
`;

const LegendContainer = ({ layers, toggleLayer, hasCustomTheme, toggleTheme }) => (
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

      <Subheader margin="1rem 0 0">Theme selector</Subheader>
      <Toggle
        htmlFor="dark-mode"
        checked={hasCustomTheme}
        onChange={() => toggleTheme(!hasCustomTheme)}
      >
        <Text>Night Mode</Text>
      </Toggle>
    </Legend.Panel>
  </CustomLegend>
);

const mapStateToProps = state => ({
  layers: state.layers,
  hasCustomTheme: !!state.theme,
});

const mapDispatchToProps = dispatch => ({
  toggleLayer: name => dispatch(toggleLayer(name)),
  toggleTheme: (active) => dispatch(toggleTheme(active)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LegendContainer);
