var example = [
  {"id": "1", "parent": "", "name": "Object",
    "metric": {
      "NOA": "12",
      "NOM": "34",
      "WLOC": "333",
    }
  },
  {"id": "2", "parent": "1", "name": "String",
    "metric": {
      "NOA": "12",
      "NOM": "2",
      "WLOC": "333",
    }
  },
  {"id": "3", "parent": "1", "name": "List",
    "metric": {
      "NOA": "12",
      "NOM": "100",
      "WLOC": "333",
    }
  },
  {"id": "4", "parent": "3", "name": "LinkedList",
    "metric": {
      "NOA": "12",
      "NOM": "34",
      "WLOC": "333",
    }
  },
  {"id": "5", "parent": "3", "name": "ArrayList",
    "metric": {
      "NOA": "12",
      "NOM": "34",
      "WLOC": "333",
    }
  },
  {"id": "6", "parent": "", "name": "NULL",
    "metric": {
      "NOA": "12",
      "NOM": "34",
      "WLOC": "333",
    }
  }
];


var w = 940,
    h = 300,
    pad = 20,
    left_pad = 100;

var svg = d3.select("#body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

var x = d3.scale.linear().domain([0, 23]).range([left_pad, w-pad]),
    y = d3.scale.linear().domain([0, 6]).range([pad, h-pad*2]);






























