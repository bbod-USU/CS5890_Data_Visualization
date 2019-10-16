let tr = d3.select('#matchTable').select('th')
    .selectAll('tr')
    .data(this.tableElements);
tr.exit()
    .remove();
tr = tr.enter()
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
    .merge(tr);

//Append th elements for the Team Names
let tableHeader = tr.selectAll("th")
    .data(d =>  { return[{'type': d.value['type'], 'view': 'text', 'value': d.key}] });
tableHeader.exit().remove();
tableHeader = tableHeader.enter()
    .append('th')
    .merge(tableHeader);


//Append td elements for the remaining columns.
let td = tr.selectAll("td")
    .data(d =>  {


        return[{'type': d.value['type'], 'view': 'goals', 'value': {'goalsMade':d.value['Goals Made'], 'goalsConceded':d.value['Goals Conceded']}},
            {'type': d.value['type'], 'view': 'text', 'value': d.value['Result']},
            {'type': d.value['type'], 'view': 'bar', 'value': d.value['Wins']},
            {'type': d.value['type'], 'view': 'bar', 'value': d.value['Losses']},
            {'type': d.value['type'], 'view': 'bar', 'value': d.value['TotalGames']}
        ] })
td.exit()
    .remove();
td = td.enter()
    .append('td')
    .merge(td);

//Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
//th.select('svg').remove()
tableHeader.text(d =>  {
    return d.type==='aggregate' ? d.value : 'x'+d.value;})
    .style('color', d =>  { return d.type==='aggregate' ? 'black' : 'gray';});

//Populate cells (do one type of cell at a time )
let goalsColumn = td.filter(d =>  { return d.view === 'goals'});
let barColumns = td.filter(d =>  {return d.view === 'bar'});
let textColumn = td.filter(d =>  { return d.view === 'text'});

goalsColumn.select('svg').remove();
let goalsBody = goalsColumn.append('svg')
    .attr("width", this.cell.width * 2 + this.cell.buffer)
    .attr("height", this.cell.height)
goalsBody.append('rect')
    .classed('goalBar',true)
    .attr('fill', d =>  {
        if (d.value['goalsMade'] > d.value['goalsConceded']) { return 'blue';}
        else { return 'red'; }
    })
    .attr('width', d =>  {
        if(d.type==='aggregate') {
            return Math.abs(this.goalScale(d.value['goalsMade'] - d.value['goalsConceded']));
        }
        else {
            return Math.abs(this.goalScale(d.value['goalsMade'] - d.value['goalsConceded']))-10;
        }
    })
    .attr('height', d =>  {
        if(d.type==='aggregate') {
            return 10;
        }
        else {
            return 5;
        }
    })
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