/** Class implementing the infoPanel view. */
class InfoPanel {
  /**
   * Creates a infoPanel Object
   */
  constructor() {
  }

  /**
   * Update the info panel to show info about the currently selected world cup
   * @param oneWorldCup the currently selected world cup
   */
  updateInfo(oneWorldCup) {

    // ******* TODO: PART III *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year
      let host = d3.select('#details').select('#host');
      let title = d3.select('#details').select('#edition');
      let winner = d3.select('#details').select('#winner');
      let runner_up = d3.select('#details').select('#silver');
      let teams = d3.select('#details').select('#teams');

      host.text(oneWorldCup['host']);
      title.text(oneWorldCup['EDITION']);
      winner.text(oneWorldCup['winner']);
      runner_up.text(oneWorldCup['runner_up']);
      let list = d3.select("#teams").selectAll('li').data(oneWorldCup.teams_names);

      let newList = list.enter()
          .append('li')
          .text((d,i) => d);
      list.exit().remove();
      list = newList.merge(list);
      list.transition()
          .duration(2000)
          .text((d,i) => d);


  }

}
