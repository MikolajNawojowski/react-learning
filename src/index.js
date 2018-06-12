import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Line} from 'react-chartjs-2';
import { CookiesProvider } from 'react-cookie';
var math = require('mathjs');
var randomColor = require('randomcolor'); // import the script

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: '',
      actions: ['0'],
      result: 0,
      showGraph: false,
      graphData: [
        [
          [],
          []
        ]
      ]
    };
  }

  handleClick(i) {
    if(i == '=') {
      this.doCalculation();
    }
    else if (i == 'Clear') {
      this.clearAll();
    }
    else if (i == 'Del') {
      this.deleteLastChar();
    }
    else if (i == 'Graph') {
      if (this.state.showGraph) {
        this.setState({
          showGraph: false
        });
        return;
      }
      else {
        this.showGraph();
      }
    }
    else {
      this.addNewChar(i);
    }
  }

  showGraph() {
    let newDataGraph = this.state.graphData;
    let newActions = this.state.actions;
    let newGenData = this.generateData();
    if(newGenData) {
      console.log(newGenData);
      newDataGraph.push(newGenData);
      newActions.push(this.state.action);
    }
    this.setState({
      graphData: newDataGraph,
      showGraph: this.state.showGraph ? false : true,
      actions: newActions
    });
  }

  generateData() {
    let dataForGraph = [[],[]];
    for (let j = 0; j < 25; j++) {
        let equalision = this.state.action.replace(/x/g, j);
        try {
          dataForGraph[0][j] = j;
          dataForGraph[1][j] = math.eval(equalision);
        }
        catch (error){
          console.log("BAD INPUT " + error);
          return;
        }
    }
    return dataForGraph;
  }

  addNewChar(i) {
    this.setState({
      action: this.state.action + String(i)
    });
  }

  doCalculation() {
    let result;
    try {
      result = math.eval(this.state.action);
    }
    catch (error){
      console.log("BAD INPUT " + error);
    }
    finally {
      this.setState({
        result: result
      });
    }
  }

  deleteLastChar() {
    this.setState({
      action: this.state.action.slice(0, - 1)
    });
  }

  clearAll() {
    this.setState({
      result: 0,
      action: ''
    });
  }

  render() {
    return (
      <div className="calculator">
        <div className="container">
          <div className='display'>
            <Display value={this.state}/>
          </div>
          <div className="buttons">
            <Buttons onClick={(i) => this.handleClick(i)}/>
          </div>
        </div>
        {this.state.showGraph ?
          <Graph values={this.state}/> :
         null}
      </div>
    );
  }
}

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  renderButton(i) {
    return <Button className = 'button'
      value={i}
      onClick={()  => this.props.onClick(i)}
    />;
  }

  renderButtonSpecial(i) {
    return <ButtonSpecial className = 'buttonSpecial'
      value={i}
      onClick={()  => this.props.onClick(i)}
    />;
  }

  renderGraph(i) {
    return <ButtonGraph className = 'buttonGraph'
      value={i}
      onClick={()  => this.props.onClick(i)}
    />;
  }

  renderTryg(i) {
    return <ButtonTryg className = 'buttonTryg'
      value={i}
      onClick={()  => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="calculator-row">
          {this.renderButton(1)}
          {this.renderButton(2)}
          {this.renderButton(3)}
          {this.renderButton('+')}
          {this.renderButton('-')}
          {this.renderButton('sqrt')}
        </div>
        <div className="calculator-row">
          {this.renderButton(4)}
          {this.renderButton(5)}
          {this.renderButton(6)}
          {this.renderButton('*')}
          {this.renderButton('/')}
          {this.renderButton('^')}
        </div>
        <div className="calculator-row">
          {this.renderButton(7)}
          {this.renderButton(8)}
          {this.renderButton(9)}
          {this.renderButton('x')}
          {this.renderButton('(')}
          {this.renderButton(')')}
        </div>
        <div className="calculator-row">
          {this.renderButton(0)}
          {this.renderButton('.')}
          {this.renderButtonSpecial('Del')}
          {this.renderButtonSpecial('Clear')}
          {this.renderButtonSpecial('=')}
        </div>
        <div className="calculator-row">
          {this.renderTryg('sin')}
          {this.renderTryg('cos')}
        </div>
        <div className="calculator-row">
          {this.renderTryg('tan')}
          {this.renderTryg('ctg')}
        </div>
        <div className="calculator-row">
          {this.renderGraph('Graph')}
        </div>
      </div>
    );
  }
}

function Graph(props) {
  let data = {
      labels: props.values.graphData[1][0],
      datasets: []
  };
  for (let j = 0; j < props.values.graphData.length; j++) {
    data['datasets'].push(
      {
        label: props.values.actions[j],
        data: props.values.graphData[j][1],
        backgroundColor: randomColor()
      }
    );
  }
  return (
    <div className="graph">
      <Line data={data}
        responsive={true}
        maintainAspectRatio={false}
        pointDot={true}
        pointDotRadius={4}
        pointHitDetectionRadius={20}
      />
    </div>
  );
}

function Button(props) {
  return (
    <button className="button" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function ButtonSpecial(props) {
  return (
    <button className="buttonSpecial" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function ButtonGraph(props) {
  return (
    <button className="buttonGraph" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function ButtonTryg(props) {
  return (
    <button className="buttonTryg" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Display(props) {
  return (
    <div className='display'>
      <div className='display-numbers'>
        {props.value.action}
      </div>
      <div className='display-results'>
        {props.value.result}
      </div>
    </div>
  );
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
