import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
    stages: [
        { duration: "10s", target: 10 }
    ],
    thresholds: {
        http_req_duration: ["p(50)<100", "p(95)<5"]
    }
};

export default function() {
    let res = http.get("http://test.loadimpact.com/");
    check(res, {
        "is status 200": (r) => r.status === 200
    });
    sleep(30);
};