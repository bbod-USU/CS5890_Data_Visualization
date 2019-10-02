/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        d3.select("#points")
            .selectAll("circle")
            .remove();
        d3.select("#map")
            .selectAll("path")
            .classed("gold", false)
            .classed("host", false)
            .classed("team", false)
            .classed("silver", false);

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        d3.select("#" + worldcupData.host_country_code)
            .classed("host", true);
        // Iterate through all participating teams and change their color as well.
        for (let i = 0; i < worldcupData.teams_names.length; i++) {
            d3.select("#" + worldcupData.teams_iso[i])
                .classed("team", true);
        }

        let projection = this.projection;
        let points = d3.select("#points");
        points.append("circle")
            .classed("gold", "true")
            .attr("r", 15)
            .attr("transform", (d, i) => "translate(" + projection(worldcupData.win_pos) + ")");


        points.append("circle")
            .classed("silver", "true")
            .attr("r", 15)
            .attr("transform", (d, i) => "translate(" + projection(worldcupData.ru_pos) + ")")


    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {


        let path = d3.geoPath().projection(this.projection);
        d3.select("#map")
            .selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr("id", d => d.id)
            .attr("d", path)
            .classed("countries", true);


        var geograt = d3.geoGraticule();
        d3.select("#map").append("path")
            .datum(geograt)
            .attr("d", path)

            .attr("class", "grat");

    }

}
