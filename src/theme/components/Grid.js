import React from 'react';
import styled from 'styled-components';

const Grid = (attr) => {
    return (
        <GridColumn grid={attr.col} textAlign={attr.textAlign} align={attr.align}>{attr.children}</GridColumn>
    );
}

export default Grid;

const GridColumn = styled.div`
    display:block;
    float:${props=> props.align};
    text-align:${props=> props.textAlign};
    width:${props=> props.grid + 0 +'%'};
    margin-left: 10px;
    margin-right: 10px;
`;