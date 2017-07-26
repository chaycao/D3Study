function drawProviceMap(mapPath, svg) {
    var width  = 1000;
    var height = 1000;

    svg.attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,0)");

    var projection = d3.geo.mercator()
        .center([107, 26])
        .scale(2800)
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

        // 画省地图
        svg.selectAll("path")
            .data(states.features)
            .enter()
            .append("path")
            .attr("class","pathProvince")
            .attr("stroke", "#000")
            .attr("stroke-width", 0.3)
            .attr("d", path)
            // 对数量进行匹配，保存在number属性中
            .attr("number", function (d, i) {
                var n = 0;
                for (var j = 0; j < counts.length; j++) {
                    if(counts[j].name == d.properties.name) {
                        n = counts[j].value;
                        break;
                    }
                }
                return n;
            })
            .attr("id", function (d, i) {
                return d.properties.id;
            })
            // 填充颜色
            .style("fill", function(d, i){
                var temp_n = d3.select(this).attr("number");
                var m = compute(temp_n);
                return computeColor(m);
            })
            .on("mouseover",function(d,i){
                d3.select(this)
                    .attr("stroke", "#ee05be");
                // 添加提示信息
                var centroid = path.centroid(d);
                var x = centroid[0];
                var y = centroid[1] + 10;
                var number = d3.select(this).attr("number");
                var tooltip = d3.select("#tooltip")
                    .style("left", x + "px")
                    .style("top", y + "px");
                tooltip.select("#number").text(number);
                d3.select("#tooltip").classed("hidden", false);
            })
            .on("mouseout",function (d,i) {
                d3.select(this)
                    .attr("stroke", "#000")
                d3.select("#tooltip").classed("hidden", true);
            })
            // 点击，进入市级地图
            .on("click",function (d,i) {
                // 获得市ID
                var id = d3.select(this).attr("id");
                // 消除
                d3.select("#tooltip").classed("hidden", true);
                d3.selectAll(".city_name").remove();
                d3.selectAll(".pathProvince").remove();
                // 绘制市级地图
                console.log(id);
                drawCoutryMap(id, svg);
            })
        ;

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
    }
}

function drawCoutryMap(id, svg) {
    var width  = 1000;
    var height = 1000;

    queue()
        .defer(d3.json, "mapdata/geometryCouties/" + id + "00.json")
        .await(ready);

    function ready(error, states) {
        if (error)
            return console.error(error);
        var zoomScale = getZoomScale(states.features, width, height);
        var centers = getCenters(states.features);
        var projection = d3.geo.mercator()
            .center(centers)
            .scale(zoomScale*25)
            .translate([width/3, height/3]);
        var path = d3.geo.path()
            .projection(projection);

        // 画市地图
        svg.selectAll("path")
            .data(states.features)
            .enter()
            .append("path")
            .attr("class", "pathCountry")
            .attr("stroke", "#000")
            .attr("stroke-width", 0.3)
            .attr("d", path)
            // 填充颜色
            .style("fill", "#f8f8ff");

        //获取中心点坐标
        states.features.forEach(function (d, i) {
            var centroid = path.centroid(d);
            centroid.x = centroid[0];
            centroid.y = centroid[1];
            centroid.id = d.properties.id;
            centroid.name = d.properties.name;
            centroid.feature = d;
            provinceNodes.push(centroid);
        })

        // 加上名字
        provinceNodes.forEach(function (d) {
            svg.append("text")
                .attr("class", "city_name")
                .attr("dx", d.x)
                .attr("dy", d.y)
                .attr("text-anchor","middle")
                .attr("fill",textColor).attr("font-size","12px").attr("fill-opacity",1)
                .text(d.name);
        })

        provinceNodes.clean()
    }
}