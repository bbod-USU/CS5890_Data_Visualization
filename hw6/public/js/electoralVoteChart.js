
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;

        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)
        ;

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

    update (electionResult, colorScale){

        // ******* TODO: PART II *******

        //Group the states based on the winning party for the state;
        //then sort them based on the margin of victory

        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .electoralVotes class to style your bars.

        //Display total count of electoral votes won by the Democrat and Republican party
        //on top of the corresponding groups of bars.
        //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        //Just above this, display the text mentioning the total number of electoral votes required
        // to win the elections throughout the country
        //HINT: Use .electoralVotesNote class to style this text element

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

        this.svg.selectAll("*").remove();

        let allVotes = 0;
        let independentParty = [];
        let democratParty = [];
        let republicanParty = [];

        electionResult.forEach(d => {
            if(d.RD_Difference < 0) democratParty.push(d);
            else if (d.RD_Difference > 0) republicanParty.push(d);
            else independentParty.push(d);
        });

        democratParty.sort((a, b) => a.RD_Difference - b.RD_Difference);
        republicanParty.sort((a, b) => a.RD_Difference - b.RD_Difference);
        independentParty.sort((a, b) => b.Total_EV - a.Total_EV);


        let sortedData = [];
        sortedData = sortedData.concat(independentParty);
        sortedData = sortedData.concat(democratParty);
        sortedData = sortedData.concat(republicanParty);

        let xCoordinates = [];
        sortedData.forEach(d => {
            xCoordinates.push(allVotes);
            allVotes += parseInt(d.Total_EV);
        });

        let electoralVoteScale = d3.scaleLinear()
            .domain([0, allVotes])
            .range([0, this.svgWidth]);

        let electoralVoteChart = this.svg
            .selectAll("rect")
            .data(sortedData)
            .enter();

        electoralVoteChart
            .append("rect")
            .attr("width", d => this.svgWidth * d.Total_EV / allVotes)
            .attr("height", 20)
            .attr("x", (_, i) => electoralVoteScale(xCoordinates[i]))
            .attr("y", 50)
            .attr("fill", d => d.RD_Difference === "0" ? "green" : colorScale(d.RD_Difference))
            .attr("class", "electoralVotes");

        electoralVoteChart
            .append("text")
            .text(d => d.I_EV_Total)
            .attr("y", 50)
            .attr("class", "electoralVoteText independent");

        electoralVoteChart
            .append("text")
            .text(d => d.D_EV_Total)
            .attr("y", 50)
            .attr("dx", d => d.I_EV_Total === "" ? 0 : 120)
            .attr("class", "electoralVoteText democrat");

        electoralVoteChart
            .append("text")
            .text(d => d.R_EV_Total)
            .attr("y", 50)
            .attr("dx", this.svgWidth)
            .attr("class", "electoralVoteText republican");

        electoralVoteChart
            .append("line")
            .attr("x1", this.svgWidth/2)
            .attr("y1", 50)
            .attr("x2", this.svgWidth/2)
            .attr("y2", 50)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("class", "middlePoint");


        electoralVoteChart
            .append("text")
            .text(d => `Electoral Vote (` + Math.abs(d.R_EV_Total - d.D_EV_Total + 1).toString() + `) needed to win)`)
            .attr('y', 45)
            .attr("dx", this.svgWidth/2 - 140)
            .attr("font-size", 16)

        //******* TODO: PART V *******
        //Implement brush on the bar chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.

    };


}
