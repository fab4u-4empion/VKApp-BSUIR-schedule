(this.webpackJsonpsrc=this.webpackJsonpsrc||[]).push([[0],{132:function(e,t,r){},134:function(e,t,r){"use strict";r.r(t);var n=r(0),c=r.n(n),s=r(14),i=r.n(s),a=r(9),o=r.n(a),l=r(8),u=(r(131),r(132),r(32)),j=r(33),d=r(35),b=r(34),h=r(135),O=r(5),f=function(e){Object(d.a)(r,e);var t=Object(b.a)(r);function r(e){var n;return Object(u.a)(this,r),(n=t.call(this,e)).state={hasError:!1},n}return Object(j.a)(r,[{key:"render",value:function(){return this.state.hasError?Object(O.jsx)(l.D,{children:Object(O.jsx)(l.m,{children:Object(O.jsxs)(l.s,{stretched:!0,icon:Object(O.jsx)(h.a,{fill:"var(--dynamic_red)"}),children:["\u041d\u0435\u0442 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f \u043a \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442\u0443 ",Object(O.jsx)("br",{})," \u0412\u043a\u043b\u044e\u0447\u0438\u0442\u0435 \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442 \u0438 \u043f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0441 \u043e\u0447\u0438\u0441\u0442\u043a\u043e\u0439 \u043a\u044d\u0448\u0430"]})})}):this.props.children}}],[{key:"getDerivedStateFromError",value:function(e){return console.log(e),{hasError:!0}}}]),r}(c.a.Component),v=r(136),x=function(){var e=Object(l.F)().viewWidth;return Object(O.jsx)(l.e,{children:Object(O.jsx)(l.a,{children:Object(O.jsx)(l.b,{children:Object(O.jsx)(l.z,{header:Object(O.jsx)(l.n,{separator:!1}),children:Object(O.jsx)(l.y,{spaced:e&&e>l.E.MOBILE,children:Object(O.jsxs)(l.s,{Placeholder:!0,stretched:!0,icon:Object(O.jsx)(v.a,{fill:"var(--dynamic_red)"}),children:["\u0421\u0435\u0440\u0432\u0438\u0441 \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u0441 \u0432\u044b\u043a\u043b\u044e\u0447\u0435\u043d\u043d\u044b\u043c\u0438 Cookie ",Object(O.jsx)("br",{})," \u0438\u043b\u0438 \u0432 \u0440\u0435\u0436\u0438\u043c\u0435 \u0438\u043d\u043a\u043e\u0433\u043d\u0438\u0442\u043e"]})})})})})})},p=r(23),g=Object(n.lazy)((function(){return Promise.all([r.e(3),r.e(5)]).then(r.bind(null,176))})),y=function(){var e=Object(l.G)();return Object(O.jsx)(p.b,{children:Object(O.jsx)(l.e,{platform:e===l.C?"android":e,children:Object(O.jsx)(l.a,{children:Object(O.jsx)(l.b,{children:Object(O.jsx)(f,{children:Object(O.jsx)(n.Suspense,{fallback:Object(O.jsx)(l.u,{}),children:Object(O.jsx)(g,{})})})})})})})};try{localStorage.setItem("test","test"),sessionStorage.setItem("groupsFavorite",JSON.stringify([])),sessionStorage.setItem("teachersFavorite",JSON.stringify([])),o.a.send("VKWebAppStorageGet",{keys:["groupsFavorite","teachersFavorite"]}).then((function(e){console.log(e),e.keys[0].value&&sessionStorage.setItem("groupsFavorite",e.keys[0].value),e.keys[1].value&&sessionStorage.setItem("teachersFavorite",e.keys[1].value),o.a.send("VKWebAppInit"),o.a.subscribe((function(e){"VKWebAppUpdateConfig"===e.detail.type&&document.body.setAttribute("scheme",e.detail.data.scheme)})),history.pushState({activeStory:"favorites",searchValue:"",isSearch:!1,favorites_activePanel:"favorites-list",body_overflow:"visible"},""),i.a.render(Object(O.jsx)(y,{}),document.getElementById("root"))}))}catch(S){i.a.render(Object(O.jsx)(x,{}),document.getElementById("root"))}Promise.all([r.e(4),r.e(6)]).then(r.bind(null,175)).then((function(e){e.default}))},23:function(e,t,r){"use strict";r.d(t,"a",(function(){return d})),r.d(t,"b",(function(){return b}));var n=r(22),c=r(16),s=r(0),i=r(9),a=r.n(i),o=r(8),l=r(20),u=r(5),j=Object(s.createContext)(),d=function(){return Object(s.useContext)(j)},b=function(e){var t=e.children,r=Object(s.useState)(JSON.parse(sessionStorage.getItem("groupsFavorite"))),i=Object(c.a)(r,2),d=i[0],b=i[1],h=Object(s.useState)(JSON.parse(sessionStorage.getItem("teachersFavorite"))),O=Object(c.a)(h,2),f=O[0],v=O[1],x=Object(s.useState)(null),p=Object(c.a)(x,2),g=p[0],y=p[1];return Object(u.jsx)(j.Provider,{value:{favoriteGroups:d,favoriteTeachers:f,errorSnackbar:g,toggleGroupsFavoriteFlag:function(e){var t=Object(n.a)(d),r=null;t.includes(e)?(t.splice(t.indexOf(e),1),r=Object(u.jsx)(o.x,{onClose:function(){y(null)},before:Object(u.jsx)(l.a,{fill:"var(--dynamic_red)",width:24,height:24}),duration:1700,children:'\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u0433\u0440\u0443\u043f\u043f\u0443 \u0438\u0437 "\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435"'})):(t.push(e),r=Object(u.jsx)(o.x,{onClose:function(){y(null)},before:Object(u.jsx)(l.a,{fill:"var(--dynamic_red)",width:24,height:24}),duration:1700,children:'\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0433\u0440\u0443\u043f\u043f\u0443 \u0432 "\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435"'})),a.a.send("VKWebAppStorageSet",{key:"groupsFavorite",value:JSON.stringify(t)}).then((function(){b(t)})).catch((function(){y(r)}))},toggleTeachersFavoriteFlag:function(e){var t=Object(n.a)(f),r=null;t.includes(e)?(t.splice(t.indexOf(e),1),r=Object(u.jsx)(o.x,{onClose:function(){y(null)},before:Object(u.jsx)(l.a,{fill:"var(--dynamic_red)",width:24,height:24}),duration:1700,children:'\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u0435\u043f\u043e\u0434\u0430\u0432\u0430\u0442\u0435\u043b\u044f \u0438\u0437 "\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435"'})):(t.push(e),r=Object(u.jsx)(o.x,{onClose:function(){y(null)},before:Object(u.jsx)(l.a,{fill:"var(--dynamic_red)",width:24,height:24}),duration:1700,children:'\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u0440\u0435\u043f\u043e\u0434\u0430\u0432\u0430\u0442\u0435\u043b\u044f \u0432 "\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435"'})),a.a.send("VKWebAppStorageSet",{key:"teachersFavorite",value:JSON.stringify(t)}).then((function(){v(t)})).catch((function(){y(r)}))}},children:t})}}},[[134,1,2]]]);
//# sourceMappingURL=main.c1a9f978.chunk.js.map