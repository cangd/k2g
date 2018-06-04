// import some needed functionality
import http from "k6/http";
import { group, check } from "k6";

// Set some options for the test, and pass/fail thresholds
export let options = {
   vus: 10,
   duration: "5s",
   thresholds: {
      "http_req_duration{url:http://test.loadimpact.com}": [ "p(50)<100", "p(99)<150" ],
      "group_duration{group:::user scenario 1::page1}": [ "avg<500" ],
      "checks": [ "rate>0.95" ]
   }
};

// “main” function that the VUs will execute repeatedly during the test
export default function() {
   // Separate virtual user actions using groups
   group("user scenario 1", function() {
      group("page1", function() {
         check(http.get("http://test.loadimpact.com"), {
            "status is 200": (r) => r.status === 200,
            "body size is 1176 bytes": (r) => r.body.length == 1176
         });
         check(http.get("http://test.loadimpact.com/nonexistent"), {
            "status is 404": (r) => r.status === 404,
            "body size is 162 bytes": (r) => r.body.length == 162
         });
      });
      group("page2", function() {
        let res = http.get("http://httpbin.org");
            console.log("Body length: " + res.body.length),
        check(res, {
            "status of get http://httpbin.org/ is 200": (r) => r.status === 200,
            "body size is 13129 bytes": (r) => r.body.length == 13129,
        });
        let request = http.get("http://httpbin.org/get");
            console.log("Body length: " + request.body.length),
        check(request, {
            "status of get http://httpbin.org/get is 200": (r) => r.status === 200,
            "body size is 208 bytes": (r) => r.body.length == 208
         });
      });
   });
};