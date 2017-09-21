import React, { Component } from 'react';
// import { environment } from '#store/environment';
import { observer } from 'mobx-react';
import { mappingState } from './state';
import { VictoryAxis } from 'victory';
import range from 'lodash/range';
import { white } from '!!sass-variables-loader!#styles/variables.scss';

const style = {
    axis: {stroke: null},
    axisLabel: {},
    grid: {stroke: (t) => t > 0.5 ? 'red' : 'grey'},
    ticks: {stroke: white, size: 0},
    tickLabels: {fontSize: 10, padding: 2, fontFamily: 'Hack Bold', fill: white},
};

function tickFormat(t) {
    const h = Math.abs(t).toString(16).toUpperCase();
    return t < 0 ? `-0x${h}` : `0x${h}`;
}

@observer
export class Axes extends Component {

    render() {

        const { scale, x, y } = mappingState;

        const domain = 600 / scale / 2;

        return <g>
            <VictoryAxis
                width={600}
                height={600}
                domain={[-domain - (x/scale), domain - (x/scale)]}
                offsetY={600}
                padding={{left: 0, right: 0}}
                orientation="top"
                style={style}
                standalone={true}
                tickFormat={tickFormat}
            />
            <VictoryAxis
                width={600}
                height={600}
                domain={[domain - (y/scale), -domain - (y/scale)]}
                offsetX={600}
                padding={{left: 0, right: 0}}
                orientation="right"
                style={style}
                standalone={true}
                tickFormat={tickFormat}
            />
        </g>;
    }

}
