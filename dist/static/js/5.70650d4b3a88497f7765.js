webpackJsonp([5],{BRgg:function(t,e,n){"use strict";e.b=function(){var t=o()({},l,{platform:"h5",needNewCode:1,format:"json"});return c.a.get("/v8/fcg-bin/fcg_myqq_toplist.fcg",{params:t}).then(function(t){return i.a.resolve(t.data)})},e.a=function(t){var e=o()({},l,{topid:t,platform:"h5",needNewCode:1,tpl:3,page:"detail",type:"top",format:"json"});return c.a.get("/v8/fcg-bin/fcg_v8_toplist_cp.fcg",{params:e}).then(function(t){return i.a.resolve(t.data)})};var s=n("//Fk"),i=n.n(s),a=n("woOf"),o=n.n(a),r=n("mtWM"),c=n.n(r),l={g_tk:916037377,inCharset:"utf-8",outCharset:"utf-8",notice:0}},Ec4O:function(t,e){},wrZl:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n("Dd8w"),i=n.n(s),a=n("BRgg"),o=n("Ewld"),r=n("SC/i"),c=n("F4+m"),l=n("NYxO"),u={data:function(){return{topList:[]}},created:function(){this._getTopList()},methods:i()({_getTopList:function(){var t=this;Object(a.b)().then(function(e){0===e.code&&(t.topList=e.data.topList)})},handlePlaylist:function(t){var e=t.length?"60px":"";this.$refs.rank.style.bottom=e,this.$refs.toplist.refresh()},selectItem:function(t){this.$router.push({path:"/rank/"+t.id}),this.setTopList(t)}},Object(l.d)({setTopList:"SET_TOP_LIST"})),watch:{topList:function(){var t=this;setTimeout(function(){t.$Lazyload.lazyLoadHandler()},20)}},components:{Scroll:o.a,Loading:r.a},mixins:[c.a]},f={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"rank",staticClass:"rank"},[n("scroll",{ref:"toplist",staticClass:"toplist",attrs:{data:t.topList}},[n("ul",t._l(t.topList,function(e,s){return n("li",{key:s,staticClass:"item",on:{click:function(n){t.selectItem(e)}}},[n("div",{staticClass:"icon"},[n("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.picUrl,expression:"item.picUrl"}],attrs:{width:"100",height:"100",alt:""}})]),t._v(" "),n("ul",{staticClass:"songlist"},t._l(e.songList,function(e,s){return n("li",{key:s,staticClass:"song"},[n("span",[t._v(t._s(s+1))]),t._v(" "),n("span",[t._v(t._s(e.songname)+" - "+t._s(e.singername))])])}))])})),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:!t.topList.length,expression:"!topList.length"}],staticClass:"loading-container"},[n("loading")],1)]),t._v(" "),n("router-view")],1)},staticRenderFns:[]};var p=n("VU/8")(u,f,!1,function(t){n("Ec4O")},"data-v-5b900562",null);e.default=p.exports}});
//# sourceMappingURL=5.70650d4b3a88497f7765.js.map