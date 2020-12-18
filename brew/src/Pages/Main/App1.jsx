import React, { useCallback, useEffect, useMemo, useState, } from 'react';

import './app.less';
import './main.less';
import {
  ChartComponent,
  DateTime,
  Inject,
  Legend,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
  Crosshair,
  AreaSeries,
  Zoom
} from '@syncfusion/ej2-react-charts';
import { Browser } from '@syncfusion/ej2-base';

export let data1 = [
  { x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
  { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
  { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
  { x: new Date(2011, 0, 1), y: 70 }
];
export let data2 = [
  { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
  { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
  { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, {
    x: new Date(2011, 0, 1),
    y: 84
  }
];
const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
    }
        .charts {
            align :center
        }`;

const App = () => {
  const [fileInfo, setFileInfo] = useState([]);
  const [data, setData] = useState([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const result = [];
    const tempResult = {};
    console.log('fileInfo', fileInfo);
    for (const dateSlice of fileInfo) {
      for (const serviceCount of dateSlice.services) {
        if (!tempResult[serviceCount.name]) {
          tempResult[serviceCount.name] = [];
        }
        // tempResult[serviceCount.name].push([dateSlice.date, serviceCount.count]);
        tempResult[serviceCount.name].push({x: new Date(dateSlice._createdOn), y: serviceCount.count});
      }
    }

    for (const service of Object.keys(tempResult)) {
      result.push({
        label: service,
        data: tempResult[service],
      });
    }
    setData(result);
    console.log(data1);
    console.log(result);

    const linesMap = result.map(obj => (
      <SeriesDirective dataSource={obj.data} xName='x' yName='y' name={obj.label} dashArray='5'
                       width={2} marker={{ visible: true, width: 10, height: 10 }} type='Line'
      />
    ));
    setLines(linesMap);
  }, [fileInfo]);

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      setFileInfo(JSON.parse(event.target.result));
    };
  };

  const onChartLoad = () => {
    let chart = document.getElementById('charts');
    chart.setAttribute('title', '');
  }
  return (
    <div
      className="App"
    >
      <style>
        {SAMPLE_CSS}
      </style>
      <input type="file" onChange={handleChange} />
      {data.length > 0 && (
        <div className='control-section'>
          <ChartComponent id='charts' style={{ textAlign: "center" }}
                          primaryXAxis={{
                            valueType: 'DateTime',
                            labelFormat: 'm',
                            intervalType: 'Minutes',
                            edgeLabelPlacement: 'Shift',
                            // majorGridLines: { width: 0 },
                            enableAutoIntervalOnZooming: true
                          }}
                          primaryYAxis={{
                            labelFormat: '{value}',
                            rangePadding: 'None',
                            minimum: 0,
                            lineStyle: { width: 0 },
                            majorTickLines: { width: 0 },
                            minorTickLines: { width: 0 }
                          }}
                          chartArea={{ border: { width: 0 } }}
                          width={Browser.isDevice ? '100%' : '80%'}
                          loaded={onChartLoad}
                          tooltip={{ enable: true, shared: true }}
                          crosshair={{
                            enable: true,
                            line: {
                              color: 'rgba(204,214,235,0.25)',
                              width: Browser.isDevice ? 50 : 20,
                            },
                            lineType: 'Vertical'
                          }}
                          zoomSettings={{
                            enableMouseWheelZooming: true,
                            enablePinchZooming: true,
                            enableSelectionZooming: true
                          }}
          >
            <Inject services={[LineSeries, DateTime, Legend, Tooltip, Crosshair, Zoom]} />
            <SeriesCollectionDirective>
{/*              <SeriesDirective dataSource={data[0].data} xName='x' yName='y' name='First' dashArray='5'
                               width={2} marker={{ visible: true, width: 10, height: 10 }} type='Line'
              />
              <SeriesDirective dataSource={data[1].data} xName='x' yName='y' name='Second' dashArray='5'
                               width={2} marker={{ visible: true, width: 10, height: 10 }} type='Line'
              />*/}
              {/*<SeriesDirective dataSource={data2} xName='x' yName='y' name='Apple'*/}
              {/*                 width={2} marker={{ visible: true, width: 10, height: 10, shape: 'Diamond' }} dashArray='10' type='Line'*/}
              {/*/>*/}
              {lines}
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>

      )}
    </div>
  );
};

export default App;
