import React from 'react';
import styled from 'styled-components';
import { Tabs } from '@carto/airship';
import { Legend } from '.';

const TabsContainer = styled.section`
    position: absolute;
    top:0;
    left:0;
    z-index: 10000;
    width: 100vw;
    background-color: #ffffff;
`;

const MobileTabs = () => (
    <TabsContainer>
        <Tabs large>
            <Tabs.Panel label="Map"/>
            <Tabs.Panel label="Selector">
                <Legend/>
            </Tabs.Panel>
        </Tabs>
    </TabsContainer>
);

export default MobileTabs;


