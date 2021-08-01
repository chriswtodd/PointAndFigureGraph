import './App.css';
import { useState, useEffect } from 'react';

import * as d3 from "d3";

import * as D3Graph from "./d3/graph";
import * as D3GraphFigureAndPoint from "./d3/figureAndPoint";

// Import our data, could be done better
import data from './data/AMD.csv';

// This is our main application page, it is bare bones and is just a skeleton
// for our point and figure to draw on
// We will add some limited filters at the top of the page to give some user
// interaction

function App() {
  let [stock, setStock] = useState("AMD");
  let [boxSize, setBoxSize] = useState(0.5);

  useEffect(() => {
    d3.csv(data).then(data => {
        let graph = new D3Graph.D3Graph("graph");
  
        Object.assign(graph, D3Graph.axisXContinuousMixin);
        Object.assign(graph, D3Graph.axisYContinuousMixin);
        Object.assign(graph, D3GraphFigureAndPoint.figureAndPointMixin);
      
        graph.init();
      
        graph.setXAxis(graph.createXAxis(100));
        graph.setYAxis(graph.createYAxis(100, "Price, $ (USD)"));

        let graphData = data.map(d => {
          return {
            x: 0, 
            y: parseFloat(d["Close"])
          } 
        })
        graph.setData(graphData);
        graph.enter()

        
    })  
  })

  return (
    <div className="App">
      <h3>Point and Figure Graph - AMD, Jun 2020 - Jun 2021 </h3>
      <label for="box_size_input"> Box Size: </label>
      <input type="number" 
        id="box_size" 
        onChange={(event) => setBoxSize(event.target.value)}
        name="box_size_input" 
        min="0.1" 
        max="5" 
        step="0.1"
        value={boxSize}
      />
      <label for="dropdown"> Stock: </label>
      <select name="dropdown" value={stock} onChange={(event) => setStock(event.target.value)}>
        <option value="AAPL">AAPL</option>
        <option value="AMD" selected>AMD</option>
      </select>
      <div id="graph">

      </div>
    </div>
  );
}

export default App;
