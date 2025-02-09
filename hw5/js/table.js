/** Class implementing the table. */
class Table {
  /**
   * Creates a Table Object
   */
  constructor(teamData, treeObject) {

    // Maintain reference to the tree Object;
      console.log(treeObject);
    this.tree = treeObject;

    // Create list of all elements that will populate the table
    // Initially, the tableElements will be identical to the teamData
    this.tableElements = teamData.slice(0); //

    // Store all match data for the 2014 Fifa cup
    this.teamData = teamData;

    // Default values for the Table Headers
    this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

    // To be used when sizing the svgs in the table cells.
    this.cell = {
      "width": 70,
      "height": 20,
      "buffer": 15
    };

    this.bar = {
      "height": 20
    };

    // Set variables for commonly accessed data columns
    this.goalsMadeHeader = 'Goals Made';
    this.goalsConcededHeader = 'Goals Conceded';

    // Setup the scales
    this.goalScale = null;

    // Used for games/wins/losses
    this.gameScale = null;

    // Color scales
    // For aggregate columns  Use colors '#ece2f0', '#016450' for the range.
    this.aggregateColorScale = null;

    // For goal Column. Use colors '#cb181d', '#034e7b'  for the range.
    this.goalColorScale = null;
  }


  /**
   * Creates a table skeleton including headers that when clicked allow
   * you to sort the table by the chosen attribute.
   * Also calculates aggregate values of goals, wins, losses and total
   * games as a function of country.
   */
  createTable() {
      let teamData = this.teamData;

    // ******* TODO: PART II *******

    // Update Scale Domains
      this.goalScale = d3.scaleLinear()
          .domain([d3.min(teamData, d => d.value['Goals Made']), d3.max(teamData, d => d.value['Goals Made'])])
          .range([0,2*this.cell.width])
          .nice();
      this.aggregateColorScale = d3.scaleLinear()
          .domain([0, d3.max(teamData, d => d.value['TotalGames'])])
          .range(["#ece2f0","#016450"])
      this.gameScale = d3.scaleLinear()
          .domain([0, d3.max(teamData, d => d.value['TotalGames'])])
          .range([0,this.cell.width]);


    // Create the x axes for the goalScale.
      let goalAxis = d3.axisTop();
      goalAxis.scale(this.goalScale);
    // Add GoalAxis to header of col 1.
      d3.select("#goalHeader").append('svg')
          .attr('width', 2 * this.cell.width + 2 * this.cell.buffer)
          .attr('height', this.cell.height)
          .append('g')
          .attr("transform", "translate(10,16)")
          .call(goalAxis)

    // ******* TODO: PART V *******

    // Set sorting callback for clicking on headers

    // Clicking on headers should also trigger collapseList() and
    // updateTable().

  }


