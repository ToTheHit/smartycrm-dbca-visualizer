import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import CanvasJSReact from '../../assets/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = (props) => {
  const { data, title } = props;

  const [chart, setChart] = useState(null);
  const [chartData, setChartsData] = useState([]);

  useEffect(() => {
    const linesMap = data.map((object) => {
      return {
        xValueType: "dateTime",
        type: "spline",
        showInLegend: true,
        dataPoints: object.data,
        name: object.label
      };
    });
    setChartsData(linesMap);
  }, [data]);

  const toggleDataSeries = (e) => {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }

  const options = {
    title:{
      text: title
    },
    theme: "light2",
    animationEnabled: true,
    zoomEnabled: true,
    axisX: {
      xValueType: "dateTime",
      crosshair: {
        enabled: true,
        snapToDataPoint: true
      }
    },
    axisY: {
      titleFontColor: "#6D78AD",
      lineColor: "#6D78AD",
      labelFontColor: "#6D78AD",
      tickColor: "#6D78AD",
      crosshair: {
        enabled: true,
        snapToDataPoint: true,
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries
    },
    data: chartData
  }

  return (
    <div className={'App--chart'}>
      <CanvasJSChart options={options} onRef={ref => setChart(ref)} />
    </div>
  )
};

Chart.propTypes = {};
Chart.defaultProps = {};
export default Chart;
