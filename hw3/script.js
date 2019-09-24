/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
    let bar = document.getElementById("chart1").children[0].children;
    for(let i = 0; i < bar.length; i++){
        bar[i].style.height = (i+1) * 10;
    }

}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(data) {
    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);


    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    //let chart1 =  d3.select('#chart1').selectAll('rect');
    d3.select('#chart1')
        .selectAll('rect')
        .data(data)
        .on('mouseover', function(d,i) {
            d3.select(this).style('fill', 'orange')
        })
        .on('mouseout', function(d,i) {
            d3.select(this).style('fill', 'steelblue')
        })
        .attr('height', d => aScale(d.a))

        .enter()
        .append("rect")
        .attr("x", function(d,i){
            return iScale(i+1);
        })
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 0)
        .style("fill", "orange")
        .attr("opacity", 0)


        .exit()
        .remove()
       ;



    // TODO: Select and update the 'b' bar chart bars
    let tmp = d3.select('#chart2')
        .selectAll('rect')
        .data(data);

        tmp.on('mouseover', function(d,i) {
            d3.select(this).style('fill', 'orange')

        })
        .on('mouseout', function(d,i) {
            d3.select(this).style('fill', 'steelblue')

        })
        .attr('height', d => aScale(d.b));

        tmp.enter()
        .append("rect")
        .attr("x", function(d,i){
            return iScale(i+1);
        })
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 0)
        .attr("translate(0, 200) scale(1, -1)")

        .style("fill", "steelblue");


        tmp.exit()
        .remove();


    // TODO: Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    d3.select('#line1')
        .select('path')
        .attr("d", aLineGenerator(data));

    // TODO: Select and update the 'b' line chart path (create your own generator)

    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => bScale(d.b));

    d3.select('#line2')
        .select('path')
        .attr("d", bLineGenerator(data));



  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3.area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.a));

    d3.select('#area1')
        .select('path')
        .attr("d", aAreaGenerator(data));

    // TODO: Select and update the 'b' area chart path (create your own generator)

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.b));

    d3.select('#area2')
        .select('path')
        .attr("d", bAreaGenerator(data));

    // TODO: Select and update the scatterplot points

    d3.select('#scatterplot')
        .selectAll('circle')
        .data(data)
        .on('click', d => console.log([d.a, d.b]))
        .attr('cx', d => aScale(d.a))
        .attr('cy', d => bScale(d.b));


  // ****** TODO: PART IV ******





}

/**
 * Load the file indicated by the select menu
 */
function changeData() {
  let dataFile = document.getElementById('dataset').value;
  if (document.getElementById('random').checked) {
    randomSubset();
  }
  else {
    let filename = './data/' + dataFile + '.csv';
    dataset = d3.csv(filename, function(d) {
      // Convert each data item to a number.
      return { a:+d.a, b:+d.b };
    })
    // After reading the entire dataset, call update().
      .then(update);
  }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
  let dataFile = document.getElementById('dataset').value;
  if (document.getElementById('random').checked) {
    let filename = './data/' + dataFile + '.csv';
    dataset = d3.csv(filename, function(d) {
      // Convert each data item to a number.
      return { a:+d.a, b:+d.b };
    })
    .then(function(data) {
      let subset = [];
      for (let d of data) {
        if (Math.random() > 0.5) {
          subset.push(d);
        }
      }
      update(subset);
    });
  }
  else {
    changeData();
  }
}
