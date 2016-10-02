//not required, they are global
//import $ from "jquery";
//import _ from "lodash";

import LowDB = require("lowdb");

let db: LowDB.Low = LowDB();
db.setState({test: "test"});
console.log(db.getState());