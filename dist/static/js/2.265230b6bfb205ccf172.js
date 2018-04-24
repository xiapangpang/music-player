webpackJsonp([2],{"9kGq":function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t("Dd8w"),o=t.n(r),s=t("NYxO"),a=t("Sgn/"),i=t("PvFA"),c=t("qgJM"),u={data:function(){return{songs:[]}},computed:o()({},Object(s.c)(["singer"]),{title:function(){return this.singer.name},bgImage:function(){return this.singer.avatar}}),created:function(){this._getDetail()},methods:{_getDetail:function(){var e=this;this.singer.id?Object(a.a)(this.singer.id).then(function(n){0===n.code&&(e.songs=e._normalizeSongs(n.data.list))}):this.$router.push("/singer")},_normalizeSongs:function(e){var n=[];return e.forEach(function(e){var t=e.musicData;t.albummid&&t.songid&&n.push(Object(i.a)(t))}),n}},components:{MusicList:c.a}},f={render:function(){var e=this.$createElement,n=this._self._c||e;return n("transition",{attrs:{name:"slide"}},[n("music-list",{attrs:{songs:this.songs,title:this.title,"bg-image":this.bgImage}})],1)},staticRenderFns:[]};var l=t("VU/8")(u,f,!1,function(e){t("NFb5")},"data-v-4b5260ed",null);n.default=l.exports},EarI:function(e,n){var t=1e3,r=60*t,o=60*r,s=24*o,a=365.25*s;function i(e,n,t){if(!(e<n))return e<1.5*n?Math.floor(e/n)+" "+t:Math.ceil(e/n)+" "+t+"s"}e.exports=function(e,n){n=n||{};var c,u=typeof e;if("string"===u&&e.length>0)return function(e){if((e=String(e)).length>100)return;var n=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(!n)return;var i=parseFloat(n[1]);switch((n[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return i*a;case"days":case"day":case"d":return i*s;case"hours":case"hour":case"hrs":case"hr":case"h":return i*o;case"minutes":case"minute":case"mins":case"min":case"m":return i*r;case"seconds":case"second":case"secs":case"sec":case"s":return i*t;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return i;default:return}}(e);if("number"===u&&!1===isNaN(e))return n.long?i(c=e,s,"day")||i(c,o,"hour")||i(c,r,"minute")||i(c,t,"second")||c+" ms":function(e){if(e>=s)return Math.round(e/s)+"d";if(e>=o)return Math.round(e/o)+"h";if(e>=r)return Math.round(e/r)+"m";if(e>=t)return Math.round(e/t)+"s";return e+"ms"}(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}},"Fy0/":function(e,n,t){(function(r){function o(){var e;try{e=n.storage.debug}catch(e){}return!e&&void 0!==r&&"env"in r&&(e=Object({NODE_ENV:"production"}).DEBUG),e}(n=e.exports=t("vmzn")).log=function(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)},n.formatArgs=function(e){var t=this.useColors;if(e[0]=(t?"%c":"")+this.namespace+(t?" %c":" ")+e[0]+(t?"%c ":" ")+"+"+n.humanize(this.diff),!t)return;var r="color: "+this.color;e.splice(1,0,r,"color: inherit");var o=0,s=0;e[0].replace(/%[a-zA-Z%]/g,function(e){"%%"!==e&&"%c"===e&&(s=++o)}),e.splice(s,0,r)},n.save=function(e){try{null==e?n.storage.removeItem("debug"):n.storage.debug=e}catch(e){}},n.load=o,n.useColors=function(){if("undefined"!=typeof window&&window.process&&"renderer"===window.process.type)return!0;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},n.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:function(){try{return window.localStorage}catch(e){}}(),n.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],n.formatters.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},n.enable(o())}).call(n,t("W2nU"))},NFb5:function(e,n){},"Sgn/":function(e,n,t){"use strict";var r=t("woOf"),o=t.n(r),s=t("//Fk"),a=t.n(s),i=t("hU7x"),c=t.n(i);function u(e,n,t){return e+=(e.indexOf("?")<0?"?":"&")+function(e){var n="";for(var t in e){void 0===e[t]&&(e[t]="");var r=e[t];n+="&"+t+"="+encodeURIComponent(r)}return n?n.substring(1):""}(n),new a.a(function(n,r){c()(e,t,function(e,t){e?r(e):n(t)})})}n.b=function(){var e=o()({},f,{channel:"singer",page:"list",key:"all_all_all",pagesize:100,pagenum:1,hostUin:0,needNewCode:0,platform:"yqq",format:"jsonp"});return u("https://c.y.qq.com/v8/fcg-bin/v8.fcg",e,l)},n.a=function(e){var n=o()({},f,{hostUin:0,needNewCode:0,platform:"yqq",format:"jsonp",order:"listen",begin:0,num:100,songstatus:1,singermid:e});return u("https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg",n,l)};var f={g_tk:916037377,inCharset:"utf-8",outCharset:"utf-8",notice:0},l={param:"jsonpCallback",prefix:"jp"}},hU7x:function(e,n,t){var r=t("Fy0/")("jsonp");e.exports=function(e,n,t){"function"==typeof n&&(t=n,n={});n||(n={});var a,i,c=n.prefix||"__jp",u=n.name||c+o++,f=n.param||"callback",l=null!=n.timeout?n.timeout:6e4,d=encodeURIComponent,g=document.getElementsByTagName("script")[0]||document.head;l&&(i=setTimeout(function(){m(),t&&t(new Error("Timeout"))},l));function m(){a.parentNode&&a.parentNode.removeChild(a),window[u]=s,i&&clearTimeout(i)}return window[u]=function(e){r("jsonp got",e),m(),t&&t(null,e)},e=(e+=(~e.indexOf("?")?"&":"?")+f+"="+d(u)).replace("?&","?"),r('jsonp req "%s"',e),(a=document.createElement("script")).src=e,g.parentNode.insertBefore(a,g),function(){window[u]&&m()}};var o=0;function s(){}},vmzn:function(e,n,t){var r;function o(e){function t(){if(t.enabled){var e=t,o=+new Date,s=o-(r||o);e.diff=s,e.prev=r,e.curr=o,r=o;for(var a=new Array(arguments.length),i=0;i<a.length;i++)a[i]=arguments[i];a[0]=n.coerce(a[0]),"string"!=typeof a[0]&&a.unshift("%O");var c=0;a[0]=a[0].replace(/%([a-zA-Z%])/g,function(t,r){if("%%"===t)return t;c++;var o=n.formatters[r];if("function"==typeof o){var s=a[c];t=o.call(e,s),a.splice(c,1),c--}return t}),n.formatArgs.call(e,a),(t.log||n.log||console.log.bind(console)).apply(e,a)}}return t.namespace=e,t.enabled=n.enabled(e),t.useColors=n.useColors(),t.color=function(e){var t,r=0;for(t in e)r=(r<<5)-r+e.charCodeAt(t),r|=0;return n.colors[Math.abs(r)%n.colors.length]}(e),"function"==typeof n.init&&n.init(t),t}(n=e.exports=o.debug=o.default=o).coerce=function(e){return e instanceof Error?e.stack||e.message:e},n.disable=function(){n.enable("")},n.enable=function(e){n.save(e),n.names=[],n.skips=[];for(var t=("string"==typeof e?e:"").split(/[\s,]+/),r=t.length,o=0;o<r;o++)t[o]&&("-"===(e=t[o].replace(/\*/g,".*?"))[0]?n.skips.push(new RegExp("^"+e.substr(1)+"$")):n.names.push(new RegExp("^"+e+"$")))},n.enabled=function(e){var t,r;for(t=0,r=n.skips.length;t<r;t++)if(n.skips[t].test(e))return!1;for(t=0,r=n.names.length;t<r;t++)if(n.names[t].test(e))return!0;return!1},n.humanize=t("EarI"),n.names=[],n.skips=[],n.formatters={}}});
//# sourceMappingURL=2.265230b6bfb205ccf172.js.map