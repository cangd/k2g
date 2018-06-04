**Loadtests with K6**

## 1. Setup this repo
You can choose to either build your tests and k6 on your local machine or just use the image from docker hub. 

Here are the some variants:


###Variant 1 - Build on your local machine

``` Shell
docker build -t loadtests .
```

Running example:

``` Shell
docker run -e env="qa" -e VIDEOID="twentytwocharacters123" loadtests run analytics/ingestEvents/view.js
```

###If you run an analytics local setup:

Add your minikube IPs and ports of your event ingester and query service as env variables. 

``` Shell
docker run -e CURL="https://127.0.0.1:30101" --net host loadtests run analytics/ingestEvents/play.js
```


``` Shell
docker run -e QUERYURL="https://127.0.0.1:8090" --net host loadtests run analytics/queryApi/query.js
```


#####Make sure to always build your image when using this variant.

###Variant 2 - Run docker image from docker hub + vol. mount


``` Shell
docker run -i -e env="qa" -v $(pwd):/srv loadimpact/k6 run /srv/analytics/ingestEvents/play.js
```

#####This variant offers you not to always build before you run, because of mounting. This would also work if you choose variant 3

###Variant 3 - install k6 locally (currently only Mac)


``` Shell
brew tap loadimpact/k6
brew install k6
```

Source: https://docs.k6.io/docs/installation


Running example:

``` Shell
env="qa" RANDOMIDS=low k6 run --vus 5 --iterations 500 analytics/ingestEvents/play.js
```

##2. Optional parameters

Optional parameters are usually set within this block in each file

```JS
export let options = {
  vus: 1,
  iterations: 100,
  duration: "5s",
};
```

But you can overwrite them when executing the load test from shell with following parameters:

1. --vus
2. --iterations
3. --duration [unit: s/m/h]

Here are some examples:

```shell
docker run loadtests run --vus 100 --iterations 9000 analytics/ingestEvents/views/view.js
```
```shell
docker run loadtests run --vus 100 --duration 1m analytics/ingestEvents/plays/play.js
```
```shell
docker run -i -e env="qa" -v $(pwd):/srv loadimpact/k6:0.19.0 run --iterations 9000 --vus 100 /srv/analytics/ingestEvents/play.js
```

##Environment variables

Current tests run against following environment variables

If you wish to run that your tests against another variables like **videoId** or **url** then you just have to make use of **docker run -e**

```shell
docker run -e VIDEOID="twentytwocharacters123" -e CURL="https://c-qa1.video-cdn.net" loadtests run --vus 100 --iterations 9000 analytics/ingestEvents/views/view.js
```

Alternatively you can just choose *qa* or *live* - see the helper/environment.js to see which env vars can be set

```shell
docker run -e env="qa" loadtests run analytics/ingestEvents/view.js
docker run -e env="prod" loadtests run analytics/ingestEvents/view.js
```

Following env variables can be set

* VIDEOID (string, can contain multiple videoIds separated with comma, default: 'thisistestcangcang1234')
* CURL (string, default: 'https://c-qa1.video-cdn.net')
* QUERYURL (string, default: 'https://analytics-api-qa.internal.video-cdn.net')
* RANDOMIDS (string: fine or low, either create super random ids or random ids of a subset of predefined strings + two random ints)
* env (string, "qa" or "prod" - used in where to ingest events or to query the analytics API)
* STARTDATE (string, default: "2018-01-01" - used in the query service)
* ENDDATE (string, default: "2028-01-01" - used in the query service)
* DIMENSION (string, default: "DAY" - used in the query service)
 
