const path = require('path');
const url = require('url');
const Swal = require('sweetalert2');
var {Howl, Howler} = require('howler');
const got = require('got');
const cheerio = require('cheerio');
const io = require('socket.io-client');
const { HLTV } = require('hltv');
const customTitlebar = require('custom-electron-titlebar');

new customTitlebar.Titlebar({
	backgroundColor: customTitlebar.Color.fromHex('#444'),
	titleHorizontalAlignment: 'left',
	icon: url.format(path.join(__dirname, '/icon', '/iconMain.png'))
});
document.querySelector(".menubar").remove();

const matchContainer = document.getElementById("matchCSGOContainer");
const liveMatchContainer = document.getElementById("liveMatchCSGOContainer");
const matchDota2Container = document.getElementById("matchDOTA2Container");
const liveMatchDota2Container = document.getElementById("liveMatchDOTA2Container");
const btn_settings = document.querySelector(".btn-settings");
const csgo_container = document.querySelector(".csgo_container");
const dota2_container = document.querySelector(".dota2_container");
const btn_csgo = document.querySelector(".btn_csgo");
const btn_dota2 = document.querySelector(".btn_dota2");

var mapsObject = {
	"mrg": "Mirage",
	"nuke": "Nuke",
	"d2": "Dust 2",
	"inf": "Inferno",
	"-": "Default",
	"vertigo": "Vertigo",
	"ovp": "Overpass",
	"trn": "Train",
	"cch": "Cache",
	"vtg": "Vertigo",
	"cbl": "Cobblestone",
	"ancient": "Ancient"
};
var mapImg = {
	"mrg": "https://hltv.org/img/static/maps/mirage.png",
	"nuke": "https://hltv.org/img/static/maps/nuke.png",
	"d2": "https://hltv.org/img/static/maps/dust2.png",
	"inf": "https://hltv.org/img/static/maps/inferno.png",
	"-": "https://hltv.org/img/static/maps/default.png",
	"vertigo": "https://hltv.org/img/static/maps/vertigo.png",
	"ovp": "https://hltv.org/img/static/maps/overpass.png",
	"trn": "https://hltv.org/img/static/maps/train.png",
	"cch": "https://hltv.org/img/static/maps/cache.png",
	"vtg": "https://hltv.org/img/static/maps/vertigo.png",
	"cbl": "https://hltv.org/img/static/maps/cobblestone.png",
	"ancient": "https://hltv.org/img/static/maps/ancient.png"
};

var sound = new Howl({
 	src: ['../sound/papich.mp3']
});
var soundChangeScoreHLTV = new Howl({
	src: ['../sound/change_score_hltv.mp3']
});
var soundChangeScoreCrossBet = new Howl({
	src: ['../sound/change_score_crossbet.mp3']
});

btn_settings.onclick = (event) => {
	modalSettingWindow();
};

function getChromiumExecPath(){
  	return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
};

if(localStorage.getItem('last_time') == null) localStorage.setItem('last_time', 5);
if(localStorage.getItem('windows_notification') == null) localStorage.setItem('windows_notification', 1);
if(localStorage.getItem('programm_notification') == null) localStorage.setItem('programm_notification', 1);
if(localStorage.getItem('sound_score_change') == null) localStorage.setItem('sound_score_change', 1);

function displayNone(){
	if(btn_csgo.hasAttribute("checked")){
		btn_csgo.style.cssText = "background-color: #7f00ff;";
		csgo_container.style.display = "block";
		dota2_container.style.display = "none";
	};
	if(btn_dota2.hasAttribute("checked")){
		btn_dota2.style.cssText = "background-color: #7f00ff;";
		dota2_container.style.display = "block";
		csgo_container.style.display = "none";
	};
};
displayNone();

btn_csgo.onclick = (event) => {
	gameSwitcher(event.target);
};

btn_dota2.onclick = (event) => {
	gameSwitcher(event.target);
};

function gameSwitcher(et){
	switch(et.classList[2]){
		case "btn_csgo":
			if(!et.hasAttribute("checked")){
				et.setAttribute("checked", "");
				et.style.cssText = "background-color: #7f00ff;";
			};

			if(btn_dota2.hasAttribute("checked")){
				btn_dota2.removeAttribute("checked");
				btn_dota2.style.cssText = "background-color: white;";
			};

			displayNone();
			break;

		case "btn_dota2":
			if(!et.hasAttribute("checked")){
				et.setAttribute("checked", "");
				et.style.cssText = "background-color: #7f00ff;";
			};

			if(btn_csgo.hasAttribute("checked")){
				btn_csgo.removeAttribute("checked");
				btn_csgo.style.cssText = "background-color: white;";
			};

			displayNone();
			break;	
	};
};

var headers = {
	headers: {
		"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
	    "accept-encoding": "gzip, deflate",
	    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
	    "cache-control": "max-age=0",
	    "referer": "https://www.hltv.org/",
	    "sec-fetch-dest": "document",
	    "sec-fetch-mode": "navigate",
	    "sec-fetch-site": "same-origin",
	    "sec-fetch-user": "?1",
	    "upgrade-insecure-requests": "1",
	    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36"
	}
};

async function mainCheckedMatchesCSGO(){
	try{
		const { body } = await got('https://www.hltv.org/matches', headers);
		var $ = cheerio.load(body);

		var liveMatchesCSGO = await $(".liveMatch").map(function(){
			var live_match = {};
			live_match.bo = $(this).find(".matchMeta").html() == "bo1" ? "Best of 1" : $(this).find(".matchMeta").html() == "bo3" ? "Best of 3" : $(this).find(".matchMeta").html() == "bo5" ? "Best of 5" : $(this).find(".matchMeta").html();
			var teams = $(this).find(".matchTeam").map(function(){
				var team = {};
				team.team = $(this).find(".matchTeamName").html();
				team.logoTeam = $(this).find(".matchTeamLogoContainer").find("img").attr("src");
				team.team_id = $(this).find(".currentMapScore").data("livescore-team");
				return team;
			}).get();
			live_match.eventName = $(this).find(".matchEventName").html();
			live_match.eventLogo = $(this).find(".matchEventLogoContainer > img").attr("src");
			live_match.matchId = $(this).attr("data-livescore-match");
			live_match.teams = teams;
			live_match.map_pool = $(this).parent().attr("data-maps");
			live_match.match_rating = $(this).find(".matchRating").find("i").map(function(){
				if(!$(this).hasClass("faded")){
					var stars = {};
					stars.star_length = $(this).html();
					return stars;
				};
			}).get();
			return live_match;
		}).get();

		var upcomingMatchesCSGO = await $(".upcomingMatchesSection").first().find(".upcomingMatch").map(function(){
			if($(this).find(".matchTeams").length != 0){
				var upcoming_match = {};
				upcoming_match.bo = $(this).find(".matchMeta").html() == "bo1" ? "Best of 1" : $(this).find(".matchMeta").html() == "bo3" ? "Best of 3" : $(this).find(".matchMeta").html() == "bo5" ? "Best of 5" : $(this).find(".matchMeta").html();
				upcoming_match.unix_time = $(this).attr("data-zonedgrouping-entry-unix");
				upcoming_match.eventName = $(this).find(".matchEventName").html();
				upcoming_match.eventLogo = $(this).find(".matchEventLogoContainer > img").attr("src");
				upcoming_match.team1 = $(this).find(".team1").children().length >= 2 ? $(this).find(".team1 > .matchTeamName").html() : $(this).find(".team1 > .team").html();
				upcoming_match.team2 = $(this).find(".team2").children().length >= 2 ? $(this).find(".team2 > .matchTeamName").html() : $(this).find(".team2 > .team").html();
				upcoming_match.logoTeam1 = $(this).find(".team1").children().length >= 2 ? $(this).find(".team1 > .matchTeamLogoContainer > img").attr("src") : "https://img.icons8.com/dusk/64/000000/question-mark";
				upcoming_match.logoTeam2 = $(this).find(".team2").children().length >= 2 ? $(this).find(".team2 > .matchTeamLogoContainer > img").attr("src") : "https://img.icons8.com/dusk/64/000000/question-mark";
				upcoming_match.team1_id = $(this).has("team1") ? $(this).attr("team1") : "0";
				upcoming_match.team2_id = $(this).has("team2") ? $(this).attr("team2") : "0";
				upcoming_match.match_rating = $(this).find(".matchRating").find("i").map(function(){
					if(!$(this).hasClass("faded")){
						var stars = {};
						stars.star_length = $(this).html();
						return stars;
					};
				}).get();
				return upcoming_match;
			};
		}).get();

		return {liveMatchesCSGO, upcomingMatchesCSGO};

	}catch(e){
		console.log("ERROR", e);
	};
};

/*----------- DOTA ------------*/
// async function mainCheckedMatchDota(){
// 	try{
// 		const { body } = await got('https://dltv.org/matches', headers);
// 		var $ = cheerio.load(body);
// 		//console.log($.cookie);

// 		var liveMatchDota = $("#live-matches").find(".live-matches-row").map(function(){
// 			var live_match = {};
// 			live_match.serie_id = $(this).attr("data-serie-id");
// 			live_match.match_id = $(this).attr("data-match-id");
// 			return live_match
// 		}).get();

// 		var upcomingMatchesDota = $(".jsComingMatches").find(".live-matches-row").map(function(){
// 			let now = new Date();
// 			let day = (+now.getDate() < 10) ? `0${now.getDate()}` : now.getDate();
// 			let nowDate = `${now.getFullYear()}-${now.getMonth() + 1}-${day}`;
// 			if($(this).attr("data-matches-odd").split(" ")[0] == nowDate){
// 				var upcoming_match = {};
// 				upcoming_match.eventName = $(this).find(".event-date > a").html(),
// 				upcoming_match.eventLogo = "",
// 				upcoming_match.team1 = $(this).find(".teams-date__left > a > .team-name").html(),
// 				upcoming_match.logoTeam1 = $(this).find(".jsFirstTeamLogo > img").attr("src"),
// 				upcoming_match.team2 = $(this).find(".teams-date__right > .name > div").html(),
// 				upcoming_match.logoTeam2 = $(this).find(".jsSecondTeamLogo > img").attr("src"),
// 				upcoming_match.fullTime = $(this).attr("data-matches-odd"),
// 				upcoming_match.time = $(this).find(".teams-date > .date > a > span").html().split(" ")[1],
// 				upcoming_match.bo = $(this).find(".type-date > .text").html()
// 				return upcoming_match;
// 			};
// 		}).get();
// 		return {liveMatchDota, upcomingMatchesDota};
// 	}catch(e){
// 		console.log("ERROR", e);
// 	};
// };
/*-----------------------------*/

