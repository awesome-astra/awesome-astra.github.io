(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["cassandra"],{"0500":function(e,t,a){},"8afc":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"cass-view full-height"},[a("router-view",{staticClass:"flex"})],1)},s=[],c=a("2b0e"),u=a("5566"),n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("h2",{staticClass:"el-route-breadcrumbs"},e._l(e.matchedBreadcrumbs,(function(t,r){return a("span",{key:t.path},[a("router-link",{attrs:{to:t.path}},[e._v(e._s(t.label))]),r<e.matchedBreadcrumbs.length-1?a("span",{staticClass:"el-route-breadcrumbs__separator"},[e._v("»")]):e._e()],1)})),0)},l=[],o=c["default"].extend({name:"RouteBreadcrumbs",props:{route:{type:Object,required:!0}},computed:{matchedBreadcrumbs(){return this.buildBreadcrumbsFromRoute(this.route)}},methods:{buildBreadcrumbsFromRoute(e){const t=new Array;return e&&e.matched&&e.matched.forEach(a=>{let{breadcrumbText:r}=a.meta;if(r){"function"===typeof r&&(r=r.call(null,e));const s=a.path.replace(/:(\w*)/g,(t,a)=>encodeURIComponent(e.params[a]));t.push({label:r,path:s})}}),t}}}),d=o,i=a("2877"),m=Object(i["a"])(d,n,l,!1,null,null,null),b=m.exports,p=a("0613"),h=a("fc60"),f=c["default"].extend({name:"CassView",components:{RouteBreadcrumbs:b},data(){return{Routes:u["a"]}},created(){p["a"].dispatch(h["a"].FetchCassandraFeatures)}}),w=f,_=(a("ab8a"),Object(i["a"])(w,r,s,!1,null,"eefa04c2",null));t["default"]=_.exports},ab8a:function(e,t,a){"use strict";a("0500")}}]);
//# sourceMappingURL=cassandra.8ef86d35.js.map