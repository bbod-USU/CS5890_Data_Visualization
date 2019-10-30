
class YearChart {

  /**
   * Constructor for the Year Chart
   *
   * @param electoralVoteChart instance of ElectoralVoteChart
   * @param tileChart instance of TileChart
   * @param votePercentageChart instance of Vote Percentage Chart
   * @param electionInfo instance of ElectionInfo
   * @param electionWinners data corresponding to the winning parties over mutiple election years
   */
  constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

    //Creating YearChart instance
    this.electoralVoteChart = electoralVoteChart;
    this.tileChart = tileChart;
    this.votePercentageChart = votePercentageChart;
    // the data
    this.electionWinners = electionWinners;
    
    // Initializes the svg elements required for this chart
    this.margin = {top: 10, right: 20, bottom: 30, left: 50};
    let divyearChart = d3.select("#year-chart").classed("fullView", true);

    //fetch the svg bounds
    this.svgBounds = divyearChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 100;

    //add the svg to the div
    this.svg = divyearChart.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.selected = null;
  }

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass (data) {
    if (data == "R") {
      return "yearChart republican";
    }
    else if (data == "D") {
      return "yearChart democrat";
    }
    else if (data == "I") {
      return "yearChart independent";
    }
  }

  /**
   * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
   */
  update () {

    //Domain definition for global color scale
    let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

    //Color range for global color scale
    let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

    //ColorScale be used consistently by all the charts
    this.colorScale = d3.scaleQuantile()
      .domain(domain)
      .range(range);

    // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year

    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: You can get the d3 selection that was clicked on using
    //   d3.select(d3.event.target)
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations

      let domainOfYears = [];
      let yChart = this;

      var data = [[0, (this.svgHeight - 40)/2], [this.svgWidth, (this.svgHeight - 40)/2]];

      let scaleX = d3.scaleLinear()
          .range([this.margin.left, this.svgWidth - this.margin.right])
          .domain([0, this.electionWinners.length]);



      let line = d3.line();
      let pathString = line(data);

      this.svg.append('g').append('path')
          .attr('d', pathString)
          .style("stroke-dasharray", ("2, 2"))
          .attr('stroke', 'black');

      let years = this.svg.append('g').selectAll('g')
          .data(this.electionWinners)
          .enter()
          .append('g');

      years.append('circle')
          .attr('cy', (this.svgHeight - 38) * .5)

          .attr('cx', (d, i) =>  {return scaleX(i)} )
          .attr('r', 10)

          .attr('class', (d) => {
              return yChart.chooseClass(d.PARTY)
          });

      //Append text information of each year right below the corresponding circle
      //HINT: Use .yeartext class to style your text elements
      years.append('text')
          .attr('x', (d, i) =>  {return scaleX(i)} )
          .attr('y', (this.svgHeight - 20) * .5 + 30)
          .attr('yearText', true)
          .attr('text-anchor', 'middle')
          .text((d) => {return d.YEAR});

      years
          .on("click", d => {
              years.selectAll('circle').classed('selected', false);
              d3.select(d3.event.target).classed("selected", true);

              // Election information corresponding to the year selected is loaded and passed to the update methods of the other visualizations.
              d3.csv(`data/Year_Timeline_${d.YEAR}.csv`).then(electionResult => {
                  this.electoralVoteChart.update(electionResult, this.colorScale);
                  this.votePercentageChart.update(electionResult, this.colorScale);
                  this.tileChart.update(electionResult, this.colorScale)
              });
          })
          .on("mouseenter", () => d3.select(d3.event.target).classed("highlighted", true))
          .on("mouseleave", () => d3.select(d3.event.target).classed("highlighted", false));

    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


  }

}
