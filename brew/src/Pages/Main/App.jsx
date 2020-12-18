import React, { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import CanvasJSReact from '../../assets/canvasjs.react';

import './app.less';
import './main.less';
import Chart from "./Chart";

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const App = () => {
  const [fileInfo, setFileInfo] = useState([]);
  const [chart, setChart] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [workspaces, setWorkspaces] = useState({});
  const [employees, setEmployees] = useState({});

  const [renderedWorkspaces, setRenderWorkspaces] = useState([]);
  const [renderedEmployees, setRenderEmployees] = useState([]);

  useEffect(() => {
    const resultServices = [];
    const resultWorkspaces = [];
    const resultEmployees = [];

    let tempResultServices = {};
    let tempResultWorkspaces = {};
    let tempResultEmployees = {};

    const tempResultWorkspacesTotal = {};
    const tempResultEmployeesTotal = {};

    for (const dateSlice of fileInfo) {
      if (dateSlice.services) {
        for (const service of dateSlice.services) {
          if (service.count > 0) {
            if (!tempResultServices[service.name]) {
              tempResultServices[service.name] = [];
            }
            tempResultServices[service.name].push({
              x: new Date(dateSlice._createdOn),
              y: service.count
            });
          }
        }
      }

      if (dateSlice.workspaces) {
        for (const workspace of dateSlice.workspaces) {
          if (tempResultWorkspacesTotal[workspace._wsId]) tempResultWorkspacesTotal[workspace._wsId] += workspace.count;
          else tempResultWorkspacesTotal[workspace._wsId] = workspace.count;
        }
        for (const workspace of dateSlice.workspaces) {

          if (workspace.count > 0) {

            if (!tempResultWorkspaces[workspace._wsId]) {
              tempResultWorkspaces[workspace._wsId] = [];
            }
            tempResultWorkspaces[workspace._wsId].push({
              x: new Date(dateSlice._createdOn),
              y: workspace.count
            });
          }
        }
      }

      if (dateSlice.employees) {
        for (const employee of dateSlice.employees) {
          if (tempResultEmployeesTotal[employee.employeeId]) tempResultEmployeesTotal[employee.employeeId] += employee.count;
          else tempResultEmployeesTotal[employee.employeeId] = employee.count;
        }
        for (const employee of dateSlice.employees) {
          if (employee.count > 0) {
            if (!tempResultEmployees[employee.employeeId]) {
              tempResultEmployees[employee.employeeId] = [];
            }
            tempResultEmployees[employee.employeeId].push({
              x: new Date(dateSlice._createdOn),
              y: employee.count
            });
          }
        }
      }
    }

    for (const service of Object.keys(tempResultServices)) {
      resultServices.push({
        label: service,
        data: tempResultServices[service],
      });
    }

    for (const workspace of Object.keys(tempResultWorkspaces)) {
      resultWorkspaces.push({
        label: workspace,
        data: tempResultWorkspaces[workspace],
      });
    }

    for (const employee of Object.keys(tempResultEmployees)) {
      resultEmployees.push({
        label: employee,
        data: tempResultEmployees[employee],
      });
    }

    const sortableEmployees = Object.fromEntries(
      Object.entries(tempResultEmployeesTotal).sort(([, a], [, b]) => b - a)
    );
    const sortableWorkspaces = Object.fromEntries(
      Object.entries(tempResultWorkspacesTotal).sort(([, a], [, b]) => b - a)
    );
    setEmployees(sortableEmployees);
    setWorkspaces(sortableWorkspaces);

    // setChartServicesData(resultServices);
    // setChartWorkspacesData(resultWorkspaces);
    // setChartEmployeesData(resultEmployees);
    setChartData([
      {
        label: 'services', data: resultServices
      },
      { label: 'workspaces', data: resultWorkspaces },
      { label: 'employees / bots', data: resultEmployees }
    ]);
  }, [fileInfo]);

  useEffect(() => {
    setChart(chartData.map(({ label, data }) =>
      (data.length > 0 ? <Chart key={label} data={data} title={label} /> : null)
    ));
  }, [chartData])

  useEffect(() => {
    const rendered = [];
    for (const employee of Object.keys(employees)) {
      rendered.push(<div key={employee} className="tableCell">
        <div className="tableCell__id">{employee}</div>
        <div className="tableCell__count">{employees[employee]}</div>
      </div>)
    }
    console.log(employees)
    setRenderEmployees(rendered);
  }, [employees]);

  useEffect(() => {
    const rendered = [];
    for (const workspace of Object.keys(workspaces)) {
      rendered.push(<div key={workspace} className="tableCell">
        <div className="tableCell__id">{workspace}</div>
        <div className="tableCell__count">{workspaces[workspace]}</div>
      </div>)
    }

    // setRenderWorkspaces(rendered);
  }, [workspaces]);

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      setFileInfo(JSON.parse(event.target.result));
    };
  };

  const rowSizes = new Array(1000)
    .fill(true)
    .map(() => 25 + Math.round(Math.random() * 50));

  const getItemSize = index => rowSizes[index];

  const RowEmployees = ({ index, style }) => (
    <div className="tableCell" style={style}>
      <div className="tableCell__id">{Object.keys(employees)[index]}</div>
      <div className="tableCell__count">{employees[Object.keys(employees)[index]]}</div>
    </div>
  );
  const RowWorkspaces = ({ index, style }) => (
    <div className="tableCell" style={style}>
      <div className="tableCell__id">{Object.keys(workspaces)[index]}</div>
      <div className="tableCell__count">{workspaces[Object.keys(workspaces)[index]]}</div>
    </div>
  );

  return (
    <div
      className="App"
    >
      <input type="file" onChange={handleChange} />
      {chart.length > 0 && chart}
      <div className="App__tables">
        {Object.keys(employees).length > 0 && (
          <div className="App__tables__table">
            <div>Employees / bots</div>
            <List
              height={150}
              itemCount={Object.keys(employees).length}
              itemSize={35}
              width={300}
              className={'List'}
            >
              {RowEmployees}
            </List>
          </div>
        )}
        {Object.keys(workspaces).length > 0 && (
          <div className="App__tables__table">
            <div>Workspaces</div>
            <List
              height={150}
              itemCount={Object.keys(workspaces).length}
              itemSize={35}
              width={300}
              className={'List'}
            >
              {RowWorkspaces}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
