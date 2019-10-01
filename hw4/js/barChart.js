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

      let svgHeight = d3.select("#barChart").style("height").replace("px", "");
      let svgWidth = d3.select("#barChart").style("width").replace("px", "");

      let xaxisHeight = 60;
      let yaxisWidth = 60;
      d3.select("#barChart")
          .attr("transform", "scale(1,-1)");
      console.log(data);
      data.sort(function(a, b) {
          return a[1] > b[1] ? 1 : -1;
      });
      console.log(data);
      let dataNum = [];
      data.forEach(x => dataNum.push(x.data));
      let datadate = [];
      data.forEach(x => datadate.push(x.date));

      let yScale = d3.scaleLinear()
          .domain([0 , d3.max(dataNum)])
          .range([svgHeight-(xaxisHeight), 0]);

      let xScale = d3.scaleBand()
          .domain(datadate)
          .range([xaxisHeight, svgWidth-yaxisWidth])
          .padding(.25);

      let y_axis = d3.axisLeft(yScale);

      let x_axis = d3.axisBottom(xScale)
          .tickFormat((d,i) => datadate[i]);
          //.scale(xScale);


      d3.select("#xAxis")
          .style("height", xaxisHeight)
          .attr("transform",  `translate(0, ${yaxisWidth}) scale(1,-1)`)
          .call(x_axis)
          .selectAll("text")
          .attr('transform', 'translate(15, 30) rotate(90)');

    let height = svgHeight;
      d3.select("#yAxis")
          //.style("width", yaxisWidth)
          .attr("transform",  `translate(${xaxisHeight}, ${svgHeight}) scale(1,-1)`)
          .call(y_axis);
    // Create colorScale

    // Create the axes (hint: use #xAxis and #yAxis)

    //Create the bars (hint: use #bars)
      let barChart = d3.select("#bars")
          .selectAll('rect')
          .data(datadate)
          .enter()
          .append('rect')
          .attr("transform",  `translate(0, ${height}) scale(1,-1)`)
          .attr('x', (d,i) => xScale(d))
          .attr('y', (d,i) => yScale(dataNum[i]))
          .attr('width', xScale.bandwidth())
          .attr('height', (d,i) => svgHeight - yScale(dataNum[i])-xaxisHeight)
          .attr('class', 'bar');
    //

//      barChart.exit().remove();

      // barChart.enter()
      //     .append("rect")
      //     .attr("data", function (d, i) {
      //         console.log(d);
      //         console.log(i);
      //         return i;
      //     })
      //     .attr("height", d => yScale(d))
      //     .attr("y", 0)
      //     .attr("width", (svgWidth-100)/(dataNum.length +1))
      //     .attr("transform",  "translate(60, 310) scale(1,-1)")
      //     .style("fill", "steelblue");

    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

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
      this.allData.forEach(x => {
          var item = [];
          item.date = x["year"];
          item.data = x[currentDataType];
          selectedData.push(item);
      });

      console.log(this.allData);
      console.log(selectedData);
      return selectedData;
  }
}
