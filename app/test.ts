//not required, they are global
//import $ from "jquery";
//import _ from "lodash";

import {Low, LowFactory} from "lowdb";


let a : string | undefined = undefined;
let $test : JQuery = $("aaa").append("");

a = "111";
a = a+a;

$test.append("");
_.max([1,2]);

let db: Low = new LowFactory();
db.setState({test: "test"});
console.log(db.getState());