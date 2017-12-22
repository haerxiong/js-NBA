$(document).keyup(function(event){  
  if(event.keyCode ==13){  
    ok();
  }  
});

$(function(){
  ok();
});

function ok() {
  var teams = [];
  var teamName = document.getElementById("name").value;
  for (n in nba_teams) {
    if (teamName == nba_teams[n].name) {
      getSchedule(nba_teams[n].nameEn, function(schedule){

        $.each(schedule, function(i, s){
          $.each(nba_teams, function(j, t){
            if(s.abbr == t.abbr) {
              teams.push({"tinfo":t,"vsprofile":s.vsprofile, "time":s.time});
            }
          });
        });
        initMap(formatAry(teams));
      });
      break;
    }
  }
}

var map;

function initMap(teams) {
  if (map) {
    map.remove();
  }
  map = new jvm.Map({
    container: $('.map'),
    map: 'us_aea_en',
    labels: {
      markers: {
        render: function(index) {
          return teams[index].index;
        },
        offsets: function() {
          return [-25, -10];
        }
      }
    },
    markers: teams.map(function(item) {
      return {
        name: item.tinfo.name,
        latLng: item.tinfo.coords
      }
    }),
    series: {
      markers: [{
        attribute: 'image',
        scale: teams.reduce(function(total, cur, i) {
          total[teams[i].tinfo.abbr] = "nba/" + teams[i].tinfo.abbr + "_logo.svg";
          return total;
        }, {}),
        values: teams.reduce(function(total, cur, i) {
          total[i] = teams[i].tinfo.abbr;
          return total;
        }, {})
      }],
    }
  });
}


function formatAry(teams) {
  var newT = [];
  $.each(teams, function(i, t){

    var exists = -1;
    $.each(newT, function(j, n){
      if((exists==-1) && (t.tinfo.abbr == n.tinfo.abbr)) {
        exists = j;
      }
    });

    if(exists==-1) {
      // t["times"] = [t.time];
      t["index"] = (i+1) + t.vsprofile.displayAbbr;
      newT.push(t);
    } else {
      // newT[exists].times.push(t.time);
      newT[exists].index += "," + (i+1) + t.vsprofile.displayAbbr;
    }
  });
  return newT;
}

function getSchedule(teamName, callback) {
  var url = "/schedule?teamname="+teamName.toLowerCase();
  var dayLen = 7; // 7次比赛内赛程;
  var day = [];
  var start = false;
  $.getJSON(url, function(data) {
    $(data.payload.monthGroups).each(function(i, e){// 遍历月份
      if( start == true || compareMonth(e.number)>=0 ) {
        $(e.games).each(function(j, game){// 遍历日
          var date = new Date(game.profile.utcMillis*1);
          if(dayLen>0 && (((start == false)&&compareTime(e.number, date.getDate())>=0) || (start == true))) {
            var profile = (game.isHome=='true')?game.awayTeam.profile:game.homeTeam.profile;
            var str = (date.getMonth() + 1) + '月' + date.getDate() + '日，' 
              + (game.isHome=='true'?'主场':'客场') + 'VS' + profile.displayAbbr;
            // day.push({"abbr":profile.abbr,"time":(date.getMonth() + 1) + '月' + date.getDate() + '日'});
            day.push({"abbr":game.homeTeam.profile.abbr, "time": date, "vsprofile": profile});
            start=true;
            dayLen--;
          }
        });
      }
    });
    callback(day);
  });
}


function compareMonth(mon){
  //NBA赛程中月份先后顺序为 8 9 10 11 12 1 2 3 4 5 6 7
  // +4 对12取余，可视为大小判断 
  var cur = new Date().getMonth() + 1;
  if((mon+4)%12 > (cur+4)%12){
    return 1;
  } else if(mon == cur) {
    return 0;
  } else {
    return -1;
  }
}

function compareTime(mon, day) {
  var curD = new Date().getDate();
  var curM = new Date().getMonth() + 1;
  if(mon == curM) {
    if(curD == day) {
      return 0;
    } else if(curD < day) {
      return 1;
    } else {
      return -1;
    }
  } else {
    return compareMonth(mon);
  }
}

