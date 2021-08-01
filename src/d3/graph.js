/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import * as d3 from "d3";

export let axisFactoryMixin = {
    createXAxis(xRange, label) {
        let x = d3.scaleLinear().domain(xRange).range([0, this.graphBounds.xaxis]);
    
        this.focus.append("g")
            .attr("class", "x")
            .transition()
            .duration(100)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr("transform", "rotate(90)")
            .attr("transform", "")
            .attr("text-anchor", "start")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("x", -10)
            .attr("y", -2.5);
    
        this.focus.select(".x")
            .append("text")
            .attr("transform", "translate(" + this.graphBounds.xaxis + " ," + ((this.height - this.margin.top - this.margin.bottom) + this.margin.top) + ")")
            .attr("class", "x-label")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .style("text-anchor", "middle")
            .style("fill", "black")
            .text(label);
    
        return x;
    },
}

export let axisCategoricalMixin = {}

export let axisXContinuousMixin = {
    createXAxis(xMax, label) {
        this.xScale = d3.scaleLinear()
            .domain([0, xMax])
            .range([0, this.graphBounds.xaxis]);
    
        this.gX = this.focus.append("g")
            .attr("class", "x")
            .attr("transform", "translate(0," + this.graphBounds.yaxis + ")")
            .transition()
            .duration(100)
            .call(d3.axisBottom(this.xScale))
        this.gX
            .selectAll('text')
            .attr("text-anchor", "middle")
            .attr("font-size", "1.2em")
            .attr("font-weight", "bold")
            .attr("y", 10);
    
        this.focus.select(".x")
            .append("text")
            .attr("class", "x-label")
            .attr("font-size", "1.4em")
            .attr("font-weight", "bold")
            .style("text-anchor", "start")
            .style("fill", "black")
            .attr("x", this.graphBounds.xaxis / 2)
            .attr("y", 35)
            .text(label);
    
        return d3.axisBottom(this.xScale);
    },

    drawXAxis (xMax, label) {
        this.xScale
            .domain([0, xMax])
            .range([0, this.graphBounds.xaxis]);

        //ticks
        this.gX = this.focus.select(".x")
            .attr("class", "x")
            .attr("transform", "translate(0," + this.graphBounds.yaxis + ")")
            .call(this.xScale)
        this.gX
            .selectAll('.tick')
            .attr("class", "x-ticks")
            .attr("y", 25);

        this.focus.select(".x")
            .append("text")
            .attr("class", "x-label")
            .attr("font-size", "1.4em")
            .style("text-anchor", "middle")
            .style("fill", "black")
            .style("font-weight", "bold")
            .attr("x", this.graphBounds.xaxis / 2)
            .attr("y", 35)
            .text(label);
    }
}

export let axisYContinuousMixin = {
    createYAxis (yRange, label) {
        this.yText = label;
        this.yScale = d3.scaleLinear()
            .range([this.graphBounds.yaxis, this.margin.bottom]);

        this.gY = this.focus.append("g")
            .attr("class", "y")
            .transition()
            .duration(100)
            .call(d3.axisLeft(this.yScale))
        this.gY
            .selectAll("text")
            .attr("text-anchor", "start")
            .attr("transform", "translate(-35, 0)")
            .attr("font-size", "1.4em")
            .attr("font-weight", "bold");
    
        // Y label
        this.focus.select(".y")
            .append("text")
            .attr("class", "y-label")
            .attr("transform", "translate(-50 " + this.height / 2 + ") rotate(270)")
            .style("font-size", "1.4em")
            .style("text-anchor", "middle")
            .style("fill", "black")
            .style("font-weight", "bold")
            .text(label);
    
        return d3.axisLeft(this.yScale);
    },

    drawYAxis(yMax, label) {
        this.yText = label;
        this.yScale.domain([0, yMax]);
    
        this.gY = this.focus.select(".y")
            .attr("class", "y")
            .call(this.yAxis);
        this.gY
            .selectAll("text")
            .attr("text-anchor", "start")
            .attr("transform", "translate(-35, 0)")
            .attr("font-size", "1.4em")
            .attr("font-weight", "bold");

        this.focus.select(".y-label").remove();
    
        this.focus.select(".y")
            .append("text")
            .attr("class", "y-label")
            .attr("transform", "translate(-50 " + this.height / 2 + ") rotate(270)")
            .style("font-size", "1.4em")
            .style("text-anchor", "middle")
            .style("fill", "black")
            .style("font-weight", "bold")
            .text(label);
    }
}