async function updateMatchesCSGO(){
	var date = await mainCheckedMatchesCSGO();
	if(matchContainer.children.length != 0) $(matchContainer).empty();
	var pn = {
		programm_notification_csgo: []
	};
	if(date.liveMatchesCSGO.length == 0){
		$(liveMatchContainer).empty();
		let create = document.createElement("div");
		create.className = `alert alert-info non-live-match`;
		create.style.cssText = 'margin: 5px;';
		create.innerHTML = `<h4>No live matches</h4>`;
		liveMatchContainer.append(create);
	}else{
		if(liveMatchContainer.querySelector(".non-live-match") != null) liveMatchContainer.querySelector(".non-live-match").remove();
		var d = [];
		date.liveMatchesCSGO.map(item => d.push(item.matchId));
		date.liveMatchesCSGO.map((item, index) => {
			if(liveMatchContainer.children.length != 0){
				var existingMatchId = liveMatchContainer.querySelectorAll(".live_match");
				var e = [];
				for(let i = 0; i < existingMatchId.length; i++){
					var matchId = existingMatchId[i];
					if(d.indexOf(matchId.getAttribute("data-id")) == -1) matchId.parentElement.parentElement.remove();	
					else e.push(matchId.getAttribute("data-id"));
				};

				if(e.indexOf(item.matchId) == -1) update(item, index);
			}else{
				update(item, index);
			};
		});

		function update(it, ind){
			let iconStar = "";
			if(it.match_rating.length != 0){
				for(let i = 0; i < it.match_rating.length; i++){
					iconStar += `<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="color: #fbff00;">
								  	<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
								</svg>`;
				};
			};
			var placeholdersvg1 = it.teams[0].logoTeam.includes("placeholder.svg") ? `https://www.hltv.org${it.teams[0].logoTeam}` : it.teams[0].logoTeam;
			var placeholdersvg2 = it.teams[1].logoTeam.includes("placeholder.svg") ? `https://www.hltv.org${it.teams[1].logoTeam}` : it.teams[1].logoTeam;
			let create = document.createElement("div");
			create.className = "container";
			create.style.cssText = "margin: 2px 0;";
			create.innerHTML = `<div class="row justify-content-center">
									<div class="alert alert-info live_match" data-id="${it.matchId}" style="width: 100%;">
										<div class="background_image" style="background-size: cover; background-position: center; opacity: .5; width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></div>
										<div class="live_event" style="position: relative;">
											<div class="live_event_header">
												<img class="live_eventLogo" src=${it.eventLogo.includes('noLogo') ? 'https://www.hltv.org/img/static/event/logo/noLogo.svg' : it.eventLogo} alt=${it.eventName} style="margin-right: 10px;"/>
												<h4 class="live_eventName">${it.eventName}</h4>
											</div>
											<div class="live_event_footer">
												<p class="eventLive" style="background-color: red; color: white; border-radius: 3px; padding: 0 5px; text-align: center;">LIVE</p>
												<p class="mapNumber" style="color: white; background-color: red; padding: 0 5px; border-radius: 5px; text-align: center;"></p>
												<p class="eventBO" style="text-align: center;">${it.bo}</p>
											</div>
										</div>
										<hr style="position: relative;">
										<div class="matchRating" style="text-align: center; position: relative;">
											${iconStar}
										</div>
										<div class="liveMatchTeams" style="position: relative; margin-top: 5px;">
											<div class="col-4 team1" id="${it.teams[0].team}" data-team-id="${it.teams[0].team_id}" title="${it.teams[0].team}" onclick="getTeamInfo(${it.teams[0].team_id})" data-toggle="modal" data-target="#modal-team-info" style="flex-direction: column; cursor: pointer;">
												<img class="teamLogo" src=${placeholdersvg1} alt="${it.teams[0].team}"/>
												<p class="teamName">${it.teams[0].team}</p>
												<p class="pick_team"></p>
											</div>
											<div class="col-4 liveScore" style="text-align: center; margin-top: 10px;">
												<div class="liveScore_hltv" style="display: block;">
													<img class="logo_hltv" src="https://liquipedia.net/commons/images/7/7c/HLTV_2017logo.png" alt="HLTV" style="position: absolute; width: 50px; height: 22px; top: 0%; left: 50%; transform: translate(-50%, -70%);"/>
													<p class="score" style="font-size: 25px; font-weight: 700;"></p>
													<small class="scoreMap" style="font-weight: 700;"></small>
													<button type="button" class="btn btn-outline-dark swap_hltv" style="position: absolute; border: none; padding: 5px; top: 0; left: 100%; transform: translate(-70%, 25%);">
														<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-right-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
														  	<path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
														</svg>
													</button>
												</div>
												<div class="liveScore_crossbet" style="display: none;">
													<img class="logo_hltv" src="https://cdn.discordapp.com/attachments/742440145307041812/775049655217291307/logo_v2.png" alt="crossBet" style="position: absolute; width: 80px; height: 40px; top: 0%; left: 50%; transform: translate(-52%, -55%);"/>
													<p class="score" style="font-size: 25px; font-weight: 700;">0 : 0</p>
													<small class="scoreMap" style="font-weight: 700;">0 : 0</small>
													<button type="button" class="btn btn-outline-dark swap_crossbet" style="position: absolute; border: none; padding: 5px; top: 0; left: 0; transform: translate(-30%, 25%);">
														<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-left-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
														  	<path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
														</svg>
													</button>
												</div>
											</div>
											<div class="col-4 team2" id="${it.teams[1].team}" data-team-id="${it.teams[1].team_id}" title="${it.teams[1].team}" onclick="getTeamInfo(${it.teams[1].team_id})" data-toggle="modal" data-target="#modal-team-info" style="flex-direction: column; cursor: pointer;">
												<img class="teamLogo" src=${placeholdersvg2} alt="${it.teams[1].team}"/>
												<p class="teamName">${it.teams[1].team}</p>
												<p class="pick_team"></p>
											</div>
										</div>
										<div class="winLive" style="margin: 10px 0 20px 0; display: flex; position: relative;">
											<div class="win_team1" style="width: 33%; background-color: green; height: 10px;"></div>
											<div class="win" style="width: 33%; background-color: white; height: 10px;"></div>
											<div class="win_team2" style="width: 33%; background-color: yellow; height: 10px;"></div>
										</div>
										<div class="match-info collapse" id="collapse_${it.matchId}" style="position: relative;">
											<div class="block-info-1">
												<div class="container scoreboard-teams-${it.matchId}">
													<div class="row" style="margin-bottom: 5px;">
														<div class="col-12 team1" style="padding: 0;">
															<table width="100%" style="overflow: hidden; border-radius: 5px;">
																<tr class="table-row-header" style="background-color: #8a7070;">
																	<td style="width: 60%;"><p class="players_team" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p>$</p></td>
																	<td><p>K</p></td>
																	<td><p>D</p></td>
																	<td><p>A</p></td>
																	<td><p>KD</p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_0" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_0"></p></td>
																	<td><p class="player_kill_0"></p></td>
																	<td><p class="player_death_0"></p></td>
																	<td><p class="player_assist_0"></p></td>
																	<td><p class="player_kd_0"></p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_1" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_1"></p></td>
																	<td><p class="player_kill_1"></p></td>
																	<td><p class="player_death_1"></p></td>
																	<td><p class="player_assist_1"></p></td>
																	<td><p class="player_kd_1"></p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_2" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_2"></p></td>
																	<td><p class="player_kill_2"></p></td>
																	<td><p class="player_death_2"></p></td>
																	<td><p class="player_assist_2"></p></td>
																	<td><p class="player_kd_2"></p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_3" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_3"></p></td>
																	<td><p class="player_kill_3"></p></td>
																	<td><p class="player_death_3"></p></td>
																	<td><p class="player_assist_3"></p></td>
																	<td><p class="player_kd_3"></p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_4" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_4"></p></td>
																	<td><p class="player_kill_4"></p></td>
																	<td><p class="player_death_4"></p></td>
																	<td><p class="player_assist_4"></p></td>
																	<td><p class="player_kd_4"></p></td>
																</tr>
															</table>
														</div>
													</div>
													<div class="row">
														<div class="col-12 mapHistory">
															<div class="f_half" style="position: relative;"></div>
															<div class="s_half"></div>
														</div>
													</div>
													<div class="row">
														<div class="col-12 team2" style="padding: 0;">
															<table width="100%" style="overflow: hidden; border-radius: 5px;">
																<tr class="table-row-header" style="background-color: #8a7070;">
																	<td style="width: 60%;"><p class="players_team" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p>$</p></td>
																	<td><p>K</p></td>
																	<td><p>D</p></td>
																	<td><p>A</p></td>
																	<td><p>KD</p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_0" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_0"></p></td>
																	<td><p class="player_kill_0"></p></td>
																	<td><p class="player_death_0"></p></td>
																	<td><p class="player_assist_0"></p></td>
																	<td><p class="player_kd_0"></p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_1" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_1"></p></td>
																	<td><p class="player_kill_1"></p></td>
																	<td><p class="player_death_1"></p></td>
																	<td><p class="player_assist_1"></p></td>
																	<td><p class="player_kd_1"></p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_2" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_2"></p></td>
																	<td><p class="player_kill_2"></p></td>
																	<td><p class="player_death_2"></p></td>
																	<td><p class="player_assist_2"></p></td>
																	<td><p class="player_kd_2"></p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_3" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_3"></p></td>
																	<td><p class="player_kill_3"></p></td>
																	<td><p class="player_death_3"></p></td>
																	<td><p class="player_assist_3"></p></td>
																	<td><p class="player_kd_3"></p></td>
																</tr>
																<tr style="background-color: #bfb2b2;">
																	<td><p class="player_nick_4" style="text-align: left; margin-left: 2px;"></p></td>
																	<td><p class="player_money_4"></p></td>
																	<td><p class="player_kill_4"></p></td>
																	<td><p class="player_death_4"></p></td>
																	<td><p class="player_assist_4"></p></td>
																	<td><p class="player_kd_4"></p></td>
																</tr>
															</table>
														</div>
													</div>
												</div>
											</div>
											<div class="block-info-2" style="margin: 15px 0; background-color: #bfb2b2; padding: 2px; border-radius: 10px;"></div>
										</div>
										<button class="btn btn-outline-secondary btn-match-info down" type="button" data-toggle="collapse" data-target="#collapse_${it.matchId}" aria-expanded="false" aria-controls="collapseExample" style="position: absolute; background-image: url(../icon/bootstrap-icons-1.1.0/chevron-double-down.svg); background-size: 25px; background-repeat: no-repeat; background-position: center center; width: 50px; height: 25px; top: 100%; left: 50%; transform: translate(-50%, -100%); border-top-left-radius: 100%; border-top-right-radius: 100%;">
										</button>
									</div>
								</div>`;
			liveMatchContainer.append(create);

			connectToScorebotCSGO(it.matchId, it.bo, `${it.teams[0].team} vs ${it.teams[1].team}`);

			var btn_match = document.querySelector(`[data-id = "${it.matchId}"]`);
			btn_match.querySelector(".swap_hltv").onclick = () => {
				btn_match.querySelector(".liveScore_hltv").style.display = "none";
				btn_match.querySelector(".liveScore_crossbet").style.display = "block";
			};
			btn_match.querySelector(".swap_crossbet").onclick = () => {
				btn_match.querySelector(".liveScore_crossbet").style.display = "none";
				btn_match.querySelector(".liveScore_hltv").style.display = "block";
			};

			btn_match.querySelector(".btn-match-info").onclick = () => {
				if(btn_match.querySelector(".btn-match-info").classList.contains("down")){
					btn_match.querySelector(".btn-match-info").classList.remove("down");
					btn_match.querySelector(".btn-match-info").classList.add("up");
					btn_match.querySelector(".btn-match-info").style.backgroundImage = "url(../icon/bootstrap-icons-1.1.0/chevron-double-up.svg)";
				}else{
					btn_match.querySelector(".btn-match-info").classList.remove("up");
					btn_match.querySelector(".btn-match-info").classList.add("down");
					btn_match.querySelector(".btn-match-info").style.backgroundImage = "url(../icon/bootstrap-icons-1.1.0/chevron-double-down.svg)";
				};
			};
		};
	};
	if(date.upcomingMatchesCSGO.length == 0){
		let create = document.createElement("div");
		create.className = `alert alert-info no-match`;
		create.style.cssText = 'margin: 5px;';
		create.innerHTML = `<h4>No matches today</h4>`;
		matchContainer.append(create);
	}else{
		if(matchContainer.querySelector(".no-match") != null) matchContainer.querySelector(".no-match").remove();
		date.upcomingMatchesCSGO.map((item, index) => {
			let timer = timeLast(item.unix_time);
			let time_start = timeStartMatch(item.unix_time);
			let swap_alert_color = index % 2 == 0 ? "alert-dark" : "alert-primary";
			let iconStar = "";
			if(item.match_rating.length != 0){
				for(let i = 0; i < item.match_rating.length; i++){
					iconStar += `<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="color: #fbff00;">
								  	<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
								</svg>`;
				};
			};
			var placeholdersvg1 = item.logoTeam1.includes("placeholder.svg") ? `https://www.hltv.org${item.logoTeam1}` : item.logoTeam1;
			var placeholdersvg2 = item.logoTeam2.includes("placeholder.svg") ? `https://www.hltv.org${item.logoTeam2}` : item.logoTeam2;
			let create = document.createElement("div");
			create.className = "container";
			create.style.cssText = 'margin: 2px 0;';
			create.innerHTML = `<div class="row">
									<div class="alert ${swap_alert_color} match_${index}" style="width: 100%;">
										<div class="event_${index}">
											<div class="timeLast">
												Left: ${timer.h}h ${timer.m < 0 ? "0" : timer.m}m
											</div>
											<div class="event_header">
												<img class="eventLogo" src=${item.eventLogo.includes('noLogo') ? 'https://www.hltv.org/img/static/event/logo/noLogo.svg' : item.eventLogo} alt=${item.eventName} style="margin-right: 10px;"/>
												<h4 class="eventName">${item.eventName}</h4>
											</div>
											<div class="event_footer">
												<p class="eventTime">${time_start}</p>
												<p class="eventBO">${item.bo}</p>
											</div>
										</div>
										<hr>
										<div class="matchRating" style="text-align: center;">
											${iconStar}
										</div>
										<div class="matchTeams" style="margin-top: 5px;">
											<div class="col-5 team1" title=${item.team1} data-team-id=${item.team1_id} onclick="getTeamInfo(${item.team1_id})" data-toggle="modal" data-target="#modal-team-info" style="flex-direction: column; cursor: pointer;">
												<img class="teamLogo" src=${placeholdersvg1} alt=${item.team1}/>
												<p class="teamName" style="font-size: 20px;">${item.team1}</p>
											</div>
											<div class="col-2 versus" style="font-size: 30px; color: black; font-weight: 700; text-align: center;">
												VS
											</div>
											<div class="col-5 team2" title=${item.team2} data-team-id=${item.team2_id} onclick="getTeamInfo(${item.team2_id})" data-toggle="modal" data-target="#modal-team-info" style="flex-direction: column; cursor: pointer;">
												<img class="teamLogo" src=${placeholdersvg2} alt=${item.team2}/>
												<p class="teamName" style="font-size: 20px;">${item.team2}</p>
											</div>
										</div>
									</div>
								</div>`;
			matchContainer.append(create);
			if(timer.h == 0 && (timer.m >= 0 && timer.m <= localStorage.getItem('last_time'))){
				pn.programm_notification_csgo.push(item);
				if(localStorage.getItem('windows_notification') == 1) windowsNotification(timer, item);
				let event_n = csgo_container.querySelector(`.event_${index}`);
				event_n.querySelector(".timeLast").style.cssText = "background-color: red;";
			};
		});
	};
	programmNotification(pn.programm_notification_csgo, "CSGO");
	setTimeout(updateMatchesCSGO, 60000);
};
updateMatchesCSGO();

