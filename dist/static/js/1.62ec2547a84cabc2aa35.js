webpackJsonp([1],{EarI:function(t,e){var n=1e3,r=60*n,s=60*r,i=24*s,o=365.25*i;function a(t,e,n){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+n:Math.ceil(t/e)+" "+n+"s"}t.exports=function(t,e){e=e||{};var c,u=typeof t;if("string"===u&&t.length>0)return function(t){if((t=String(t)).length>100)return;var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(!e)return;var a=parseFloat(e[1]);switch((e[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return a*o;case"days":case"day":case"d":return a*i;case"hours":case"hour":case"hrs":case"hr":case"h":return a*s;case"minutes":case"minute":case"mins":case"min":case"m":return a*r;case"seconds":case"second":case"secs":case"sec":case"s":return a*n;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return a;default:return}}(t);if("number"===u&&!1===isNaN(t))return e.long?a(c=t,i,"day")||a(c,s,"hour")||a(c,r,"minute")||a(c,n,"second")||c+" ms":function(t){if(t>=i)return Math.round(t/i)+"d";if(t>=s)return Math.round(t/s)+"h";if(t>=r)return Math.round(t/r)+"m";if(t>=n)return Math.round(t/n)+"s";return t+"ms"}(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},"Fy0/":function(t,e,n){(function(r){function s(){var t;try{t=e.storage.debug}catch(t){}return!t&&void 0!==r&&"env"in r&&(t=Object({NODE_ENV:"production"}).DEBUG),t}(e=t.exports=n("vmzn")).log=function(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)},e.formatArgs=function(t){var n=this.useColors;if(t[0]=(n?"%c":"")+this.namespace+(n?" %c":" ")+t[0]+(n?"%c ":" ")+"+"+e.humanize(this.diff),!n)return;var r="color: "+this.color;t.splice(1,0,r,"color: inherit");var s=0,i=0;t[0].replace(/%[a-zA-Z%]/g,function(t){"%%"!==t&&"%c"===t&&(i=++s)}),t.splice(i,0,r)},e.save=function(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(t){}},e.load=s,e.useColors=function(){if("undefined"!=typeof window&&window.process&&"renderer"===window.process.type)return!0;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},e.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:function(){try{return window.localStorage}catch(t){}}(),e.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],e.formatters.j=function(t){try{return JSON.stringify(t)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}},e.enable(s())}).call(e,n("W2nU"))},Pns5:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n("Dd8w"),s=n.n(r),i=n("Sgn/"),o=n("Ewld"),a=n("3Q4o"),c=n("SC/i"),u={props:{data:{type:Array,default:function(){return[]}}},computed:{shortcutList:function(){return this.data.map(function(t){return t.title.substring(0,1)})},fixedTitle:function(){return this.scrollY>0?"":this.data[this.currentIndex]?this.data[this.currentIndex].title:""}},data:function(){return{scrollY:-1,currentIndex:0,diff:-1}},created:function(){this.touch={},this.listenScroll=!0,this.listHeight=[],this.probeType=3},methods:{onShortcutTouchStart:function(t){var e=Object(a.b)(t.target,"index"),n=t.touches[0];this.touch.y1=n.pageY,this.touch.anchorIndex=e,this._scrollTo(e)},onShortcutTouchMove:function(t){var e=t.touches[0];this.touch.y2=e.pageY;var n=(this.touch.y2-this.touch.y1)/18|0,r=parseInt(this.touch.anchorIndex)+n;this._scrollTo(r)},scroll:function(t){this.scrollY=t.y},selectItem:function(t){this.$emit("select",t)},_scrollTo:function(t){(t||0===t)&&(t<0?t=0:t>this.listHeight.length-2&&(t=this.listHeight.length-2),this.scrollY=this.$refs.listview.scroll.y,this.$refs.listview.scrollToElement(this.$refs.listGroup[t],0))},_calculateHeight:function(){this.listHeight=[];var t=this.$refs.listGroup,e=0;this.listHeight.push(e);for(var n=0;n<t.length;n++){e+=t[n].clientHeight,this.listHeight.push(e)}},refresh:function(){this.$refs.listview.refresh()}},watch:{data:function(){var t=this;setTimeout(function(){t._calculateHeight()},20)},scrollY:function(t){var e=this.listHeight;if(t>0)this.currentIndex=0;else{for(var n=0;n<e.length-1;n++){var r=e[n],s=e[n+1];if(-t>=r&&-t<s)return this.currentIndex=n,void(this.diff=s+t)}this.currentIndex=e.length-2}},diff:function(t){var e=t>0&&t<30?t-30:0;this.fixedTop!==e&&(this.fixedTop=e,this.$refs.fixed.style.transform="translate3d(0,"+e+"px,0)")}},components:{Scroll:o.a,Loading:c.a}},l={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("scroll",{ref:"listview",staticClass:"listview",attrs:{data:t.data,"listen-scroll":t.listenScroll,"probe-type":t.probeType},on:{scroll:t.scroll}},[n("ul",t._l(t.data,function(e,r){return n("li",{key:r,ref:"listGroup",refInFor:!0,staticClass:"list-group"},[n("h2",{staticClass:"list-group-title"},[t._v(t._s(e.title))]),t._v(" "),n("ul",t._l(e.items,function(e,r){return n("li",{key:r,staticClass:"list-group-item",on:{click:function(n){t.selectItem(e)}}},[n("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.avatar,expression:"item.avatar"}],staticClass:"avatar",attrs:{alt:""}}),t._v(" "),n("span",{staticClass:"name"},[t._v(t._s(e.name))])])}))])})),t._v(" "),n("div",{staticClass:"list-shortcut",on:{touchstart:function(e){return e.stopPropagation(),e.preventDefault(),t.onShortcutTouchStart(e)},touchmove:function(e){return e.stopPropagation(),e.preventDefault(),t.onShortcutTouchMove(e)},touchend:function(t){t.stopPropagation()}}},[n("ul",t._l(t.shortcutList,function(e,r){return n("li",{key:r,staticClass:"item",class:{current:t.currentIndex===r},attrs:{"data-index":r}},[t._v(t._s(e))])}))]),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.fixedTitle,expression:"fixedTitle"}],ref:"fixed",staticClass:"list-fixed"},[n("h1",{staticClass:"fixed-title"},[t._v(t._s(t.fixedTitle))])]),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:!t.data.length,expression:"!data.length"}],staticClass:"loading-container"},[n("loading")],1)])},staticRenderFns:[]};var f=n("VU/8")(u,l,!1,function(t){n("Sa65")},"data-v-68a730b6",null).exports,h=n("NYxO"),d=n("F4+m"),g={data:function(){return{singers:[]}},created:function(){this._getSingerList()},methods:s()({selectSinger:function(t){this.$router.push({path:"/singer/"+t.id}),this.setSinger(t)},_getSingerList:function(){var t=this;Object(i.b)().then(function(e){0===e.code&&(t.singers=t._normalizeSingers(e.data.list))})},_normalizeSingers:function(t){var e={hot:{title:"热门",items:[]}};t.forEach(function(t,n){n<10&&e.hot.items.push({id:t.Fsinger_mid,name:t.Fsinger_name,avatar:"https://y.gtimg.cn/music/photo_new/T001R150x150M000"+t.Fsinger_mid+".jpg?max_age=2592000"});var r=t.Findex;e[r]||(e[r]={title:r,items:[]}),e[r].items.push({id:t.Fsinger_mid,name:t.Fsinger_name,avatar:"https://y.gtimg.cn/music/photo_new/T001R150x150M000"+t.Fsinger_mid+".jpg?max_age=259200"})});var n=[],r=[];for(var s in e){var i=e[s];"热门"===i.title?n.push(i):i.title.match(/[a-zA-Z]/)&&r.push(i)}return r.sort(function(t,e){return t.title.charCodeAt(0)-e.title.charCodeAt(0)}),n.concat(r)}},Object(h.d)({setSinger:"SET_SINGER"}),{handlePlaylist:function(t){var e=t.length>0?"60px":"";this.$refs.singer.style.bottom=e,this.$refs.list.refresh()}}),components:{ListView:f},mixins:[d.a]},p={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{ref:"singer",staticClass:"singer"},[e("list-view",{ref:"list",attrs:{data:this.singers},on:{select:this.selectSinger}}),this._v(" "),e("router-view")],1)},staticRenderFns:[]};var m=n("VU/8")(g,p,!1,function(t){n("TIiL")},"data-v-41537fb4",null);e.default=m.exports},Sa65:function(t,e){},"Sgn/":function(t,e,n){"use strict";var r=n("woOf"),s=n.n(r),i=n("//Fk"),o=n.n(i),a=n("hU7x"),c=n.n(a);function u(t,e,n){return t+=(t.indexOf("?")<0?"?":"&")+function(t){var e="";for(var n in t){void 0===t[n]&&(t[n]="");var r=t[n];e+="&"+n+"="+encodeURIComponent(r)}return e?e.substring(1):""}(e),new o.a(function(e,r){c()(t,n,function(t,n){t?r(t):e(n)})})}e.b=function(){var t=s()({},l,{channel:"singer",page:"list",key:"all_all_all",pagesize:100,pagenum:1,hostUin:0,needNewCode:0,platform:"yqq",format:"jsonp"});return u("https://c.y.qq.com/v8/fcg-bin/v8.fcg",t,f)},e.a=function(t){var e=s()({},l,{hostUin:0,needNewCode:0,platform:"yqq",format:"jsonp",order:"listen",begin:0,num:100,songstatus:1,singermid:t});return u("https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg",e,f)};var l={g_tk:916037377,inCharset:"utf-8",outCharset:"utf-8",notice:0},f={param:"jsonpCallback",prefix:"jp"}},TIiL:function(t,e){},hU7x:function(t,e,n){var r=n("Fy0/")("jsonp");t.exports=function(t,e,n){"function"==typeof e&&(n=e,e={});e||(e={});var o,a,c=e.prefix||"__jp",u=e.name||c+s++,l=e.param||"callback",f=null!=e.timeout?e.timeout:6e4,h=encodeURIComponent,d=document.getElementsByTagName("script")[0]||document.head;f&&(a=setTimeout(function(){g(),n&&n(new Error("Timeout"))},f));function g(){o.parentNode&&o.parentNode.removeChild(o),window[u]=i,a&&clearTimeout(a)}return window[u]=function(t){r("jsonp got",t),g(),n&&n(null,t)},t=(t+=(~t.indexOf("?")?"&":"?")+l+"="+h(u)).replace("?&","?"),r('jsonp req "%s"',t),(o=document.createElement("script")).src=t,d.parentNode.insertBefore(o,d),function(){window[u]&&g()}};var s=0;function i(){}},vmzn:function(t,e,n){var r;function s(t){function n(){if(n.enabled){var t=n,s=+new Date,i=s-(r||s);t.diff=i,t.prev=r,t.curr=s,r=s;for(var o=new Array(arguments.length),a=0;a<o.length;a++)o[a]=arguments[a];o[0]=e.coerce(o[0]),"string"!=typeof o[0]&&o.unshift("%O");var c=0;o[0]=o[0].replace(/%([a-zA-Z%])/g,function(n,r){if("%%"===n)return n;c++;var s=e.formatters[r];if("function"==typeof s){var i=o[c];n=s.call(t,i),o.splice(c,1),c--}return n}),e.formatArgs.call(t,o),(n.log||e.log||console.log.bind(console)).apply(t,o)}}return n.namespace=t,n.enabled=e.enabled(t),n.useColors=e.useColors(),n.color=function(t){var n,r=0;for(n in t)r=(r<<5)-r+t.charCodeAt(n),r|=0;return e.colors[Math.abs(r)%e.colors.length]}(t),"function"==typeof e.init&&e.init(n),n}(e=t.exports=s.debug=s.default=s).coerce=function(t){return t instanceof Error?t.stack||t.message:t},e.disable=function(){e.enable("")},e.enable=function(t){e.save(t),e.names=[],e.skips=[];for(var n=("string"==typeof t?t:"").split(/[\s,]+/),r=n.length,s=0;s<r;s++)n[s]&&("-"===(t=n[s].replace(/\*/g,".*?"))[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")))},e.enabled=function(t){var n,r;for(n=0,r=e.skips.length;n<r;n++)if(e.skips[n].test(t))return!1;for(n=0,r=e.names.length;n<r;n++)if(e.names[n].test(t))return!0;return!1},e.humanize=n("EarI"),e.names=[],e.skips=[],e.formatters={}}});
//# sourceMappingURL=1.62ec2547a84cabc2aa35.js.map