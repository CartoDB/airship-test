import React from 'react';
import { Legend, Collapsible, Subheader, Toggle, Text } from '@carto/airship';
import { LayersContext } from '../store';

const CustomLegend = Legend.extend`
  position: absolute;
  z-index: 1000;
  top: 16px;
  left: 16px;
`;

export default (props) => (
  <LayersContext.Consumer>
    {({ cartoLayers, setVisibility }) => (
      cartoLayers && (
        <CustomLegend>
          <Legend.Panel>
            <Collapsible>
              <Collapsible.Header>
                <Subheader>Layer selector</Subheader>
              </Collapsible.Header>
              <Collapsible.Content>
                {Object.keys(cartoLayers).map(layerName => (
                  <Toggle
                    key={layerName}
                    htmlFor={layerName}
                    checked={cartoLayers[layerName].visible}
                    onChange={() => setVisibility(layerName)}
                  >
                    <Text>{cartoLayers[layerName].name || layerName}</Text>
                  </Toggle>
                ))}
              </Collapsible.Content>
            </Collapsible>
          </Legend.Panel>
        </CustomLegend>
      )
    )}
  </LayersContext.Consumer>
);
