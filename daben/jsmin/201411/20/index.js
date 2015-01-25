var Cookie=function(e,t,i){if(arguments.length>1&&"[object Object]"!==String(t)){if(i=jQuery.extend({},i),(null===t||void 0===t)&&(i.expires=-1),"number"==typeof i.expires){var r=i.expires,n=i.expires=new Date;n.setDate(n.getDate()+r)}return t=String(t),document.cookie=[encodeURIComponent(e),"=",i.raw?t:encodeURIComponent(t),i.expires?"; expires="+i.expires.toUTCString():"",i.path?"; path="+i.path:"",i.domain?"; domain="+i.domain:"",i.secure?"; secure":""].join("")}i=t||{};var o,s=i.raw?function(e){return e}:decodeURIComponent;return(o=new RegExp("(?:^|; )"+encodeURIComponent(e)+"=([^;]*)").exec(document.cookie))?s(o[1]):null},IsLoginMi=function(){var e=Cookie("userId");return e?!0:!1},FbRedirectUrl=function(e){var t="https://www.facebook.com/dialog/oauth/?client_id="+e.appID+"&redirect_uri="+e.redirect_uri+"&state="+e.state+"&scope="+e.scope+"&dislay=page";location.href=t},FbGetPicture=function(e,t){var i="https://graph.facebook.com/"+e+"/picture";return t&&(i=i+"?width="+t),i},FbInit=function(e,t){window.fbAsyncInit=function(){FB.init({appId:e,xfbml:!0,version:"v2.1"}),t&&t()},function(e,t,i){var r,n=e.getElementsByTagName(t)[0];e.getElementById(i)||(r=e.createElement(t),r.id=i,r.src="//connect.facebook.net/en_ALL/sdk.js",n.parentNode.insertBefore(r,n))}(document,"script","facebook-jssdk")},MI={};MI.Api={},MI.Api.FbInit=FbInit,MI.Api.Cookie=Cookie,MI.Api.IsLoginMi=IsLoginMi,MI.Api.FbRedirectUrl=FbRedirectUrl,MI.Api.FbGetPicture=FbGetPicture,MI.Christ={},MI.Christ.loginFbflag=!1,MI.Christ.loginMiflag=!1,MI.Christ.friendlist=[],MI.Christ.options={},MI.Christ.user={},MI.Christ.room_id=0,MI.Christ.SocketCreated=!1,MI.Christ.ws={},MI.Christ.countdown={},MI.Christ.robnum=0,MI.Christ.selfnum=0,MI.Christ.enemynum=0,MI.Christ.isStartCal=!1,MI.Christ.enemy={};var MiCheckLogin=function(e,t){var i=MI.Api.IsLoginMi();i?(MI.Christ.loginMiflag=!0,t()):(MI.Christ.loginMiflag=!1,e&&(location.href=e+location.href+"?_reback"))},FbJudgeHeadImg=function(e){FB.api("/me/picture",function(t){if(t&&!t.error){var i=t.data;MI.Christ.user.is_silhouette=i.is_silhouette,MI.Christ.user.picture=MI.Api.FbGetPicture(MI.Christ.user.fbuserid),e&&e()}})},FbGetFriendsInfo=function(e){var t=function(){var t=MI.Christ.friendlist;for(var i in t){var r=t[i];r.img=MI.Api.FbGetPicture(r.id)}console.log(MI.Christ.friendlist),e&&e()};FB.api("/me/friends",function(e){e&&!e.error&&(MI.Christ.friendlist=e.data,t())})},FbCheckPermission=function(e){FB.api("/"+e+"/permissions",function(e){if(e&&!e.error){var t=e.data,i=!1;for(var r in t){var n=t[r];"user_friends"==n.permission&&(i=!0)}i?(MI.Christ.loginFbflag=!0,FbGetFriendsInfo(MI.Christ.options.getFbFriendOver),FbJudgeHeadImg(MI.Christ.options.getFbPictureOver)):(MI.Christ.loginFbflag=!1,ChristFbRedirect())}})},FbEnsureLogin=function(){FB.getLoginStatus(function(e){"connected"===e.status?(MI.Christ.user.fbuserid=e.authResponse.userID,MI.Christ.user.accessToken=e.authResponse.accessToken,FbCheckPermission(e.authResponse.userID)):(MI.Christ.loginFbflag=!1,ChristFbRedirect())},{scope:"user_friends"})},ChristFbRedirect=function(){var e={appID:MI.Christ.options.appId,redirect_uri:location.href,scope:"user_friends,public_profile",state:"_reback"};MI.Api.FbRedirectUrl(e)},AdaptRoomSuc=function(e){MI.Christ.enemy={fbuserid:e.peer_info.fbuserid,headID:e.peer_info.headID,isdefaultPic:e.peer_info.isdefaultPic},MI.Christ.options.adaptSucc(MI.Christ.enemy),MI.Christ.room_id=e.room_id,MI.Christ.isStartCal=!0},WaitConnect=function(){var e=10,t=function(){e--,console.log("还剩余时间",e),0>e&&(MI.Christ.ws.close(),MI.Christ.robnum=200,ReduceRobot())};MI.Christ.countdown=setInterval(t,1e3)},ReduceRobot=function(){var e=MI.Christ.robnum,t=2e4,i=parseInt(t/e),r=0,n=function(){r++,r>e&&clearInterval(o),MI.Christ.options.unitEnemyPress(r)},o=setInterval(n,i)},numAddSelf=function(){MI.Christ.selfnum++,MI.Christ.options.unitSelfPress(MI.Christ.selfnum)},numAddEnemy=function(){MI.Christ.enemynum++,MI.Christ.options.unitEnemyPress(MI.Christ.enemynum)},SpacePress=function(){var e={urlkey:"shengdan/click",room_id:MI.Christ.room_id};MI.Christ.ws.send(JSON.stringify(e))},WebSocketOpen=function(){var e=0;MI.Christ.user.is_silhouette&&(e=1);var t={urlkey:"shengdan/online",fbuserid:MI.Christ.user.fbuserid,token:MI.Christ.user.accessToken,isdefaultPic:e,headID:MI.Christ.user.headID,locale:MI.Christ.options.origin,cookie:document.cookie};MI.Christ.ws.send(JSON.stringify(t))},AdaptRoom=function(e){var t=e.data.is_ok;1==t?AdaptRoomSuc(e.data):console.log("建立房间")},WebSocketOnMes=function(e){var t=e.data,i=$.parseJSON(t);"online"==i.callback&&AdaptRoom(i),"click"==i.callback&&1==i.data.is_ok&&(0==i.is_push?numAddSelf():numAddEnemy())},WebSocketClose=function(){console.log("connect close")},WebSocketError=function(){console.log("connect error")},WebSocketConnect=function(e,t,i,r){!MI.Christ.SocketCreated||0!=MI.Christ.ws.readyState&&1!=MI.Christ.ws.readyState||MI.Christ.ws.close();try{MI.Christ.ws=new WebSocket("ws://"+MI.Christ.options.connectUrl+"/ws"),MI.Christ.SocketCreated=!0}catch(n){return void console.log("connect error",n)}ws=MI.Christ.ws,e&&(ws.onopen=e),t&&(ws.onmessage=t),i&&(ws.onclose=i),r&&(ws.onerror=r)},GameStart=function(e){MI.Christ.user.headID=e,window.WebSocket?WebSocketConnect(WebSocketOpen,WebSocketOnMes,WebSocketClose,WebSocketError):console.log("not support WebSocket")},ChallengeStart=function(){var e=MI.Christ.options,t=function(){FbEnsureLogin()};MiCheckLogin(e.loginUrl,t)},PageInitLoad=function(e){MI.Christ.options=e;var t=function(){e.loadFbOver();var t=location.href;console.log(t.indexOf("_reback"),"ss"),-1!=t.indexOf("_reback")&&ChallengeStart()};MI.Api.FbInit(e.appId,t)};MI.Christ.PageInitLoad=PageInitLoad,MI.Christ.ChallengeStart=ChallengeStart,MI.Christ.GameStart=GameStart,MI.Christ.SpacePress=SpacePress;