主要：
  实践了jVectorMap的地图展示效果

次要：
  使用thinkjs搭建服务器，包装API数据来源
  

以下为thinkjs安装过程，没有使用数据库，实时抓取网络数据，安装后访问
http://localhost:8360/static/nbaMap/test/nba.html
输入球队名称，地图上展示今后7个比赛日的地点及对手。

---------------------------------------------------------------------------

Application created by [ThinkJS](http://www.thinkjs.org)

## Install dependencies

```
npm install
```

## Start server

```
npm start
```

## Deploy with pm2

Use pm2 to deploy app on production enviroment.

```
pm2 startOrReload pm2.json
```
------------------------------------------------------------------------