export class D3Graph {
    constructor(containerId, title, xAxis, yAxis) {
        this.containerId = containerId;
        this.title = title;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.margin = {
            top: 10,
            bottom: 45,
            left: 75,
            right: 75
        }
        this.graphBounds = {
            xaxis: 0,
            yaxis: 0
        };
        this.zoomable = false;
    }

    getContainer() {
        return this.container;
    }

    setContainer(container) {
        this.container = container;
    }

    setZoomable(zoomable) {
        this.zoomable = zoomable;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
    }

    getXAxis() {
        return this.xAxis;
    }

    setXAxis(xAxis) {
        this.xAxis = xAxis;
    }

    getYAxis() {
        return this.yAxis;
    }

    setYAxis(yAxis) {
        this.yAxis = yAxis;
    }

    setG() {
        this.g = d3.select("#".concat(this.containerId))
            .select(".focus")
            .append("g")
            .attr("id", "plot")
    }

    init() {
        //Attach to container
        let containerId = "#".concat(this.containerId);

        // Delete old svg
        // Create a new one
        if (!d3.select(containerId).select("#svg_parent_container").empty()) {
            d3.select(containerId)
                .select("#svg_parent_container")
                .remove();
        }
        this.svg = d3.select(containerId)
            .append("svg")
            .attr("id", "svg_parent_container");
        // Default behaviour fill entire container
        this.width = d3.select(containerId).node().offsetWidth;
        this.height = d3.select(containerId).node().offsetHeight;
        //Axis bounds
        this.graphBounds.xaxis = this.width - this.margin.left - this.margin.right;
        this.graphBounds.yaxis = this.height - this.margin.top - this.margin.bottom;
        //Resize svg
        this.svg
            .attr("width", this.width)
            .attr("height", this.height)
        //Add focus, this is our top level group for the visualisation
        this.focus = this.svg
            .append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + this.margin.left + ",0)");
        //Set the group of the plot, used to zoom the plot separately
        //to the focus
        this.setG();
    }

    /**
     * Takes an object, property value pairs
     * that describe the styles to be applied to a single component
     * described by selector array
     * 
     * @param {Array} selector 
     * @param {Object} styleArray 
     */
    applyStyle (selectors, styleObj) {
        let element = this.focus;
        selectors.forEach((selector) => {
            element = element.select(selector);
        })
        for (let style of Object.keys(styleObj)) {
            element.style(style, styleObj[style]);
        }
    }

    /**
     * Takes an object, property value pairs
     * that describe the styles to be applied to all components
     * described by selector array
     * 
     * @param {Array} selector 
     * @param {Object} styleObj
     */
    applyStyleAll (selectors, styleObj) {
        let element = this.focus;
        selectors.forEach((selector) => {
            element = element.selectAll(selector);
        })
        console.log(element);
        for (let style of Object.keys(styleObj)) {
            console.log(style, styleObj[style]);
            element.style(style, styleObj[style]);
        }
    }

    // TO BE IMPLEMENTED
    draw () {
        this.init();
        if (this.getXAxis != undefined) this.drawXAxis(this.getXAxis())
        if (this.getYAxis != undefined) this.drawYAxis(this.getYAxis());
        if (this.render() != -1) this.render();
    }

    /**
     * This is a method that can be overridden by mixins,
     * similar to how Java uses inheritance of interfaces to implement
     * methods, or inhertinace from classes that provide default behaviour
     * to be implemented or overridden
     */
    render () {
        return -1;
    }

    setData (data) {
        this.data = data;
    }
}