/*----------- DOTA ------------*/
async function updateMatchesDota(){
	var date = await mainCheckedMatchDota();
	if(matchDota2Container.children.length != 0) $(matchDota2Container).empty();
	var pn = {
		programm_notification_dota: []
	};

	if(date.liveMatchDota.length == 0){
		$(liveMatchDota).empty();
		let create = document.createElement("div");
		create.className = `alert alert-info non-live-match`;
		create.style.cssText = 'margin: 5px;';
		create.innerHTML = `<h4>No live matches</h4>`;
		liveMatchDota2Container.append(create);
	}else{
		// date.liveMatchDota.map((item, index) => {
		// 	let side = (item.sideTeam1 == "r") ? `transform: scale(-1, 1)` : "";
		// 	let create = document.createElement("div");
		// 	create.className = `container`;
		// 	create.style.cssText = 'margin: 5px;';
		// 	create.innerHTML = `<div class="row">
		// 							<div class="alert-dark match_${item.serie_id}">
		// 								<div style="background-image: url(../wallpaper/bg_dota2.jpg); background-size: cover; background-position: center;opacity: .3; width: 100%; height: 100%; position: absolute; top: 0; left: 0; ${side};"></div>
		// 								<div class="live_event" style="position: relative;">
		// 									<div class="live_event_header">
		// 										<h4 class="live_eventName">${item.eventName}</h4>
		// 									</div>
		// 									<div class="live_event_footer">
		// 										<p class="eventLive" style="background-color: red; color: white; border-radius: 3px; padding: 0 5px;">LIVE</p>
		// 										<p class="mapNumbet" style="color: white; background-color: red; padding: 0 5px; border-radius: 5px;"></p>
		// 										<p class="eventBO">${item.bo}</p>
		// 									</div>
		// 								</div>
		// 								<hr style="position: relative;">
		// 								<div class="liveMatchTeams" style="position: relative;">
		// 									<div class="team1" style="flex-direction: column;">
		// 										<img class="teamLogo" src=${item.imgTeam1} alt=${item.team1}/>
		// 										<p class="teamName" style="font-size: 20px;">${item.team1}</p>
		// 									</div>
		// 									<div class="liveScore" style="text-align: center;">
		// 										<p class="score" style="font-size: 25px; font-weight: 700;"></p>
		// 										<small class="scoreMap" style="font-weight: 700;"></small>
		// 									</div>
		// 									<div class="team2" style="flex-direction: column;">
		// 										<img class="teamLogo" src=${item.imgTeam2} alt=${item.team2}/>
		// 										<p class="teamName" style="font-size: 20px;">${item.team2}</p>
		// 									</div>
		// 								</div>
		// 								<div class="networth" style="position: relative; display: flex; justify-content: space-between;"></div>
		// 							</div>
		// 						</div>`;
		// 	liveMatchDota2Container.append(create);
		// });
	};

	if(date.upcomingMatchesDota.length == 0){
		let create = document.createElement("div");
		create.className = `alert alert-info no-match`;
		create.style.cssText = 'margin: 5px;';
		create.innerHTML = `<h4>No matches today</h4>`;
		matchDota2Container.append(create);
	}else{
		date.upcomingMatchesDota.map((item, index) => {
			let a = +item.time.split(":")[0] + 2 + ":" + item.time.split(":")[1] + ":" + item.time.split(":")[2];
			let b = (+item.time.split(":")[0] + 2) == 24 ? "00" + ":" + item.time.split(":")[1] : +item.time.split(":")[0] + 2 + ":" + item.time.split(":")[1];
			let timer = timeLast(Date.parse(`${item.fullTime.split(" ")[0]}T${a}`));
			if(Date.parse(`${item.fullTime.split(" ")[0]}T${a}`) >= Date.now()){
				let create = document.createElement("div");
				create.className = "container";
				create.style.cssText = 'margin: 5px;';
				create.innerHTML = `<div class="row">
										<div class="alert alert-dark match_${index}" style="width: 100%;">
											<div class="event_${index}">
												<div class="timeLast">
													Left: ${timer.h}h ${timer.m < 0 ? "0" : timer.m}m
												</div>
												<div class="event_header">
													<h4 class="eventName">${item.eventName}</h4>
												</div>
												<div class="event_footer">
													<p class="eventTime">${b}</p>
													<p class="eventBO">${item.bo}</p>
												</div>
											</div>
											<hr>
											<div class="matchTeams" style="margin-top: 5px;">
												<div class="col-6 team1" style="flex-direction: column;">
													<img class="teamLogo" src=${item.logoTeam1} alt=${item.team1.trim()}/>
													<p class="teamName" style="font-size: 20px; width: max-content; overflow: hidden;">${item.team1.trim()}</p>
												</div>
												<div class="col-6 team2" style="flex-direction: column;">
													<img class="teamLogo" src=${item.logoTeam2} alt=${item.team2}/>
													<p class="teamName" style="font-size: 20px; width: max-content; overflow: hidden;">${item.team2}</p>
												</div>
											</div>
										</div>
									</div>`;
				matchDota2Container.append(create);

				if(timer.h == 0 && (timer.m >= 0 && timer.m <= localStorage.getItem('last_time'))){
					pn.programm_notification_dota.push(item);
					if(localStorage.getItem('windows_notification') == 1) windowsNotification(timer, item);
					let event_n = dota2_container.querySelector(`.event_${index}`);
					event_n.querySelector(".timeLast").style.cssText = "background-color: red;";
				};
			};
		});
	};
	programmNotification(pn.programm_notification_dota, "DOTA");
	setTimeout(updateMatchesCSGO, 60000);
};
//updateMatchesDota();
/*-----------------------------*/

