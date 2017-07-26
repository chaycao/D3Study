function drawMap(mapPath, svg) {
    var width  = 1000;
    var height = 1000;

    svg.attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,0)");

    var projection = d3.geo.mercator()
        .center([106, 27])
        .scale(3000)
        .translate([width/2, height/2]);

    var path = d3.geo.path()
        .projection(projection);

    queue()
        .defer(d3.json, mapPath)
        .defer(d3.csv, "selectdata/count.csv")
        .await(ready);

    var colorA = d3.rgb(255,0,0); //红色
    var colorB = d3.rgb(248,248,255); // 白色

    // computeColor(i)，i为0~1，输出colorA、colorB之间的数
    var computeColor = d3.interpolate(colorB,colorA);
    var compute = d3.scale.linear()
        .domain([0, 5000])
        .range([0, 1]);

    function ready(error, states, counts) {
        if (error)
            return console.error(error);

        // 画地图
        svg.selectAll("path")
            .data(states.features)
            .enter()
            .append("path")
            .attr("stroke", "#000")
            .attr("stroke-width", 0.3)
            .attr("d", path )
            // 填充颜色
            .style("fill", function(d, i){
                var temp_n = 1.2;
                for (var j = 0; j < counts.length; j++) {
                    if(counts[j].name == states.features[i].properties.name) {
                        temp_n = counts[j].value;
                        break;
                    }
                }
                var m = compute(temp_n);
                console.log(i)
                console.log(temp_n)
                console.log(m)
                return computeColor(m);
            })
            .on("mouseover",function(d,i){
                d3.select(this)
                    .attr("stroke", "#ee05be");
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout",function (d,i) {
                d3.select(this)
                    .attr("stroke", "#000")
            });

        //获取中心点坐标
        states.features.forEach(function (d, i) {
            var centroid = path.centroid(d);
            centroid.x = centroid[0];
            centroid.y = centroid[1];
            centroid.id = d.properties.id;
            centroid.name = d.properties.name;
            centroid.feature = d;
            nodes.push(centroid);
        })

        // 加上名字
        nodes.forEach(function (d) {
            svg.append("text")
                .attr("class", "city_name")
                .attr("dx", d.x)
                .attr("dy", d.y)
                .attr("text-anchor","middle")
                .attr("fill",textColor).attr("font-size","12px").attr("fill-opacity",1)
                .text(d.name);
        })

        console.log(states.features)
        console.log(states.features[0].properties.name);
    }


}