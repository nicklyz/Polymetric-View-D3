var example = [
	  {"id": "1", "parent": "", "name": "Object",
	    "metrics": {
	      "NOPA": 1,
	      "NOM": 1,
	      "WLOC": 3,
	      "NOPA": 11,
	      "CC": 1,
	    }
	  },
	  {"id": "2", "parent": "1", "name": "String",
	    "metrics": {
	      "NOPA": 2,
	      "NOM": 3,
	      "WLOC": 5,
	      "NOPA": 9,
	      "CC": 5,
	    }
	  },
	  {"id": "3", "parent": "1", "name": "List",
	    "metrics": {
	      "NOPA": 5,
	      "NOM": 7,
	      "WLOC": 8,
	      "NOPA": 3,
	      "CC": 10,

	    }
	  },
	  {"id": "4", "parent": "3", "name": "LinkedList",
	    "metrics": {
	      "NOPA": 7,
	      "NOM": 9,
	      "WLOC": 10,
	      "NOPA": 4,
	      "CC": 15,
	    }
	  },
	  {"id": "5", "parent": "3", "name": "ArrayList",
	    "metrics": {
	      "NOPA": 9,
	      "NOM": 13,
	      "WLOC": 12,
	      "NOPA": 4,
	      "CC": 20,
	    }
	  },
	  {"id": "6", "parent": "", "name": "NULL",
	    "metrics": {
	      "NOPA": 12,
	      "NOM": 17,
	      "WLOC": 19,
	      "NOPA": 4,
	      "CC": 25,
	    }
	  }
	];



	for (i = 0; i < example.length; i++){
		console.log(i/20)


	}