async function connectToScorebotCSGO(id, bo, t){
	var remove = false;
	var mapPick = await mapPoolPick(id);
	var re_map = setInterval(async () => {
		if(mapPick == undefined){
			mapPick = await mapPoolPick(id);
		}else{
			if(mapPick != undefined && !remove){
				var bi2 = document.getElementById(`collapse_${id}`);
				var html_ = "";
				mapPick.map((item, index) => {
					html_ += `<div class="container" style="margin: 5px 0; padding: 2px 0;">
										<div class="row">
											<div class="col-12" style="display: flex; justify-content: space-between;">
												${Object.values(item)[0].team != "" ? "<p>" + Object.values(item)[0].team + "</p>" : ""}
												${Object.keys(item)[0] == "removed" ? "<p style='background-color: red; color: white; width: 30%; border-radius: 10px;'>BAN</p>" : Object.keys(item)[0] == "picked" ? "<p style='background-color: blue; color: white; width: 30%; border-radius: 10px;'>PICK</p>" : Object.keys(item)[0] == "left" ? "<p>Was left over</p>" : ""}
												<p>${Object.values(item)[0].pick}</p>
											</div>
										</div>
									</div>`;
				});
				bi2.querySelector(".block-info-2").innerHTML = html_;
			};
			clearTimeout(re_map);
		};
	}, 5000);

	var crossBet = await connectToCrossBet(id, t);
	try{
		var updateScore = document.querySelector(`[data-id = "${id}"]`);
		var game_transfer = setInterval(() => {
			if(updateScore == null){
				socket.close();
				remove = true;
				clearTimeout(game_transfer);
			};
		}, 1000);

		var CONNECTION = 'wss://scorebot-lb.hltv.org/';
		var listID = JSON.stringify({token: "", listIds: [id]});
		var list2ID = JSON.stringify({token: "", listId: id});
		var socket = new io(CONNECTION, {
			upgrade: false,
		  	transports: ['websocket'],
		  	extraHeaders: {
		    	"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.186"
		  	}
		});
		socket.on('connect', () => {
			socket.emit('readyForScores', listID);
			socket.emit('readyForMatch', list2ID);
			Swal.fire({
	            toast: true,
	            position: 'top-end',
	            title: `[Connected] ${t}`,
	            showConfirmButton: false,
	            timer: 2000,
	            timerProgressBar: true
	        });
		});
		socket.on('disconnect', () => {
			Swal.fire({
	            toast: true,
	            position: 'top-end',
	            title: `[Disconnected] ${t}`,
	            showConfirmButton: false,
	            timer: 2000,
	            timerProgressBar: true
	        });
		});
		socket.on('score', data => {
			update(data, bo.split(" ")[2]);
		});
		socket.on('scoreboard', data => {
			updateMatchInfo(data, bo.split(" ")[2]);
		});

		function update(data, bo){
			if(!remove){
				var mapNumber, mapName, scoreMap;
				var team1_id = updateScore.querySelector(".team1").getAttribute("data-team-id");
				var team2_id = updateScore.querySelector(".team2").getAttribute("data-team-id");
				if(Object.keys(data.wins).length != 0){
						updateScore.querySelector(".liveScore_hltv > .scoreMap").innerText = `${data.wins[team1_id]} : ${data.wins[team2_id]}`;
						mapNumber = data.wins[team1_id] + data.wins[team2_id] + 1;
						if(bo == "1" && (data.wins[team1_id] == 1 || data.wins[team2_id] == 1)){
							remove = true;
							socket.close();
						};
						if(bo == "3" && (data.wins[team1_id] == 2 || data.wins[team2_id] == 2)){
							remove = true;
							socket.close()
						};
						if(bo == "5" && (data.wins[team1_id] == 3 || data.wins[team2_id] == 3)){
							remove = true;
							socket.close()
						};
				}else{
					updateScore.querySelector(".liveScore_hltv > .scoreMap").innerText = "0 : 0";
					mapNumber = 1;
				};

				if(mapNumber <= +bo && !remove){
					mapName = data.mapScores[mapNumber] != undefined ? data.mapScores[mapNumber].map : "Start soon";
				}else{
					mapName = "End";
				};

				if(mapPick != undefined && mapName != "Start soon" && mapName != "End" && !remove){
					var p;
					mapPick.map((item, index) => {
						if(item.picked != undefined){
							if(mapName.split("_")[1][0].toUpperCase() + "" + mapName.split("_")[1].slice(1) === item.picked.pick){
								p = item.team;
								document.getElementById(`${item.picked.team}`).querySelector(".pick_team").innerText = "PICK";
					      		document.getElementById(`${item.picked.team}`).querySelector(".pick_team").style.cssText = "position: absolute; top: 50%; background-color: blue; color: white; border-radius: 5px; padding: 0 4px; font-size: 11px; width: 35px;";
								if(p != item.team){
									document.getElementById(`${item.picked.team}`).querySelector(".pick_team").innerText = "";
				      				document.getElementById(`${item.picked.team}`).querySelector(".pick_team").style.cssText = "";
								};
							};
						};
					});
				};

				if(mapName == "Start soon" || mapName == "End"){
					var remove_pick = updateScore.querySelectorAll(".pick_team");
					for(let i = 0; i < remove_pick.length; i++){
						remove_pick[i].innerText = "";
						remove_pick[i].style.cssText = "";
					};
				};

				updateScore.querySelector(".background_image").style.backgroundImage = mapName != "Start soon" && mapName != "End" ? `url(https://static.hltv.org/images/scoreboardmaps/${mapName}.png)` : "url(../wallpaper/bg_csgo_upcoming_normal.png)";
				updateScore.querySelector(".mapNumber").innerText = mapName != "Start soon" && mapName != "End" ? `Map ${mapNumber} ${mapName.split("_")[1][0].toUpperCase() + "" + mapName.split("_")[1].slice(1)}` : `Map ${mapNumber} ${mapName}`;
			};	
		};

		function updateMatchInfo(data, bo){
			if(!remove){
				var team1_id = updateScore.querySelector(".team1").getAttribute("data-team-id");
				var team2_id = updateScore.querySelector(".team2").getAttribute("data-team-id");
				var score = data.ctTeamId == team1_id ? `${data.ctTeamScore} : ${data.tTeamScore}` : `${data.tTeamScore} : ${data.ctTeamScore}`;
				if(updateScore.querySelector(".liveScore_hltv > .score").innerText != score && updateScore.querySelector(".liveScore_hltv > .score").innerText != "" && localStorage.sound_score_change == 1){
					soundChangeScoreHLTV.play();
				};
				updateScore.querySelector(".liveScore_hltv > .score").innerText = score != undefined ? score : "0 : 0";

				if(Object.keys(data.TERRORIST).length > 0 && Object.keys(data.CT).length > 0){
					var sbt1 = document.querySelector(`.scoreboard-teams-${id}`).querySelector(".team1") != null ? document.querySelector(`.scoreboard-teams-${id}`).querySelector(".team1") : null;
					var sbt2 = document.querySelector(`.scoreboard-teams-${id}`).querySelector(".team2") != null ? document.querySelector(`.scoreboard-teams-${id}`).querySelector(".team2") : null;
					if(sbt1 != null && sbt2 != null){
						sbt1.querySelector(".players_team").innerText = `${data.terroristTeamName} (T)`;
						sbt2.querySelector(".players_team").innerText = `${data.ctTeamName} (CT)`;
						Object.values(data.TERRORIST).map((item, index) => {
							if(index < 5){
								sbt1.querySelector(`.player_nick_${index}`).innerText = Object.values(data.TERRORIST)[index].nick != undefined ? Object.values(data.TERRORIST)[index].nick : "";
								sbt1.querySelector(`.player_money_${index}`).innerText = Object.values(data.TERRORIST)[index].money != undefined ? Object.values(data.TERRORIST)[index].money : "";
								sbt1.querySelector(`.player_kill_${index}`).innerText = Object.values(data.TERRORIST)[index].score != undefined ? Object.values(data.TERRORIST)[index].score : "";
								sbt1.querySelector(`.player_death_${index}`).innerText = Object.values(data.TERRORIST)[index].deaths != undefined ? Object.values(data.TERRORIST)[index].deaths : "";
								sbt1.querySelector(`.player_assist_${index}`).innerText = Object.values(data.TERRORIST)[index].assists != undefined ? Object.values(data.TERRORIST)[index].assists : "";
								sbt1.querySelector(`.player_kd_${index}`).innerText = (Object.values(data.TERRORIST)[index].score != 0 && Object.values(data.TERRORIST)[index].deaths != 0) && (Object.values(data.TERRORIST)[index].score != undefined && Object.values(data.TERRORIST)[index].deaths != undefined) ? (Object.values(data.TERRORIST)[index].score/Object.values(data.TERRORIST)[index].deaths).toFixed(2) : Object.values(data.TERRORIST)[index].score != undefined ? Object.values(data.TERRORIST)[index].score + ".00" : 0;
								sbt1.querySelector(`.player_nick_${index}`).parentElement.parentElement.style.opacity = Object.values(data.TERRORIST)[index].alive != undefined && Object.values(data.TERRORIST)[index].alive == true ? "1" : "0.2";
							};
						});
						Object.values(data.CT).map((item, index) => {
							if(index < 5){
								sbt2.querySelector(`.player_nick_${index}`).innerText = Object.values(data.CT)[index].nick != undefined ? Object.values(data.CT)[index].nick : "";
								sbt2.querySelector(`.player_money_${index}`).innerText = Object.values(data.CT)[index].money != undefined ? Object.values(data.CT)[index].money : "";
								sbt2.querySelector(`.player_kill_${index}`).innerText = Object.values(data.CT)[index].score != undefined ? Object.values(data.CT)[index].score : "";
								sbt2.querySelector(`.player_death_${index}`).innerText = Object.values(data.CT)[index].deaths != undefined ? Object.values(data.CT)[index].deaths : "";
								sbt2.querySelector(`.player_assist_${index}`).innerText = Object.values(data.CT)[index].assists != undefined ? Object.values(data.CT)[index].assists : "";
								sbt2.querySelector(`.player_kd_${index}`).innerText = (Object.values(data.CT)[index].score != 0 && Object.values(data.CT)[index].deaths != 0) && (Object.values(data.CT)[index].score != undefined && Object.values(data.CT)[index].deaths != undefined) ? (Object.values(data.CT)[index].score/Object.values(data.CT)[index].deaths).toFixed(2) : Object.values(data.CT)[index].score != undefined ? Object.values(data.CT)[index].score + ".00" : 0;
								sbt2.querySelector(`.player_nick_${index}`).parentElement.parentElement.style.opacity = Object.values(data.CT)[index].alive != undefined && Object.values(data.CT)[index].alive == true ? "1" : "0.2";
							};
						});
					};
				};
				var m_history = document.querySelector(`.scoreboard-teams-${id}`).querySelector(".mapHistory") != null ? document.querySelector(`.scoreboard-teams-${id}`).querySelector(".mapHistory") : null;
				if(m_history != null){
					if(Object.keys(data.ctMatchHistory.firstHalf).length > 0 && Object.keys(data.terroristMatchHistory.firstHalf).length > 0){
						var html_ct_fh = "";
						Object.values(data.ctMatchHistory.firstHalf).map((item, index) => {
							switch(item.type){
								case "CTs_Win":
									html_ct_fh += `<div style="margin: 0 1px;"><p style="display: block;">${index + 1}</p><img src="https://static.hltv.org/images/scoreboard2/ct_win.svg" alt="CTs Win" style="width: 20px; height: 20px;" /></div>`;
									break;
								case "Bomb_Defused":
									html_ct_fh += `<div style="margin: 0 1px;"><p style="display: block;">${index + 1}</p><img src="https://static.hltv.org/images/scoreboard2/bomb_defused.svg" alt="Bomb_Defused" style="width: 20px; height: 20px;" /></div>`
									break;
								case "Target_Saved":
									html_ct_fh += `<div style="margin: 0 1px;"><p style="display: block;">${index + 1}</p><img src="https://static.hltv.org/images/scoreboard2/stopwatch.svg" alt="Target Saved" style="width: 20px; height: 20px;" /></div>`
									break;
								case "Terrorists_Win":
									html_ct_fh += `<div style="margin: 0 1px;"><p style="display: block;">${index + 1}</p><img src="https://static.hltv.org/images/scoreboard2/t_win.svg" alt="T Win" style="width: 20px; height: 20px;" /></div>`;
									break;
								case "Target_Bombed":
									html_ct_fh += `<div style="margin: 0 1px;"><p style="display: block;">${index + 1}</p><img src="https://static.hltv.org/images/scoreboard2/bomb_exploded.svg" alt="Target Bombed" style="width: 20px; height: 20px;" /></div>`
									break;
								case "lost":
									html_ct_fh += `<div style="margin: 0 1px;"><p style="display: block;">${index + 1}</p><img src="https://static.hltv.org/images/scoreboard2/emptyHistory.svg" alt="" style="width: 20px; height: 20px;" /></div>`
									break;	
							};
						});
						var html_t_fh = "";												
						Object.values(data.terroristMatchHistory.firstHalf).map((item, index) => {
							switch(item.type){
								case "Terrorists_Win":
									html_t_fh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/t_win.svg" alt="T Win" style="width: 20px; height: 20px;" /></div>`;
									break;
								case "Target_Bombed":
									html_t_fh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/bomb_exploded.svg" alt="Target Bombed" style="width: 20px; height: 20px;" /></div>`
									break;
								case "CTs_Win":
									html_t_fh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/ct_win.svg" alt="CTs Win" style="width: 20px; height: 20px;" /></div>`;
									break;
								case "Bomb_Defused":
									html_t_fh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/bomb_defused.svg" alt="Bomb_Defused" style="width: 20px; height: 20px;" /></div>`
									break;
								case "Target_Saved":
									html_t_fh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/stopwatch.svg" alt="Target Saved" style="width: 20px; height: 20px;" /></div>`
									break;
								case "lost":
									html_t_fh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/emptyHistory.svg" alt="" style="width: 20px; height: 20px;" /></div>`
									break;	
							};
						});
						m_history.querySelector(".f_half").parentElement.style.cssText = "background-color: #bfb2b2; border-radius: 5px; margin-bottom: 5px;";
						m_history.querySelector(".f_half").innerHTML = `<span style="display: block; position: absolute; top: 0; left: 0; text-align: left; font-weight: 700;">Round: ${data.currentRound}</span>
																		<p>First Half</p>
																		<div class="m_history_ct_fh" style="display: flex; justify-content: center;">
																			${html_ct_fh}
																		</div>
																		<hr>
																		<div class="m_history_t_fh" style="display: flex; justify-content: center; margin-bottom: 10px;">
																			${html_t_fh}
																		</div>`;
					};
					if(Object.keys(data.ctMatchHistory.secondHalf).length > 0 && Object.keys(data.terroristMatchHistory.secondHalf).length > 0){
						var html_ct_sh = "";
						Object.values(data.ctMatchHistory.secondHalf).map((item, index) => {
							switch(item.type){
								case "CTs_Win":
									html_ct_sh += `<div style="margin: 0 1px;"><p style="display: block;">${(index + 1) + 15}</p><img src="https://static.hltv.org/images/scoreboard2/ct_win.svg" alt="CTs Win" style="width: 20px; height: 20px;" /></div>`;
									break;
								case "Bomb_Defused":
									html_ct_sh += `<div style="margin: 0 1px;"><p style="display: block;">${(index + 1) + 15}</p><img src="https://static.hltv.org/images/scoreboard2/bomb_defused.svg" alt="Bomb_Defused" style="width: 20px; height: 20px;" /></div>`
									break;
								case "Target_Saved":
									html_ct_sh += `<div style="margin: 0 1px;"><p style="display: block;">${(index + 1) + 15}</p><img src="https://static.hltv.org/images/scoreboard2/stopwatch.svg" alt="Target Saved" style="width: 20px; height: 20px;" /></div>`
									break;
								case "Terrorists_Win":
									html_ct_sh += `<div style="margin: 0 1px;"><p style="display: block;">${(index + 1) + 15}</p><img src="https://static.hltv.org/images/scoreboard2/t_win.svg" alt="T Win" style="width: 20px; height: 20px;" /></div>`;
									break;
								case "Target_Bombed":
									html_ct_sh += `<div style="margin: 0 1px;"><p style="display: block;">${(index + 1) + 15}</p><img src="https://static.hltv.org/images/scoreboard2/bomb_exploded.svg" alt="Target Bombed" style="width: 20px; height: 20px;" /></div>`
									break;
								case "lost":
									html_ct_sh += `<div style="margin: 0 1px;"><p style="display: block;">${(index + 1) + 15}</p><img src="https://static.hltv.org/images/scoreboard2/emptyHistory.svg" alt="" style="width: 20px; height: 20px;" /></div>`
									break;	
							};
						});
						var html_t_sh = "";
						Object.values(data.terroristMatchHistory.secondHalf).map((item, index) => {
							switch(item.type){
								case "Terrorists_Win":
									html_t_sh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/t_win.svg" alt="T Win" style="width: 20px; height: 20px;" /></div>`;
									break;
								case "Target_Bombed":
									html_t_sh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/bomb_exploded.svg" alt="Target Bombed" style="width: 20px; height: 20px;" /></div>`
									break;
								case "CTs_Win":
									html_t_sh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/ct_win.svg" alt="CTs Win" style="width: 20px; height: 20px;" /></div>`;
									break;
								case "Bomb_Defused":
									html_t_sh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/bomb_defused.svg" alt="Bomb_Defused" style="width: 20px; height: 20px;" /></div>`
									break;
								case "Target_Saved":
									html_t_sh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/stopwatch.svg" alt="Target Saved" style="width: 20px; height: 20px;" /></div>`
									break;
								case "lost":
									html_t_sh += `<div style="margin: 0 1px;"><img src="https://static.hltv.org/images/scoreboard2/emptyHistory.svg" alt="" style="width: 20px; height: 20px;" /></div>`
									break;	
							};
						});
						m_history.querySelector(".s_half").innerHTML = `<p>Second Half</p>
																		<div class="m_history_ct_sh" style="display: flex; justify-content: center;">
																			${html_ct_sh}
																		</div>
																		<hr>
																		<div class="m_history_t_sh" style="display: flex; justify-content: center; margin-bottom: 10px;">
																			${html_t_sh}
																		</div>`;
					};
					if(updateScore.querySelector(".liveScore_hltv > .score").innerText == "0 : 0"){
						$(m_history).find(".f_half").empty();
						$(m_history).find(".s_half").empty();
					};
				};
			};
		};
	}catch(e){
		console.log("ERROR", e);
		Swal.fire({
           toast: true,
           position: 'top-end',
           title: `[ERROR] ${t}`,
           showConfirmButton: false,
           timer: 3000,
           timerProgressBar: true
       });
	};
};

