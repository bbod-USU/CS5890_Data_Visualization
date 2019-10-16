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
      console.log(this.tableElements);
      let row = d3.select('#tbody')
          .selectAll('tr')
          .data(this.tableElements);
      row.exit()
          .remove();
      row.enter()
          .append('tr')
          .on('click', (d,i) =>{
              this.tree.updateTree(this.tableElements[i]);
          })
          .on('mouseover', (d,i) => {
              this.tree.updateTree(this.tableElements[i]);
          })
          .on('mouseout', () => {
              this.tree.clearTree();
          })
          .merge(row);
    // Append th elements for the Team Names
      let tableHeader = row.selectAll('th')
          .data((d)=>{
                  return [{'type':d.value['type'],
                  'view': 'text',
                  'data': d.key()}]
          });
      tableHeader.exit()
          .remove();
      tableHeader = tableHeader.enter()
          .append('th')
          .merge(tableHeader);



    // Append td elements for the remaining columns.
      let tcell = tableHeader.selectAll('#td')
          .data(d => {
              return[{'type': d.value['type'], 'view': 'goals', 'value': {'goalsMade':d.value['Goals Made'], 'goalsConceded':d.value['Goals Conceded']}},
                  {'type': d.value['type'], 'view': 'text', 'value': d.value['Result']},
                  {'type': d.value['type'], 'view': 'bar', 'value': d.value['Wins']},
                  {'type': d.value['type'], 'view': 'bar', 'value': d.value['Losses']},
                  {'type': d.value['type'], 'view': 'bar', 'value': d.value['TotalGames']}
              ] });
      tcell.exit().remove();
      tcell = tcell.enter().append('td').merge(tcell);
    // Data for each cell is of the type: {'type':<'game' or 'aggregate'>,
    // 'value':<[array of 1 or two elements]>}
      tableHeader.text(d =>{
          return d.type === 'aggregate' ? d.value : "x"+d.value
          })
          .style('color', d => {
              return d.type === 'aggregate' ? 'black' : 'grey'
          });
    //Add scores as title property to appear on hover

    //Populate cells (do one type of cell at a time)
      let values = tcell.each(d=> { console.log(d.view); return [d.view === 'goals', d.view === 'bar', d.view ==='text']});
      let goals = tcell.filter(d =>{return d.view === 'goals'});
      let bar = values[1];
      let text = tcell.filter(d =>{return d.view === 'text'});
      console.log(this.cell);

      text.select('svg').remove();
      let textBody = text.append('svg')
          .attr("width", this.cell.width*1.6)
          .attr("height", this.cell.height);
      textBody.append("text")
          .attr("x", 0)
          .attr("y", this.cell.height/2)
          .text(d => { return d.value['label']});

    //Create diagrams in the goals column

    //Set the color of all games that tied to light gray

  };

  /**
   * Updates the global tableElements variable, with a row for each row
   * to be rendered in the table.
   */
  updateList(i) {
    // ******* TODO: PART IV *******

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
