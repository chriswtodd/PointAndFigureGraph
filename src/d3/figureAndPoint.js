/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import * as d3 from "d3";

export let figureAndPointMixin = {
    boxSize: 0.5,
    /**
     * Called to initialise the graph, only called once per draw
     */
    enter() {
        let yMax = d3.max(this.data.map(d => d.y));
        this.drawYAxis(yMax, "Price, $ (USD)");

        let currentX = 0;
        let up = true;
        let p = this.data[0];
        let drawData = [];
        for (let index = 0; index < this.data.length - 1; index++) {
            let delta = this.data[index]['y'] - p['y'];
            if (Math.abs(delta) >= this.boxSize) {
                // Iterate x if changed direction
                if ((delta > 0 && !up) || (delta < 0 && up)) {
                    up = !up;
                    currentX = currentX + 1;
                }
                // Deal with the full boxsizes requiring a new box
                let points = Math.abs(Math.round(delta / this.boxSize));
                let sign = Math.sign(delta);
                let nextY = p['y'];
                while (points > 0) {
                    drawData.push([currentX, nextY]);
                    nextY = nextY + (this.boxSize * sign);
                    points--;
                }
                // Deal with any modulus that caries over to next comparison
                // let modulus = delta % boxSize;
                // this.data[index + 1]['y'] = this.data[index + 1]['y'] + ((modulus * boxSize) * sign)
            }
            p = this.data[index];
        }
        this.data = drawData;
        // Now we have the horizontal steps stored in our data, use them for the x
        let xMax = d3.max(this.data.map(d => d[0]));
        this.drawXAxis(xMax, "No. of price reversals")

        let symbolGeneratorCross = d3.symbol().type(d3.symbolCross).size(150);
        let symbolGeneratorDot = d3.symbol().type(d3.symbolCircle).size(150);
        let upPathData = symbolGeneratorDot();
        let downPathData = symbolGeneratorCross();
        // Draw our graph
        this.g
            .selectAll('path')
            .data(this.data)
            .join("path")
            .attr("transform", d => "translate(" + [this.xScale(d[0]), this.yScale(d[1])] + ")")
            .attr("x", d => this.xScale(d[0]))
            .attr("y", d => this.yScale(d[1]))
            .attr("id", d => d[1])
            .on("mouseover", (d,i) => {
                // find the old price
                let pastPriceIndex = 0;
                let color = "";
                let rotate = "", translate = "";
                if (this.data.indexOf(i) != 0) {
                    pastPriceIndex = this.data.indexOf(i) - 1;
                }
                if (i === 0) { lastChanged = 0; return }
                if (this.data[pastPriceIndex][1] - i[1] > 0) { 
                    color = "red"; 
                    rotate = "rotate(180)"
                    translate = "translate( " + (d.clientX + 130) + "," + (d.clientY + 100) + ")"
                }
                if (this.data[pastPriceIndex][1] - i[1] < 0) { 
                    color = "rgba(16,254,84,0.8)"; 
                    translate = "translate( " + (d.clientX + 105) + "," + (d.clientY + 75) + ")"
                }
                this.g
                    .append("rect")
                    .attr("id", "tt")
                    .attr("transform", "translate( " + d.clientX + "," + d.clientY + ")")
                    .attr("height", 150)
                    .attr("width", 150)
                    .style("fill", "#eee")
                this.g
                    .append("text")
                    .attr("id", "tt-text")
                    .attr("transform", "translate( " + (d.clientX + 75) + "," + (d.clientY + 75) + ")")
                    .attr("font-size", "16px")
                    .attr("font-weight", "bold")
                    .style("text-anchor", "middle")
                    .style("fill", "black")
                    .text("Price: $" + Math.round(i[1]))
                let change = (((i[1] - this.data[pastPriceIndex][1]) / this.data[pastPriceIndex][1]) * 100);
                change = Math.round((change + Number.EPSILON) * 100) / 100
                this.g
                    .append("text")
                    .attr("id", "tt-text")
                    .attr("transform", "translate( " + (d.clientX + 75) + "," + (d.clientY + 90) + ")")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .style("text-anchor", "middle")
                    .style("fill", "black")
                    .text("Change: " + change + "%") 
                this.g
                    .append("polygon")
                    .attr("id", "tt-text")
                    .attr("points", "250,60 100,400 400,400")
                    .attr("transform", translate + " scale(0.05) " + rotate)
                    .attr("fill", color)
            })
            .on("mouseleave", (d,i) => {
                this.g.select("#tt").remove()
                this.g.selectAll("#tt-text").remove()
            })
            .attr('d', (d, i) => {
                if (i === 0) { return }
                if (d[1] - this.data[i-1][1] < 0) { 
                    return upPathData;
                }
                if (d[1] - this.data[i-1][1] > 0) { 
                    return downPathData; 
                }
            })
            .attr('fill', (d, i) => {
                if (i === 0) { return }
                if (d[1] - this.data[i-1][1] < 0) { 
                    return "none"; 
                }
                if (d[1] - this.data[i-1][1] > 0) { 
                    return "rgba(16,254,84,0.8)"; 
                }
            })
            .attr('stroke', (d, i) => {
                if (i === 0) { return }
                if (d[1] - this.data[i-1][1] < 0) { 
                    return "red"; 
                }
                if (d[1] - this.data[i-1][1] > 0) { 
                    return "rgba(16,254,84,0.8)"; 
                }
            })
            .attr('stroke-width', (d, i) => {
                if (i === 0) { return }
                if (d[1] - this.data[i-1][1] < 0) { 
                    return "2";
                }
            });
    },

    /**
     * Update, called after enter to update the visualisation with new data
     */
    render() {
        // TO BE IMPLEMENTED
    },
}