async function connectToCrossBet(id, t){
	try{
		var remove = false;
		var updateScore = document.querySelector(`[data-id = "${id}"]`);
		var game_transfer = setInterval(() => {
			if(updateScore == null){
				socket.close();
				remove = true;
				clearTimeout(game_transfer);
			};
		}, 1000);
		var socket = new io('https://cross.bet', {
		  	upgrade: false,
		  	transports: ['websocket'],
		  	extraHeaders: {
		    	"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.186"
		  	}
		});

		socket.on('connect', function(){
			socket.emit("getMatches");
		});

		socket.on('connect_error', (e) => {
		  	console.log(e);
		});

		socket.on('error', (e) => {
		  	console.log(e);
		});

		socket.on('disconnect', function(reason){
		  	console.log(reason);
		});

		socket.on('setMatches', (data) => {
			var live_id = {};
			if(data.live.length > 0){
				data.live.map(item => {
					//if(item.id == id) live_id = item.id; 
					if(item.vs.includes(t.split('vs')[0].trim()) && item.vs.includes(t.split('vs')[1].trim())) {
						live_id.matchID = item.matchId;
						live_id.teamsInfo = {
							t, 
							home: item.vs.split('vs')[0].trim(),
							away: item.vs.split('vs')[1].trim()
						};
					};
				});
			};

			if(live_id != undefined && live_id.matchID){
				socket.emit("room", `${live_id.matchID}`);
				socket.on('scoreUpdate', (data) => {
					socket.emit("getMatchScore",`${live_id.matchID}`);
					socket.on('matchScore', (data) => {
						updateMatchScore(Object.values(data), live_id.teamsInfo);
					});
				});
				socket.on('mapScore', (data) => {
					updateMapScore(data, live_id.teamsInfo);
				});
				socket.on('utilsUpdate', (data) => {
					//updateWinLine(data);
				});
				socket.on('matchClose', () => {
					socket.close();
				});
			}else{
				socket.close();
			};
		});
		function updateMatchScore(bk, tinfo){
			if(!remove){
				var m = [];
				bk.map(item => {
					if(Object.keys(item).length > 0 && item.hasOwnProperty("score_home") == true && item.hasOwnProperty("score_away")) m.push(item);
				});

				function sortByScore(arr){
				  	var scoreTeam1 = arr.sort((a, b) => {
				  		if(a.score_home != undefined && b.score_home != undefined) return +b.score_home - +a.score_home;
				  	});

				  	var scoreTeam2 = arr.sort((a, b) => {
				  		if(a.score_away != undefined && b.score_away != undefined) return +b.score_away - +a.score_away;
				  	});

					if(tinfo.t !== `${tinfo.home} vs ${tinfo.away}`) return `${scoreTeam1[0].score_away} : ${scoreTeam2[0].score_home}`;
				  	return `${scoreTeam1[0].score_home} : ${scoreTeam2[0].score_away}`;
				};
				if(updateScore.querySelector(".liveScore_crossbet > .score").innerText != sortByScore(m) && updateScore.querySelector(".liveScore_crossbet > .score").innerText != "" && localStorage.sound_score_change == 1){
					soundChangeScoreCrossBet.play();
				};
				updateScore.querySelector(".liveScore_crossbet > .score").innerText = sortByScore(m);
			};
		};
		function updateMapScore(data, tinfo){
			if(!remove){
				updateScore.querySelector(".liveScore_crossbet > .scoreMap").innerText = tinfo.t !== `${tinfo.home} vs ${tinfo.away}` ? `${data.mapScore_away} : ${data.mapScore_home}` : `${data.mapScore_home} : ${data.mapScore_away}`;
			};
		};
		function updateWinLine(data){
			if(!remove){
				if(data.odds.ctTeamName == updateScore.querySelector(".team1").getAttribute("id")){
					updateScore.querySelector(".winLive > .win_team1").style.width = `${data.odds.ct}%`;
					updateScore.querySelector(".winLive > .win_team2").style.width = `${data.odds.t}%`;
					updateScore.querySelector(".winLive > .win").style.width = `${data.odds.ot}%`;
					updateScore.querySelector(".winLive > .win_team1").setAttribute("title", `${data.odds.ctTeamName} to win ${data.odds.ct}%`);
					updateScore.querySelector(".winLive > .win_team2").setAttribute("title", `${data.odds.terroristTeamName} to win ${data.odds.t}%`);
					updateScore.querySelector(".winLive > .win").setAttribute("title", `Overtime ${data.odds.ot}%`);
				}else{
					updateScore.querySelector(".winLive > .win_team1").style.width = `${data.odds.t}%`;
					updateScore.querySelector(".winLive > .win_team2").style.width = `${data.odds.ct}%`;
					updateScore.querySelector(".winLive > .win").style.width = `${data.odds.ot}%`;
					updateScore.querySelector(".winLive > .win_team1").setAttribute("title", `${data.odds.terroristTeamName} to win ${data.odds.t}%`);
					updateScore.querySelector(".winLive > .win_team2").setAttribute("title", `${data.odds.ctTeamName} to win ${data.odds.ct}%`);
					updateScore.querySelector(".winLive > .win").setAttribute("title", `Overtime ${data.odds.ot}%`);
				};
			};
		};
	}catch(e){
		console.log("ERROR", e);
		Swal.fire({
           toast: true,
           position: 'top-end',
           title: `[ERROR] Cross.bet`,
           showConfirmButton: false,
           timer: 3000,
           timerProgressBar: true
       });
	};
};

