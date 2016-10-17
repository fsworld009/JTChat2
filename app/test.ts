//not required, they are global
//import $ from "jquery";
//import _ from "lodash";

import Lowdb = require("lowdb");

let db: Lowdb.Low = Lowdb();
db.setState({test: "test"});
console.log(db.getState());