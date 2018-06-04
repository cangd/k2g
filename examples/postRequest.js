import http from "k6/http";
import { check, fail } from "k6";

export default function() {
    var baseURL = "https://api-stg1.video-cdn.net/v1/vms/";
    var formdata = {
        "username": "team.qa@movingimage.com",
        "password": "M+1YL45zcF8="
    }
    var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    var res = http.post(baseURL + "/auth/login", JSON.stringify(formdata), { headers: headers });
 
    check(res, {
        "status was 200": (r) => r.status === 200,
        "Valid for videomanager": (r) => JSON.parse(r.body).validForVideoManager == 2
    });   

};