function getTeamInfo(id){
	if(id != undefined){
		modalWindowTeamInfo();
		var modal_body = document.getElementById("modal-team-info");
		HLTV.getTeamStats({id: id}).then(res => {
			modal_body.querySelector(".team_overview").innerHTML = `<div class="accordion" id="accordionTeamOverview">
																	  	<div class="card">
																	    	<div class="card-header" id="headingTeamOverview" style="padding: 0;">
																	      	<h2 class="mb-0">
																	        	<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#team_overview_result" aria-expanded="true" aria-controls="team_overview_result" style="background-color: gray; text-decoration: none;">
																	          		<p>Overview</p>
																	        	</button>
																	      	</h2>
																	    </div>
																	    <div id="team_overview_result" class="collapse" aria-labelledby="headingTeamOverview" data-parent="#accordionTeamOverview"> 
																	    	<div class="team_overview_mp">
																	    		<p style="display: inline-block; float: left; margin-left: 5px;">Maps played:</p>
																	    		<span style="display: block; text-align: right; font-weight: 700; margin-right: 5px;">${res.overview.mapsPlayed}</span>
																	    	</div>
																	    	<hr>
																	    	<div class="team_overview_tk">
																	    		<p style="display: inline-block; float: left; margin-left: 5px;">Total kills:</p>
																	    		<span style="display: block; text-align: right; font-weight: 700; margin-right: 5px;">${res.overview.totalKills}</span>
																	    	</div>
																	    	<hr>
																	    	<div class="team_overview_td">
																	    		<p style="display: inline-block; float: left; margin-left: 5px;">Total deaths:</p>
																	    		<span style="display: block; text-align: right; font-weight: 700; margin-right: 5px;">${res.overview.totalDeaths}</span>
																	    	</div>
																	    	<hr>
																	    	<div class="team_overview_rp">
																	    		<p style="display: inline-block; float: left; margin-left: 5px;">Rounds played:</p>
																	    		<span style="display: block; text-align: right; font-weight: 700; margin-right: 5px;">${res.overview.roundsPlayed}</span>
																	    	</div>
																	    	<hr>
																	    	<div class="team_overview_kdr">
																	    		<p style="display: inline-block; float: left; margin-left: 5px;">KD ratio:</p>
																	    		<span style="display: block; text-align: right; font-weight: 700; margin-right: 5px;">${res.overview.kdRatio}</span>
																	    	</div>
																	    	<hr>
																	    	<div class="team_overview_ws">
																	    		<p style="display: inline-block; float: left; margin-left: 5px;">Wins:</p>
																	    		<span style="display: block; text-align: right; font-weight: 700; margin-right: 5px;">${res.overview.wins}</span>
																	    	</div>
																	    	<hr>
																	    	<div class="team_overview_ds">
																	    		<p style="display: inline-block; float: left; margin-left: 5px;">Draws:</p>
																	    		<span style="display: block; text-align: right; font-weight: 700; margin-right: 5px;">${res.overview.draws}</span>
																	    	</div>
																	    	<hr>
																	    	<div class="team_overview_ls">
																	    		<p style="display: inline-block; float: left; margin-left: 5px;">Losses:</p>
																	    		<span style="display: block; text-align: right; font-weight: 700; margin-right: 5px;">${res.overview.losses}</span>
																	    	</div>
																	    </div>
																	</div>`;
			var maps_stats = "";

			res.mapStats = Object.keys(res.mapStats).sort((a, b) => res.mapStats[a].winRate < res.mapStats[b].winRate ? 1 : -1).reduce((acc, item) => {
				acc[item] = res.mapStats[item];
				return acc;
			}, {});

			Object.keys(res.mapStats).map(item => {
				maps_stats += `<div class="accordion" id="accordionMapStats_${item}">
								  	<div class="card">
								    	<div class="card-header" id="headingMapStats" style="padding: 0;">
								      	<h2 class="mb-0">
								        	<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#team_map_stats_${item}" aria-expanded="true" aria-controls="team_map_stats_${item}" style="text-decoration: none; background-image: url(${mapImg[item]}); background-size: 100%; text-decoration: none;">
								          		<p style="color: white;">${mapsObject[item]}</p>
								        	</button>
								      	</h2>
								    </div>
								    <div id="team_map_stats_${item}" class="collapse" aria-labelledby="headingMapStats" data-parent="#accordionMapStats_${item}"> 
								    	<div class="team_map_stats_${item}_wins">
								    		<p style="margin-left: 5px; display: inline-block; float: left">Wins:</p>
								    		<span style="margin-right: 5px; font-weight: 700; text-align: right; display: block;">${res.mapStats[item].wins}</span>
								    	</div>
								    	<hr>
								    	<div class="team_map_stats_${item}_draws">
								    		<p style="margin-left: 5px; display: inline-block; float: left">Draws:</p>
								    		<span style="margin-right: 5px; font-weight: 700; text-align: right; display: block;">${res.mapStats[item].draws}</span>
								    	</div>
								    	<hr>
								    	<div class="team_map_stats_${item}_losses">
								    		<p style="margin-left: 5px; display: inline-block; float: left">Losses:</p>
								    		<span style="margin-right: 5px; font-weight: 700; text-align: right; display: block;">${res.mapStats[item].losses}</span>
								    	</div>
								    	<hr>
								    	<div class="team_map_stats_${item}_winRate">
								    		<p style="margin-left: 5px; display: inline-block; float: left">Win rate:</p>
								    		<span style="margin-right: 5px; font-weight: 700; text-align: right; display: block;">${res.mapStats[item].winRate} %</span>
								    	</div>
								    	<hr>
								    	<div class="team_map_stats_${item}_totalRound">
								    		<p style="margin-left: 5px; display: inline-block; float: left">Total rounds:</p>
								    		<span style="margin-right: 5px; font-weight: 700; text-align: right; display: block;">${res.mapStats[item].totalRounds}</span>
								    	</div>
								    	<hr>
								    	<div class="team_map_stats_${item}_rwpafk">
								    		<p style="margin-left: 5px; display: inline-block; float: left">Round win after first kill:</p>
								    		<span style="margin-right: 5px; font-weight: 700; text-align: right; display: block;">${res.mapStats[item].roundWinPAfterFirstKill} %</span>
								    	</div>
								    	<hr>
								    	<div class="team_map_stats_${item}_rwpafd">
								    		<p style="margin-left: 5px; display: inline-block; float: left">Round win after first death:</p>
								    		<span style="margin-right: 5px; font-weight: 700; text-align: right; display: block;">${res.mapStats[item].roundWinPAfterFirstDeath} %</span>
								    	</div>
								    </div>
								</div>`;
			});
			modal_body.querySelector(".team_map_stats").innerHTML = `<div class="accordion" id="accordionMapStats">
																	  	<div class="card">
																	    	<div class="card-header" id="headingMapsStats" style="padding: 0;">
																	      	<h2 class="mb-0">
																	        	<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#team_map_stats" aria-expanded="true" aria-controls="team_map_stats" style="background-color: gray; text-decoration: none;">
																	          		<p>Map stats</p>
																	        	</button>
																	      	</h2>
																	    </div>
																	    <div id="team_map_stats" class="collapse" aria-labelledby="headingMapsStats" data-parent="#accordionMapStats"> 
																	    	${maps_stats}
																	    </div>
																	</div>`;
		});

		HLTV.getTeam({id: id}).then(res => {
			var png = res.coverImage.split("/")[5].toString().split(".");
			png.splice(png.indexOf("gif"), 1, "png");
			var size = [res.coverImage.split("/")[4]];
			size.splice(size.indexOf("30x20"), 1, "300x200").toString();
			var urlFlag = `https://hltv.org/img/static/flags/${size}/${png.toString().split(",").join(".")}`;

			modal_body.querySelector(".team_header").innerHTML = `<div style="background-image: url(${urlFlag}); background-position: center center; background-size: 100% 100%; position: absolute; background-repeat: no-repeat; opacity: 0.3; width: 100%; height: 100%; top: 0; left: 0; border-radius: 10px;"></div>
																<img src=${res.logo} alt="${res.name}" style="width: 100px; height: 100px; margin: 0 auto 10px; display: block; position: relative;"/>
																<h4 style="position: relative;">${res.name}</h4>`;
			modal_body.querySelector(".team_main_info").innerHTML = `<div class="team_country" style="border-bottom: 1px solid black;">
																		<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Country:</p>
																		<span  style="display: block; text-align: right; font-weight: 700;">${res.location}</span>
																	</div>
																	<div class="team_rank">
																		<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">World ranking:</p>
																		<span style="display: block; text-align: right; font-weight: 700;">${res.rankingDevelopment.length > 0 ? res.rankingDevelopment[res.rankingDevelopment.length - 1] : "no rank"}</span>
																	</div>`;
			var all_players = "";
			res.players.map(item => {
				all_players += `<div class="card_player" data-player-id=${item.id} title=${item.name} onclick="getPlayerInfo(${item.id})" data-toggle="modal" data-target="#modal-player-info" style="padding: 1px; margin: 0 0.5px; max-width: 82px; background-color: #00ffb3; border-radius: 5px; cursor: pointer;">
									<img src=${item.urlPhoto.includes('player_silhouette') ? 'https://www.hltv.org/img/static/player/player_silhouette.png' : item.urlPhoto} alt=${item.full_name} style="width: 80px; height: 80px;">
									<div>
										<img src="https://hltv.org${item.flag_country}" alt=${item.country} style="width: 15px; height: 10px; display: inline-block; float: left; margin: 8px 0 0 6px;">
										<p class="nickname_player" style="display: block; text-align: center">${item.name}</p>
									</div>
								</div>`;
			});	
			modal_body.querySelector(".team_players").innerHTML = all_players;		
			var history_match = "";
			res.recentResults.map(item => {
				var score;
				if(+item.result.split(":")[0] > +item.result.split(":")[1]){
					score = `<div class="col-4 result" style="text-align: center;"><span style="color: green;">${item.result.split(":")[0]}</span> : <span style="color: red;">${item.result.split(":")[1]}</span></div>`;
				}else if(+item.result.split(":")[0] < +item.result.split(":")[1]){	
					score = `<div class="col-4 result" style="text-align: center;"><span style="color: red;">${item.result.split(":")[0]}</span> : <span style="color: green;">${item.result.split(":")[1]}</span></div>`;
				}else{
					score = `<div class="col-4 result" style="text-align: center;"><span style="color: black;">-</span> : <span style="color: black;">-</span></div>`;
				};
				history_match += `<div class="row match-result" data-h-match-id=${item.matchID} onclick="getMatchInfo(${item.matchID})" data-toggle="modal" data-target="#modal-match-info" style="margin: 2px 0; cursor: pointer;">
									<div class="col-4 team1" title=${res.name}>
										<img src=${res.logo} alt=${res.name} style="width: 20px; height: 20px;">
										<p style="text-align: left; margin-left: 3px;">${res.name}</p>
									</div>
									${score}
									<div class="col-4 team1" title=${item.enemyTeam.name}>
										<img src=${item.enemyTeam.logo.includes('placeholder.svg') || !item.enemyTeam.logo ? 'https://www.hltv.org/img/static/event/logo/noLogo.svg' : item.enemyTeam.logo} alt=${item.enemyTeam.name} style="width: 20px; height: 20px;">
										<p style="text-align: left; margin-left: 3px;">${item.enemyTeam.name}</p>
									</div>
								</div>
								<hr>`;
			});									
			modal_body.querySelector(".team_matches").innerHTML = `<div class="accordion" id="accordionRecentResults">
																	  	<div class="card">
																	    	<div class="card-header" id="headingOne" style="padding: 0;">
																	      	<h2 class="mb-0">
																	        	<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#recent_results_history_match" aria-expanded="true" aria-controls="recent_results_history_match" style="background-color: gray; text-decoration: none;">
																	          		<p>Recent results</p>
																	        	</button>
																	      	</h2>
																	    </div>
																	    <div id="recent_results_history_match" class="collapse" aria-labelledby="headingOne" data-parent="#accordionRecentResults"> 
																	    	${history_match}
																	    </div>
																	</div>`;
		});
	};
};

function getPlayerInfo(id){
	if(id != undefined){
		modalWindowPlayerInfo();
		HLTV.getPlayer({id: id}).then(res => {
		    var modal_body = document.getElementById("modal-player-info");
		    var placeholdersvg = res.imageLogoTeam.includes("placeholder.svg") ? `https://www.hltv.org${res.imageLogoTeam}` : res.imageLogoTeam;
		    modal_body.querySelector(".player_header").innerHTML = `<img src=${placeholdersvg} alt="${res.ign}" style="width: 200px; height: 200px; opacity: .5; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2;"/>
																<img src=${res.image.includes('player_silhouette') ? 'https://www.hltv.org/img/static/player/player_silhouette.png' : res.image} alt=${res.team.name} style="width: 200px; height: 200px; display: block; position: absolute; top: 50%; z-index: 4; left: 50%; transform: translate(-50%, -50%);"/>
																<div style="position: absolute; top: 100%; transform: translateY(-50%); width: 100%; padding-top: 20px;">
																	<h4 class="nick">${res.ign}</h4>
																	<h4 class="full_name">${res.name}</h4>
																</div>`;
			modal_body.querySelector(".player_main_info").innerHTML = `<div class="player_age" style="border-bottom: 1px solid black;">
																			<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Age:</p>
																			<span  style="display: block; text-align: right; font-weight: 700;">${res.age != undefined ? res.age : "-"}</span>
																		</div>
																		<div class="player_country" style="border-bottom: 1px solid black;">
																			<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left; margin-top: 2px;">Country:</p>
																			<span  style="display: block; text-align: right; font-weight: 700;">
																				<img src=https://hltv.org${res.countryFlag} alt=${res.country.name} style="width: 30px; height: 20px; margin: 5px;"/>
																				${res.country.name}
																			</span>
																		</div>
																		<div class="player_team">
																			<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Team:</p>
																			<span style="display: block; text-align: right; font-weight: 700;">
																				<img src=${placeholdersvg} alt="${res.team.name}" style="width: 20px; height: 20px; margin: 3px;"/>
																				${res.team.name}
																			</span>
																		</div>`;	
			modal_body.querySelector(".player_stats").innerHTML = `<div class="player_rating" style="border-bottom: 1px solid black;">
																		<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Rating:</p>
																		<span  style="display: block; text-align: right; font-weight: 700;">${res.statistics.rating}</span>
																	</div>
																	<div class="player_kill_per_round" style="border-bottom: 1px solid black;">
																		<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Kills per round:</p>
																		<span  style="display: block; text-align: right; font-weight: 700;">${res.statistics.killsPerRound}</span>
																	</div>
																	<div class="player_headshots" style="border-bottom: 1px solid black;">
																		<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Headshots:</p>
																		<span  style="display: block; text-align: right; font-weight: 700;">${res.statistics.headshots}</span>
																	</div>
																	<div class="player_map_played" style="border-bottom: 1px solid black;">
																		<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Maps played:</p>
																		<span  style="display: block; text-align: right; font-weight: 700;">${res.statistics.mapsPlayed}</span>
																	</div>
																	<div class="player_death_per_round" style="border-bottom: 1px solid black;">
																		<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Deaths per rounds:</p>
																		<span  style="display: block; text-align: right; font-weight: 700;">${res.statistics.deathsPerRound}</span>
																	</div>
																	<div class="player_round_contribution">
																		<p style="text-align: left; display: inline-block; vertical-align: bottom; float: left;">Rounds contribution:</p>
																		<span  style="display: block; text-align: right; font-weight: 700;">${res.statistics.roundsContributed}</span>
																	</div>`;																											
		});
	};
};

