class PMV {
  static fillRoots(data) {
    var root = {
      "id": -1,
      "parent": "",
      "name": "root",
      "metric": {}
    }
    data.forEach(function(d) {
      if (d.parent == "") {
        d.parent = -1;
      }
    });
    data.push(root)
    return data;
  }

  static getMetric(data, metrics) {
  // data: {
  //   "NOA": int,
  //   "NOM": int,
  //   "WLOC": int,
  //   ...
  // }

  }
}
