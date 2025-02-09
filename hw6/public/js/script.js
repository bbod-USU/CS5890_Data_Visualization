let tooltip = new Tooltip();

let votePercentageChart = new VotePercentageChart(tooltip);

let tileChart = new TileChart(tooltip);

let shiftChart = new ShiftChart();

let electoralVoteChart = new ElectoralVoteChart(shiftChart);


// Load the data corresponding to all the election years.
// Pass this data and instances of all the charts that update on year
// selection to yearChart's constructor.
d3.csv("data/yearwiseWinner.csv").then(electionWinners => {
  console.log(electionWinners);
  let yearChart = new YearChart(electoralVoteChart, tileChart,
                                votePercentageChart, electionWinners);
  yearChart.update();
});