function getMatchInfo(id){
	if(id != undefined){
		modalWindowMatchInfo();
		HLTV.getMatch({id: id}).then(res => {
			var winner1 = res.winnerTeam != undefined ? res.winnerTeam.name == res.team1.name ? `<p style="background: blue; color: white; font-size: 10px; width: 40%; border-radius: 5px; position: absolute; top: 100%; left: 50%; transform: translate(-50%, -250%);">WINNER</p>` : "" : "";
			var winner2 = res.winnerTeam != undefined ? res.winnerTeam.name == res.team2.name ? `<p style="background: blue; color: white; font-size: 10px; width: 40%; border-radius: 5px; position: absolute; top: 100%; left: 50%; transform: translate(-50%, -250%);">WINNER</p>` : "" : "";
			var status = res.status == "LIVE" ? `<p style="background: red; color: white; border-radius: 5px;">${res.status}</p>` : `<p style="background: #b8aeb4; border-radius: 5px;">${res.status}</p>`
			var modal_body = document.getElementById("modal-match-info");
			modal_body.querySelector(".match_header").innerHTML = `<div class="row">
																		<div class="col-12 name_event" data-e-id=${res.event.id} style="margin-bottom: 20px;">
																		 	<h4>${res.event.name}</h4>
																		</div>
																	</div>
																	<div class="row">
																		<div class="col-4 date-match" title="${timeStartMatch(res.date)}"><p>${timeStartMatch(res.date)}</p></div>
																		<div class="col-4 match-status">
																			${status}
																		</div>
																		<div class="col-4 match-bo"><p>${res.format}</p></div>
																	</div>
																	<hr>
																	<div class="row align-items-center">
																		<div class="col-5 ${res.team1.name}">
																			<img src=${res.logo_team1 || 'https://img.icons8.com/dusk/64/000000/question-mark'} alt="${res.team1.name}" style="display: block; margin: 0 auto; width: 100px; height: 100px;"/>
																			<p>${res.team1.name}</p>
																			${winner1}
																		</div>
																		<div class="col-2"><p style="font-size: 30px;">VS</p></div>
																		<div class="col-5 ${res.team2.name}">
																			<img src=${res.logo_team2 || 'https://img.icons8.com/dusk/64/000000/question-mark'} alt="${res.team2.name}" style="display: block; margin: 0 auto; width: 100px; height: 100px;"/>
																			<p>${res.team2.name}</p>
																			${winner2}
																		</div>
																	</div>`;

			var maps = "";
			res.maps.map((item, index) => {
				var pick;
				res.vetoes.map((item2, index2) => {
					if(item2.map == item.name && item2.type == "picked"){
						pick = item2.team.name;
					};
				});
				var picked1 = pick == res.team1.name ? `<p style="font-size: 10px; background: blue; width: 40%; color: white; border-radius: 5px; position: absolute; top: 25%; left: -15%; transform: rotate(-90deg);">PICK</p>` : "";
				var picked2 = pick == res.team2.name ? `<p style="font-size: 10px; background: blue; width: 40%; color: white; border-radius: 5px; position: absolute; top: 25%; right: -15%; transform: rotate(-90deg);">PICK</p>` : "";
				var map_name = item.name != "tba" ? `<p style="color: white;">${mapsObject[item.name]}</p>` : `<p style="color: black">TBA</p>`;
				var score1 = item.result != undefined ? +item.result.split(" ")[0].split(":")[0] > +item.result.split(" ")[0].split(":")[1] ? `<p><span style="color: green;">${item.result.split(" ")[0].split(":")[0]}</span> : <span style="color: red;">${item.result.split(" ")[0].split(":")[1]}</span></p>` : `<p><span style="color: red;">${item.result.split(" ")[0].split(":")[0]}</span> : <span style="color: green;">${item.result.split(" ")[0].split(":")[1]}</span></p>` : `<p>- : -</p>`;
				maps += `<div class="accordion" id="accordion_${index}" style="margin: 5px 0;">
							<div class="card" style="border-radius: 10px;">
							    <div class="card-header" id="${mapsObject[item.name]}" style="padding: 0;">
							      	<h2 class="mb-0">
							        	<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#map_${index}" aria-expanded="true" aria-controls="map_${index}" style="background-image: url(${mapImg[item.name]}); background-repeat: no-repeat; background-size: cover; text-decoration: none;">
							         		${map_name}
							        	</button>
							      	</h2>
							    </div>
							    <div id="map_${index}" class="collapse" aria-labelledby="${mapsObject[item.name]}" data-parent="#accordion_${index}">
							      	<div class="card-body">
							      		<div class="row">
											<div class="col-4 ${res.team1.name}">
												<p>${res.team1.name}</p>
												${picked1}
											</div>
											<div class="col-4">
												${score1}
											</div>
											<div class="col-4 ${res.team2.name}">
												<p>${res.team2.name}</p>
												${picked2}
											</div>
										</div>
							      	</div>
							    </div>
							</div>
						</div>`;
			});
			modal_body.querySelector(".match_main_info").innerHTML = maps;

			var headTOhead = "";
			if(res.headToHead.length > 0){
				res.headToHead.map((item, index) => {
					var score = +item.result.split(" ")[0] > +item.result.split(" ")[2] ? `<p><span style="color: green;">${item.result.split(" ")[0]}</span> : <span style="color: red;">${item.result.split(" ")[2]}</span></p>` : `<p><span style="color: red;">${item.result.split(" ")[0]}</span> : <span style="color: green;">${item.result.split(" ")[2]}</span></p>`;
					var winner1 = item.winner != undefined && res.team1.name == item.winner.name ? `<p style="background: blue; color: white; font-size: 15px; width: 25px; height: 25px; border-radius: 50%; padding: 1px 3px; position: absolute; top: 0; right: -20%;">W</p>` : "";
					var winner2 = item.winner != undefined && res.team2.name == item.winner.name ? `<p style="background: blue; color: white; font-size: 15px; width: 25px; height: 25px; border-radius: 50%; padding: 1px 3px; position: absolute; top: 0; left: -20%;">W</p>` : "";
					headTOhead += `<div class="row" style="padding: 10px 0; position: relative;" title="${mapsObject[item.map]}">
										<div style="background-image: url(${mapImg[item.map]}); background-size: 100% 100%; background-repeat: no-repeat; width: 100%; height: 100%; position: absolute; top: 0; left: 0; transform: translate(0, 3%); opacity: .4;"></div>
										<div class="col-4" style="position: relative;">
											<p>${res.team1.name}</p>
											${winner1}
										</div>
										<div class="col-4" style="position: relative;">
											${score}
										</div>
										<div class="col-4" style="position: relative;">
											<p>${res.team2.name}</p>
											${winner2}
										</div>
									</div>
									<hr style="width: 100%;">`;
				});
			}else{
				headTOhead += `<div class="row" style="margin: 5px 0;">
									<div class="col-12">
										<p>No matches</p>
									</div>
								</div>`;
			};
			modal_body.querySelector(".match_head_to_head").innerHTML = `<div class="accordion" id="accordion_match_head_to_head">
																			<div class="card">
																			    <div class="card-header" id="m_h_t_h" style="padding: 0;">
																			      	<h2 class="mb-0">
																			        	<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#match_head-to-head" aria-expanded="true" aria-controls="match_head-to-head" style="text-decoration: none;">
																			         		<p>Head to Head</p>
																			        	</button>
																			      	</h2>
																			    </div>
																			    <div id="match_head-to-head" class="collapse" aria-labelledby="m_h_t_h" data-parent="#accordion_match_head_to_head">
																			    	${headTOhead}
																			    </div>
																		</div>`;
		});
	};
};

function modalWindowTeamInfo(){
	let createModal = document.createElement("div");
	createModal.className = "modal fade";
	createModal.id = "modal-team-info";
	createModal.style.cssText = "display: block;";
	createModal.setAttribute("data-backdrop", "static");
	createModal.setAttribute("data-keyboard", "false");
	createModal.setAttribute("tabindex", "-1");
	createModal.setAttribute("aria-hidden", "true");
	createModal.innerHTML = `<div class="modal-dialog modal-dialog-scrollable">
							    <div class="modal-content">
							      	<div class="modal-header">
							        	<h5 class="modal-title" id="staticBackdropLabel">Team Info</h5>
							        	<button type="button" class="close close_team_info" data-dismiss="modal" aria-label="Close">
							          		<span aria-hidden="true">&times;</span>
							        	</button>
							      	</div>
							      	<div class="modal-body">
							      		<div class="container">
							      			<div class="row">
							      				<div class="col-12 team_header" style="padding: 5px;"></div>
							      			</div>
							      			<div class="row">
							      				<div class="col-12 team_main_info" style="padding: 5px; background: gray; border-radius: 10px; margin: 5px 0;"></div>
							      			</div>
							      			<div class="row">
							      				<div class="col-12 team_players" style="display: flex; justify-content: space-around;"></div>
							      			</div>
							      			<div class="row">
							      				<div class="col-12 team_overview" style="padding: 0px; margin: 5px 0;"></div>
							      			</div>
							      			<div class="row">
							      				<div class="col-12 team_map_stats" style="padding: 0px; margin: 5px 0;"></div>
							      			</div>
							      			<div class="row">
							      				<div class="col-12 team_matches" style="padding: 0px; margin: 5px 0;"></div>
							      			</div>
							      		</div>
							      	</div>
							    </div>
							</div>`;
	document.body.prepend(createModal);

	let btn_close = document.querySelector(".close_team_info");
	btn_close.onclick = () => {
		document.getElementById("modal-team-info").remove();
		var remove = document.querySelectorAll(".modal-backdrop");
		for(let i = 0; i < remove.length; i++){
			remove[i].remove();
		};
	};
};

function modalWindowPlayerInfo(){
	let createModal = document.createElement("div");
	createModal.className = "modal fade";
	createModal.id = "modal-player-info";
	createModal.style.cssText = "display: block; padding: 0 20px 0 0;";
	createModal.setAttribute("data-backdrop", "static");
	createModal.setAttribute("data-keyboard", "false");
	createModal.setAttribute("tabindex", "-1");
	createModal.setAttribute("aria-hidden", "true");
	createModal.innerHTML = `<div class="modal-dialog modal-dialog-scrollable">
							    <div class="modal-content">
							      	<div class="modal-header">
							        	<h5 class="modal-title" id="staticBackdropLabel">Player Info</h5>
							        	<button type="button" class="close close_player_info" aria-label="Close">
							          		<span aria-hidden="true">&times;</span>
							        	</button>
							      	</div>
							      	<div class="modal-body">
							      		<div class="container">
							      			<div class="row">
							      				<div class="col-12 player_header" style="padding: 5px; width: 100%; height: 220px;"></div>
							      			</div>
							      			<div class="row">
							      				<div class="col-12 player_main_info" style="padding: 5px; border-radius: 10px; margin: 35px 0 5px 0; background: #fadcdc;"></div>
							      			</div>
							      			<div class="row">
							      				<div class="col-12 player_stats" style="padding: 5px; border-radius: 10px; margin: 5px 0 5px 0; background: #fadcdc;"></div>
							      			</div>
							      		</div>
							      	</div>
							    </div>
							</div>`;
	document.body.prepend(createModal);

	$("#modal-team-info").modal("hide");
	let btn_close = document.querySelector(".close_player_info");
	btn_close.onclick = () => {
		document.getElementById("modal-player-info").remove();
		$("#modal-team-info").modal("show");
	};
};

function modalWindowMatchInfo(){
	let createModal = document.createElement("div");
	createModal.className = "modal fade";
	createModal.id = "modal-match-info";
	createModal.style.cssText = "display: block; padding: 0 20px 0 0;";
	createModal.setAttribute("data-backdrop", "static");
	createModal.setAttribute("data-keyboard", "false");
	createModal.setAttribute("tabindex", "-1");
	createModal.setAttribute("aria-hidden", "true");
	createModal.innerHTML = `<div class="modal-dialog modal-dialog-scrollable">
							    <div class="modal-content">
							      	<div class="modal-header">
							        	<h5 class="modal-title" id="staticBackdropLabel">Match Info</h5>
							        	<button type="button" class="close close_match_info" aria-label="Close">
							          		<span aria-hidden="true">&times;</span>
							        	</button>
							      	</div>
							      	<div class="modal-body">
							      		<div class="container">
							      			<div class="row">
							      				<div class="col-12 match_header" style="padding: 5px; width: 100%;"></div>
							      			</div>
							      			<div class="row">
							      				<hr style="width: 100%;">
							      				<div class="col-12 match_main_info" style="padding: 5px;"></div>
							      			</div>
							      			<div class="row">
							      				<hr style="width: 100%;">
							      				<div class="col-12 match_head_to_head" style="padding: 5px;"></div>
							      			</div>
							      		</div>
							      	</div>
							    </div>
							</div>`;
	document.body.prepend(createModal);

	$("#modal-team-info").modal("hide");
	let btn_close = document.querySelector(".close_match_info");
	btn_close.onclick = () => {
		document.getElementById("modal-match-info").remove();
		$("#modal-team-info").modal("show");
	};
};
/*----------- DOTA ------------*/
// async function connectToScorebotDota(){
// 	try{
// 		var CONNECTION = 'wss://dltv.org:2083/';
// 		var list_online_match_id = JSON.stringify({channel:"online_match_5690929816",auth:{headers:{"X-CSRF-TOKEN":"t"}}});
// 		var socket = io(CONNECTION);

