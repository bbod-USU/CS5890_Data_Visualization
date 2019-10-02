/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
        // ******* TODO: PART I *******

        // Create the x and y scales; make
        // sure to leave room for the axes

        let data = this.chooseData(selectedDimension);
        let allData = this.allData;
        let infoPanel = this.infoPanel;
        let worldMap = this.worldMap;
        let svgHeight = d3.select("#barChart").style("height").replace("px", "");
        let svgWidth = d3.select("#barChart").style("width").replace("px", "");

        let xaxisHeight = 60;
        let yaxisWidth = 60;
        d3.select("#barChart")
            .attr("transform", "scale(1,-1)");
        data.sort(function (a, b) {
            return a[1] > b[1] ? 1 : -1;
        });

        let dataNum = [];
        data.forEach(x => dataNum.push(x.data));
        let datadate = [];
        data.forEach(x => datadate.push(x.date));
        var blues = d3.scaleOrdinal(d3.schemeBlues[datadate.length]);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(dataNum)])
            .range([svgHeight - (xaxisHeight), 0]);

        let xScale = d3.scaleBand()
            .domain(datadate)
            .range([xaxisHeight, svgWidth - yaxisWidth])
            .padding(.25);

        let y_axis = d3.axisLeft(yScale);

        let x_axis = d3.axisBottom(xScale)
            .tickFormat((d, i) => datadate[i]);
        //.scale(xScale);


        d3.select("#xAxis")
            .style("height", xaxisHeight)
            .attr("transform", `translate(0, ${yaxisWidth}) scale(1,-1)`)
            .call(x_axis)
            .selectAll("text")
            .attr('transform', 'translate(15, 30) rotate(90)');

        let height = svgHeight;
        d3.select("#yAxis")
        //.style("width", yaxisWidth)
            .attr("transform", `translate(${xaxisHeight}, ${svgHeight}) scale(1,-1)`)
            .call(y_axis);
        // Create colorScale
        let color = d3.scaleLinear().domain([1, svgHeight - yScale(d3.max(dataNum)) - xaxisHeight])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#00f9ff"), d3.rgb('#0051ff')]);
        // Create the axes (hint: use #xAxis and #yAxis)
        let barChart = d3.select("#bars")
            .selectAll('rect')
            .data(data);

       barChart.exit()
            .attr('height', 0)
            .remove();

        barChart.attr('height', (d, i) => svgHeight - yScale(d['data']) - xaxisHeight)
            .attr('x', (d, i) => xScale(d['date']))
            .attr('y', (d, i) => yScale(d['data']))
            .attr('fill', (d, i) => color(svgHeight - yScale(d['data']) - xaxisHeight));


        barChart
            .enter()
            .append('rect')
            .attr("transform", `translate(0, ${height}) scale(1,-1)`)
            .attr('id', (d, i) => `${d['date']}`)
            .attr('x', (d, i) => xScale(d['date']))
            .attr('y', (d, i) => yScale(d['data']))
            .attr('width', xScale.bandwidth())
            .attr('height', (d, i) => svgHeight - yScale(d['data']) - xaxisHeight)
            .attr('class', 'bar')
            .attr('fill', (d, i) => color(svgHeight - yScale(d['data']) - xaxisHeight));


        //
        // d3.select("#bars")
        //         .selectAll('#rect')
        //

        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        d3.select("#bars")
            .selectAll('rect')
            .on('click', function (d, i) {
                d3.select(".selected").classed("selected", false);
                // Select current item
                d3.select(this).classed("selected", true);
                infoPanel.updateInfo(allData[d['index']]);
                console.log(allData[d['index']]);
                worldMap.updateMap(allData[d['index']]);

            });

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }


    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */

    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        let currentDataType = d3.select('#dataset')
            .node().value;
        //.property("value");
        let selectedData = [];
        for(let i = 0; i <  this.allData.length; i++) {
            var item = [];
            item.date = this.allData[i]["year"];
            item.data = this.allData[i][currentDataType];
            item.index = i;
            selectedData.push(item);

        }
        // this.allData.forEach(x => {
        //     var item = [];
        //     item.date = x["year"];
        //     item.data = x[currentDataType];
        //     item.index = x;
        //     selectedData.push(item);
        // });
        return selectedData;
    }
}