  /**
   * Updates the table contents with a row for each element in the global
   * variable tableElements.
   */
  updateTable() {
    // ******* TODO: PART III *******
    // Create table rows

      let tableRow = d3.select('#matchTable').select('tbody')
          .selectAll('tr')
          .data(this.tableElements);
      tableRow.exit()
          .remove();
      tableRow = tableRow.enter()
          .append('tr')
          .on('click', (d,i) => {

              this.updateList(i);
              this.updateTable();
          })
          .on('mouseover', (d,i) => {
              this.tree.updateTree(this.tableElements[i]);
          })
          .on('mouseout', () => {
              this.tree.clearTree();
          })
          .merge(tableRow);

//Append th elements for the Team Names
      let tableHeader = tableRow.selectAll("th")
          .data(d =>  { return[{'type': d.value['type'], 'view': 'text', 'value': d.key}] });
      tableHeader.exit().remove();
      tableHeader = tableHeader.enter()
          .append('th')
          .merge(tableHeader);


//Append td elements for the remaining columns.
      let tableData = tableRow.selectAll("td")
          .data(d =>  {


              return[{'type': d.value['type'], 'view': 'goals', 'value': {'goalsMade':d.value['Goals Made'], 'goalsConceded' : d.value['Goals Conceded']}},
                  {'type': d.value['type'], 'view': 'text', 'value': d.value['Result']},
                  {'type': d.value['type'], 'view': 'bar', 'value': d.value['Wins']},
                  {'type': d.value['type'], 'view': 'bar', 'value': d.value['Losses']},
                  {'type': d.value['type'], 'view': 'bar', 'value': d.value['TotalGames']}
              ] });
      tableData.exit()
          .remove();
      tableData = tableData.enter()
          .append('td')
          .merge(tableData);

      tableHeader.text(d =>  {
          return d.type==='aggregate' ? d.value : 'x'+d.value;})
          .style('color', d =>  { return d.type==='aggregate' ? 'black' : 'gray';});

//Populate cells (do one type of cell at a time )

      let textColumn = tableData.filter(d =>  { return d.view === 'text'});

      textColumn.select('svg').remove();
      let textBody = textColumn.append('svg')
          .attr("width", this.cell.width*1.6)
          .attr("height", this.cell.height);
      textBody.append("text")
          .attr("x", 0)
          .attr("y", this.cell.height/2)
          .text(d =>  {
              return d.value['label']
          });

      let goalsColumn = tableData.filter(d =>  { return d.view === 'goals'});
      goalsColumn.select('svg').remove();
      let goalsBody = goalsColumn.append('svg')
          .attr("width", this.cell.width * 2 + this.cell.buffer)
          .attr("height", this.cell.height)
      goalsBody.append('rect')
          .classed('goalBar',true)
          .attr('fill', d =>  { return d.value['goalsMade'] > d.value['goalsConceded'] ? 'blue' : 'red';})
          .attr('width', d =>  {
              if(d.type==='aggregate') {
                  return Math.abs(this.goalScale(d.value['goalsMade'] - d.value['goalsConceded']));
              }
              else {
                  return Math.abs(this.goalScale(d.value['goalsMade'] - d.value['goalsConceded']))-10;
              }
          })
          .attr('height', d =>  { return d.type==='aggregate' ? 10 : 5;})
          .attr('x', d =>  {
              return d.type === 'aggregate'
                  ? d.value['goalsMade'] > d.value['goalsConceded']
                      ? this.goalScale(d.value['goalsConceded'])+6
                      :this.goalScale(d.value['goalsMade'])+6
                  : d.value['goalsMade'] > d.value['goalsConceded']
                      ? this.goalScale(d.value['goalsConceded'])+12
                      : this.goalScale(d.value['goalsMade'])+12;

          })
          .attr('y', d =>  { return d.type === 'aggregate' ? 5 : 7.5
          });
      goalsBody.append('circle')
          .classed("goalCircle", true)
          .attr('fill', d =>  { return d.type === 'aggregate' ? 'blue' : 'none';})
          .attr('stroke', d =>  {
              return d.type === 'aggregate' ? 'none' : d.value['goalsConceded']===d.value['goalsMade'] ? 'gray' : 'blue';})
          .attr('cy', 10)
          .attr('cx', d =>  { return this.goalScale(d.value['goalsMade'])+6})
          .attr('r',5);
      goalsBody.append('circle')
          .classed("goalCircle", true)
          .attr('fill', d =>  {return d.type === 'aggregate' ? 'red' : 'none';})
          .attr('stroke', d =>  {
              return d.type === 'aggregate' ? 'none' : d.value['goalsConceded'] === d.value['goalsMade'] ? "gray" : "red";
          })
          .attr('cy', 10)
          .attr('cx', d =>  { return this.goalScale(d.value['goalsConceded'])+6})
          .attr('r',5);



      let barColumns = tableData.filter(d =>  {return d.view === 'bar'});
      barColumns.style("padding-left", "0px")
      barColumns.select('svg').remove();
      let barBody = barColumns.append('svg').attr("width", this.cell.width).attr("height", this.cell.height);
      barBody.append('rect')
          .attr('width', d =>  { return this.gameScale(d.value)})
          .attr('height', this.bar.height)
          //
          .attr('x', 0)

          .attr('fill', d => {
              return this.aggregateColorScale(d.value);});

      barBody.append('text')
          .text(d =>  {return d.value})
          .classed("label", true)
          .attr("x", d =>  { return this.gameScale(d.value)-10})
          .attr("y",15);



  };

  /**
   * Updates the global tableElements variable, with a row for each row
   * to be rendered in the table.
   */
  updateList(i) {
    // ******* TODO: PART IV *******
      let teamList = this.tableElements[i].value.games;
      if(i != this.tableElements.length-1 ) {
          if(this.tableElements[i+1].value['type']=='aggregate') {
              for (let j=0; j<teamList.length; j++) {
                  this.tableElements.splice(j+i+1, 0, teamList[j])
              }
          }
          else {
              this.tableElements.splice(i+1, teamList.length)

          }
      }
      else if(this.tableElements[i].value['type']=='aggregate'){
          for (let j=0; j<teamList.length; j++) {
              this.tableElements.splice(j+i+1, 0, teamList[j])
          }
      }
    // Only update list for aggregate clicks, not game clicks
  }

  /**
   * Collapses all expanded countries, leaving only rows for aggregate
   * values per country.
   */
  collapseList() {

    // ******* TODO: PART IV *******

  }
}