// 		socket.on('connect', () => {
// 			socket.emit("subscribe", list_online_match_id);
// 			console.log("Connected");
// 		});
// 		socket.on('disconnect', () => {
// 			console.log("Disconnected");
// 		});
// 		socket.on('error', () => {
// 			console.log("Error");
// 		});
// 		// socket.on('Wms\Dota\Events\MatchData', 'online_match_5690795075', data => {
// 		// 	console.log(data);
// 		// });
// 	}catch(e){
// 		console.log("ERROR", e);
// 	};
// };
//connectToScorebotDota();
/*-----------------------------*/

async function mapPoolPick(id){
	try{
		var { body } = await got(`https://www.hltv.org/matches/${id}/match`, headers);
		var $ = cheerio.load(body);
		var vetoBox = $(".veto-box")[1];
	    if(vetoBox != undefined){
	      	var $ = cheerio.load(vetoBox);
	      	var mapPool = $(".padding > div").map(function(){
	      		var text = $(this).text();
	      		var indexOfPick = text.indexOf("picked");
	      		var indexOfRemove = text.indexOf("removed");
	      		var indexOfWasLeft = text.indexOf("was left over")
	      		var vb = {};
	      		if(indexOfPick != -1){
	      			var poolMap = {};
	      			poolMap.team = text.split(" ").slice(0, -2).slice(1).join(" ");
	      			poolMap.pick = text.split(" ")[text.split(" ").length - 1];
	      			vb.picked = poolMap;
	      		};
	      		if(indexOfRemove != -1){
	      			var removedMap = {};
	      			removedMap.team = text.split(" ").slice(0, -2).slice(1).join(" ");
	      			removedMap.pick = text.split(" ")[text.split(" ").length - 1];
	      			vb.removed = removedMap;
	      		};
	      		if(indexOfWasLeft != -1){
	      			var leftMap = {};
	      			leftMap.team = "";
	      			leftMap.pick = text.split(" ")[1];
	      			vb.left = leftMap
	      		};
	      		return vb;
	      	}).get();
	      	return mapPool;
	    };
	}catch(e){
		console.log("ERROR", e);
	};
};

function timeLast(t){
	var h, m;

	let lt = Math.round((+t - Date.now())/60000);

	if(lt >= 60){
		let h_string = String(lt / 60).split(".")[0];
		h = +h_string;
		m = lt % 60;
	}else{
		h = 0;
		m = lt;
	};

	return {h: +h, m: +m};
};

function timeStartMatch(t){
	var a = new Date(+t);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = (a.getMinutes() == 0) ? "00" : a.getMinutes();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
	return time;
};

function windowsNotification(t, mn){
	if(+t.m >= 0){
		let iconLogo = (mn.eventLogo != "") ? `${mn.eventLogo}` : "https://dltv.org/storage/app/uploads/public/9c3/cb7/e9e/thumb__40_40_0_0_auto.png"; 
		var notification = new Notification(`Старт через ${t.m} минут!`, {
			body: `${mn.team1.trim()} : ${mn.team2}`,
			icon: iconLogo
		});
	};
};

function programmNotification(pn, g){
	if(localStorage.getItem('programm_notification') == 1 && pn.length > 0){
		var htmlMatch = "";
		
		pn.map(item => {
			htmlMatch += `<h3>[${g}]</h3>
						<div style="display: flex; flex-direction: row; justify-content: space-around; margin: 5px 0;">
							<img class="teamLogo" src=${item.logoTeam1} alt=${g == "DOTA" ? item.team1.trim() : item.team1}/>
							<p style="margin: auto;">${g == "DOTA" ? item.team1.trim() : item.team1} : ${item.team2}</p>
							<img class="teamLogo" src=${item.logoTeam2} alt=${item.team2}/>
						</div>`;
		});

		Swal.fire({
			position: 'top-end',
			showConfirmButton: false,
  			timer: 5000,
  			timerProgressBar: true,
		  	icon: "warning",
		  	title: `Старт менее чем ${localStorage.getItem('last_time')} минут.`,
		  	html: `${htmlMatch}`,
		  	didOpen: (toast) => {
			    toast.addEventListener('click', Swal.close)
			}
		});

		sound.play();
	};
};

function modalSettingWindow(){
	let switch_win_notification = (localStorage.getItem("windows_notification") == 1) ? "checked" : "";
	let switch_prog_notification = (localStorage.getItem("programm_notification") == 1) ? "checked" : "";
	let switch_sound_score_change = (localStorage.getItem("sound_score_change") == 1) ? "checked" : "";

	let createModal = document.createElement("div");
	createModal.className = "modal fade";
	createModal.id = "modal-settings";
	createModal.setAttribute("data-backdrop", "static");
	createModal.setAttribute("data-keyboard", "false");
	createModal.setAttribute("tabindex", "-1");
	createModal.setAttribute("aria-hidden", "true");
	createModal.innerHTML = `<div class="modal-dialog">
							    <div class="modal-content">
							      	<div class="modal-header">
							        	<h5 class="modal-title" id="staticBackdropLabel">Setting</h5>
							        	<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							          		<span aria-hidden="true">&times;</span>
							        	</button>
							      	</div>
							      	<div class="modal-body">
							      		<div class="input-group">
										  	<div class="input-group-prepend">
										    	<span class="input-group-text">Notify for: </span>
										  	</div>
										  	<input type="number" class="form-control input_time" value="${localStorage.getItem('last_time')}">
										  	<div class="input-group-append">
										    	<span class="input-group-text">minutes</span>
										  	</div>
										</div>
										<div class="custom-control custom-switch">
										  	<input type="checkbox" class="custom-control-input" id="customSwitchWindowsNotification" ${switch_win_notification}>
										  	<label class="custom-control-label" for="customSwitchWindowsNotification">Windows notification</label>
										</div>
										<div class="custom-control custom-switch">
										  	<input type="checkbox" class="custom-control-input" id="customSwitchProgrammNotification" ${switch_prog_notification}>
										  	<label class="custom-control-label" for="customSwitchProgrammNotification">Programm notification</label>
										</div>
										<div class="custom-control custom-switch">
										  	<input type="checkbox" class="custom-control-input" id="soundChangeScore" ${switch_sound_score_change}>
										  	<label class="custom-control-label" for="soundChangeScore">Sound score change</label>
										</div>
							      	</div>
							      	<div class="modal-footer">
							        	<button type="button" class="btn btn-secondary btn-close" data-dismiss="modal">Close</button>
							        	<button type="button" class="btn btn-primary btn_ok">OK</button>
							      	</div>
							    </div>
							</div>`;
	document.body.prepend(createModal);

	let btn_close = document.querySelector(".btn-close");
	let close = document.querySelector(".close");
	let btn_ok = document.querySelector(".btn_ok");
	let win_notification = document.getElementById("customSwitchWindowsNotification");
	let prog_notification = document.getElementById("customSwitchProgrammNotification");
	let sound_notification = document.getElementById("soundChangeScore");

	btn_close.onclick = (event) => {
		removeModal();
	};

	close.onclick = (event) => {
		removeModal();
	};

	win_notification.onclick = (event) => {
		changeNotification(win_notification, event.target.id);
	};

	prog_notification.onclick = (event) => {
		changeNotification(prog_notification, event.target.id);
	};

	sound_notification.onclick = (event) => {
		changeNotification(sound_notification, event.target.id);
	};

	btn_ok.onclick = (event) => {
		saveSetting();
	};

	function removeModal(){
		document.getElementById("modal-settings").remove();
	};

	function saveSetting(){
		let input_time = document.querySelector(".input_time");
		let createAlert = document.createElement("div");
		createAlert.className = "alert alert-warning";
		createAlert.setAttribute("role", "alert");
		createAlert.style.cssText = "margin: 15px 0 0 0; width: inherit; text-align: center;";
		createAlert.innerText = "Invalid value entered!";

		if(+input_time.value <= 0 || input_time.value == ""){
			if(document.querySelector(".alert-warning") == null) input_time.after(createAlert);
		}else{
			localStorage.last_time = +input_time.value;
			btn_ok.setAttribute("data-dismiss", "modal");
			removeModal();
			const Saved = Swal.mixin({
			  	toast: true,
			  	position: 'top-end',
			  	showConfirmButton: false,
			  	timer: 1000,
			  	timerProgressBar: true
			});

			Saved.fire({
			  	icon: "success",
			  	title: "Saved"
			});
		};
	};

	function changeNotification(selector, target_id){
		switch(target_id){
			case "customSwitchWindowsNotification":
			 	if(localStorage.getItem("windows_notification") == 1){
			 		localStorage.windows_notification = 0;
			 		selector.removeAttribute("checked"); 
			 	}else{
			 		localStorage.windows_notification = 1;
			 		selector.setAttribute("checked", ""); 
			 	};
				break;
			case "customSwitchProgrammNotification":
				if(localStorage.getItem("programm_notification") == 1){
					localStorage.programm_notification = 0;
					selector.removeAttribute("checked");
				}else{
					localStorage.programm_notification = 1;
					selector.setAttribute("checked", "");
				};
				break;
			case "soundChangeScore":
				if(localStorage.getItem("sound_score_change") == 1){
					localStorage.sound_score_change = 0;
					selector.removeAttribute("checked");
				}else{
					localStorage.sound_score_change = 1;
					selector.setAttribute("checked", "");
				};	
				break;
		};
	};
};

(() => {
	const switch_3 = document.querySelector(".switch_3");
	switch_3.onclick = (event) => {
		switch(localStorage.getItem('dark_light')){
			case "0":
				localStorage.dark_light = 1;
				darkLightMode();
				break;
			case "1":
				localStorage.dark_light = 0;
				darkLightMode();
				break;
			case null:
				localStorage.setItem('dark_light', 1);
				darkLightMode();
				break;
		};
	};
	function darkLightMode(){
		let hh = document.querySelectorAll(".hr-header");
		let th = document.querySelectorAll(".title-header");
		switch(localStorage.getItem('dark_light')){
			case "0":
				document.body.style.cssText = 'background-color: black;';
				for(let i = 0; i < hh.length; i++){
					hh[i].style.cssText = 'background-color: white;';
				};
				for(let i = 0; i < th.length; i++){
					th[i].style.cssText = 'background-color: black; color: white;';
				};
				break;
			case "1":
				switch_3.setAttribute('checked', '');
				document.body.style.cssText = 'background-color: white;';
				for(let i = 0; i < hh.length; i++){
					hh[i].style.cssText = 'background-color: black;';
				};
				for(let i = 0; i < th.length; i++){
					th[i].style.cssText = 'background-color: white; color: black;';
				};
				break;
			case null:
				document.body.style.cssText = 'background-color: black;';
				for(let i = 0; i < hh.length; i++){
					hh[i].style.cssText = 'background-color: white;';
				};
				for(let i = 0; i < th.length; i++){
					th[i].style.cssText = 'background-color: black; color: white;';
				};
				break;
		};
	};
	darkLightMode();

	if(matchContainer.children.length == 0){
		Toast(0);

		var checked = setInterval(() => {
			if(matchContainer.children.length > 0){
				clearTimeout(checked);
				Toast(1);
			};
		}, 100);
	}else{
		Toast(1);
	};

	function Toast(num){
		var icon, title, timer;

		switch(num){
			case 0:
				icon = 'info';
				title = 'Update HLTV | DLTV';
				timer = 4000;
				break;
			case 1:
				icon = 'success';
				title = 'Updated';
				timer = 1000;	
		};

		const Toast = Swal.mixin({
		  	toast: true,
		  	position: 'top-end',
		  	showConfirmButton: false,
		  	timer: timer,
		  	timerProgressBar: true
		});

		Toast.fire({
		  	icon: icon,
		  	title: title
		});
	};
})();