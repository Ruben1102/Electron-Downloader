var remote = require('electron').remote;
var fs = remote.require('fs');
const Path = remote.require('path');
const http = require('http');
const https = require('https');
const request = require('request');
const $ = require('cheerio');

var tt = document.getElementById('test');
var url_input = document.getElementById('url');
url_input.value = 'http://dl8.heyserver.in/film/2018-7/';
var download_button = document.getElementById('down');
var scrap_button = document.getElementById('scra');

var scrap_url;
download_button.addEventListener('click', ()=> {
    var val = url_input.value;
    download(val);
});

scrap_button.addEventListener('click', ()=> {
    var val = url_input.value;
    scrap(val);
});


function chry(html) {
    var chr = $('a', html);
    for (let i = 0; i < chr.length; i++) {
        // console.log(chr[i].attribs.href);
        var nm = chr[i].attribs.href; 
        if (nm.toString().indexOf("mkv") > -1 || nm.toString().indexOf("mp4") > -1) {
            var div = document.createElement('li');
            div.id = `scr${i}`;
            div.className = "list-group-item mov_item";
            div.addEventListener('click', function() { butclick(this) }, false);
            
            tt.append(div);
            div.innerHTML =`${chr[i].attribs.href}`;
            div.append(end_Span());
        // console.log(scrap_url+$('a', html)[i].attribs.href);
        }
    }
}

function end_Span() {
    const d_span = document.createElement('span');
    d_span.id = "dwn";
    d_span.innerHTML = '<i class="fas fa-download">';
    return d_span; 
}

var scrap = function(Url) {
    scrap_url = Url;
    // 'http://dl8.heyserver.in/film/2018-7/'
    var req = request.get(Url, function(error, response, body) {
    chry(body);
    });
}

function butclick(elem) {
    console.log(elem);
}

var download = function(url) {
    // const url = 'https://images.unsplash.com/photo-1504164996022-09080787b6b3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=markus-spiske-357131-unsplash.jpg';
    var name  = url.split('/').pop();
    var file = fs.createWriteStream(name);
    var client = http;
    
    if (url.toString().indexOf("https") === 0){
        client = https;
    }
    var request = client.get(url, function(response) {
        console.log(response.headers);
        var len = parseInt(response.headers['content-length'], 10);
        var total = len / 1048576; //1048576 - bytes in  1Megabyte
        var cur = 0;
        response.pipe(file);
        response.on('data', function(dd) {
            // console.log(bytetomb(dd.length));
            cur += dd.length;
            tt.innerHTML = name +'<br>'+"Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb\r" +"<br> With Speed of " + (dd.length / 1024).toFixed(2)+ " Kb\r"  +".<br/> Total size: " + total.toFixed(2) + " mb";
            // console.log("Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb\r" + ".<br/> Total size: " + total.toFixed(2) + " mb");
        });
    });
  }

  function bytetomb(byt) {
    return (byt/1048576);
  }


//   http://dl8.heyserver.in/film/2018-7/Marvel_s_Luke_Cage_Season_2_Official_Trailer_HD_Netflix.mp4

// download();
