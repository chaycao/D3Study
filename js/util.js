function getCenters(features){
    var longitudeMin = 100000;//最小经度
    var latitudeMin = 100000;//最小维度
    var longitudeMax = 0;//最大经度
    var latitudeMax = 0;//最大纬度
    features.forEach(function(e){
        var a = d3.geo.bounds(e);//[[最小经度，最小维度][最大经度，最大纬度]]
        if(a[0][0] < longitudeMin) {
            longitudeMin = a[0][0];
        }
        if(a[0][1] < latitudeMin) {
            latitudeMin = a[0][1];
        }
        if(a[1][0] > longitudeMax) {
            longitudeMax = a[1][0];
        }
        if(a[1][1] > latitudeMax) {
            latitudeMax = a[1][1];
        }
    });

    var a = (longitudeMax + longitudeMin)/2;
    var b = (latitudeMax + latitudeMin)/2;

    return [a, b];
}

function getZoomScale(features, width, height){
    var longitudeMin = 100000;//最小经度
    var latitudeMin = 100000;//最小维度
    var longitudeMax = 0;//最大经度
    var latitudeMax = 0;//最大纬度
    features.forEach(function(e){
        var a = d3.geo.bounds(e);//[[最小经度，最小维度][最大经度，最大纬度]]
        if(a[0][0] < longitudeMin) {
            longitudeMin = a[0][0];
        }
        if(a[0][1] < latitudeMin) {
            latitudeMin = a[0][1];
        }
        if(a[1][0] > longitudeMax) {
            longitudeMax = a[1][0];
        }
        if(a[1][1] > latitudeMax) {
            latitudeMax = a[1][1];
        }
    });

    var a = longitudeMax-longitudeMin;
    var b = latitudeMax-latitudeMin;
    /*if(a > b) {//按照宽度进行缩放
        return width/a;
    } else {
        return height/b;
    }*/

    return Math.min(width/a, height/b);
}