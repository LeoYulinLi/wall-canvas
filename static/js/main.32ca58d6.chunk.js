(this["webpackJsonpwall-canvas"]=this["webpackJsonpwall-canvas"]||[]).push([[0],{107:function(e,t,a){},221:function(e,t,a){"use strict";a.r(t);var r=a(7),n=a(0),c=a.n(n),o=a(18),i=a.n(o),u=(a(107),a(60)),l=a.n(u),d=a(224),f=a(14),s=a.p+"static/media/Tileable_Red_Brick_Texturise_NORMAL.13f500e2.jpg",h=a.p+"static/media/Tileable_Red_Brick_Texturise.fdc6adbf.jpg",g=a(92),j=a.n(g),p=a(61),v=a.n(p),b=a(62),O=a.n(b),m=a(37),x=a.n(m),C=a(100),w=a(226),k=a(227),_=a(225),D=function(e){var t=e.strokeColor,a=e.setStrokeColor,c=e.strokeWidth,o=e.setStrokeWidth,i=e.clearDrawing,u=e.saveDrawing,l=Object(n.useState)(!1),d=Object(f.a)(l,2),s=d[0],h=d[1];return Object(r.jsxs)("div",{className:x.a.palette,children:[Object(r.jsx)(C.a,{onChange:function(e){return a(e.hex)},color:t,colors:["#000000","#ffffff","#d00000","#ea8c00","#eac300","#00a000","#b7ea00","#0000c0","#00c7ea","#7500ea","#bf00ea","#ea00b0","#555555","#d2d2d2","#ffc6c6","#ffd999","#fff0ab","#adffad","#ecffb2","#9ad7ff","#9affe8","#9d9aff","#e4a8f3","#ff9ae6"],className:x.a.colorPicker}),Object(r.jsx)(w.a,{children:Object(r.jsxs)(w.a.Group,{controlId:"strokeWidth",className:x.a.strokePicker,children:[Object(r.jsxs)(w.a.Label,{children:["Stroke Width: ",c]}),Object(r.jsx)(w.a.Control,{type:"range",min:5,max:60,custom:!0,value:c,onChange:function(e){return o(+e.target.value)}})]})}),Object(r.jsx)(k.a,{type:"button",variant:"danger",onClick:function(){return h(!0)},children:"Clear Drawing"}),Object(r.jsx)(k.a,{type:"button",onClick:u,children:"Save Drawing"}),Object(r.jsxs)(_.a,{show:s,onHide:function(){return h(!1)},centered:!0,children:[Object(r.jsx)(_.a.Header,{closeButton:!0,children:Object(r.jsx)(_.a.Title,{children:"Clear Drawing"})}),Object(r.jsx)(_.a.Body,{children:"Are you sure you want to clear the current drawing? This action cannot be undone."}),Object(r.jsxs)(_.a.Footer,{children:[Object(r.jsx)(k.a,{variant:"secondary",onClick:function(){return h(!1)},children:"Close"}),Object(r.jsx)(k.a,{variant:"danger",onClick:function(){i(),h(!1)},children:"Clear Drawing"})]})]})]})};function y(e){var t=Math.sqrt(e.reduce((function(e,t){return e+t*t}),0));return e.map((function(e){return e/t}))}function S(e,t){for(var a=0,r=0;r<e.length;r++)a+=e[r]*t[r];return a}function M(e,t,a){for(var r=[],n=function(e,t){var a=t.x-e.x,r=t.y-e.y;return Math.sqrt(a*a+r*r)}(e,t),c=function(e,t){return Math.atan2(t.x-e.x,t.y-e.y)}(e,t),o=e.x,i=e.y,u=0;u<n;u+=a)r.push({x:o+Math.sin(c)*u,y:i+Math.cos(c)*u});return r}var E=function(e){var t=window.devicePixelRatio,a=e.canvasWidth,c=e.canvasHeight,o=Object(n.useRef)(null),i=Object(n.useRef)(document.createElement("canvas")),u=Object(n.useRef)(document.createElement("canvas")),l=Object(n.useRef)(document.createElement("img")),d=Object(n.useRef)(document.createElement("img")),g=Object(n.useState)(null),p=Object(f.a)(g,2),b=p[0],m=p[1],x=Object(n.useState)([]),C=Object(f.a)(x,2),w=C[0],k=C[1],_=Object(n.useState)([]),E=Object(f.a)(_,2),I=E[0],R=E[1],P=Object(n.useState)(!1),H=Object(f.a)(P,2),N=H[0],W=H[1],B=Object(n.useState)({width:Math.floor(a*t),height:Math.floor(c*t)}),T=Object(f.a)(B,2),A=T[0],L=(T[1],Object(n.useState)("#9AFFE8")),F=Object(f.a)(L,2),G=F[0],q=F[1],J=Object(n.useState)(40),U=Object(f.a)(J,2),X=U[0],Y=U[1],K=Object(n.useState)({prev:null,current:null}),V=Object(f.a)(K,2),z=V[0],Q=V[1],Z=Object(n.useCallback)(j()(Q,20),[]);return Object(n.useEffect)((function(){if(o.current){var e;null===(e=o.current)||void 0===e||e.appendChild(i.current);var a=A.width,r=A.height;i.current.height=r,i.current.width=a,i.current.setAttribute("style","width: ".concat(a/t,"px; max-width: 100%"))}}),[o.current]),Object(n.useEffect)((function(){l.current.src=s,l.current.onload=function(){var e=document.createElement("canvas"),t=e.getContext("2d"),a=u.current.getContext("2d");if(t&&a){var r=A.width,n=A.height;e.width=r,e.height=n;var c=t.createPattern(l.current,"repeat");if(c){t.fillStyle=c,t.fillRect(0,0,r,n);for(var o=t.getImageData(0,0,r,n),i=o.data,d=[],f=[],s=y([1,3,6]),h=[0,0,1],g=0;g<i.length;g+=4){var j=y([i[g]-128,i[g+1]-128,i[g+2]-128]),p=S(j,s);d.push(p);for(var v=[],b=0;b<3;b++)v[b]=2*p*(j[b]-s[b]);var O=S(y(v),h);f.push(Math.pow(O,3)),i[g]=Math.floor(255*p),i[g+1]=Math.floor(255*p),i[g+2]=Math.floor(255*p)}k(d),R(f),u.current.width=r,u.current.height=n,a.putImageData(o,0,0),a.lineCap="round";for(var m=a.getImageData(0,0,r,n),x=m.data,C=0;C<x.length;C+=4)x[C+3]=0;a.putImageData(m,0,0,0,0,r,n)}}}}),[A]),Object(n.useEffect)((function(){d.current.src=h,d.current.onload=function(){var e=document.createElement("canvas"),t=e.getContext("2d");if(t){var a=A.width,r=A.height;e.width=a,e.height=r;var n=t.createPattern(d.current,"repeat");if(n){t.fillStyle=n,t.fillRect(0,0,a,r);var c=t.getImageData(0,0,a,r);m(c.data)}}}}),[A]),Object(n.useEffect)((function(){i.current.onpointermove=function(e){if(e.preventDefault(),N){var t=i.current.getBoundingClientRect(),a=i.current.width/t.width,r=i.current.height/t.height;Z((function(n){return{prev:n.current,current:{x:Math.floor((e.clientX-t.left)*a),y:Math.floor((e.clientY-t.top)*r)}}}))}},i.current.ontouchmove=function(e){if(e.preventDefault(),N){var t=i.current.getBoundingClientRect(),a=i.current.width/t.width,r=i.current.height/t.height,n=e.touches[0].clientX,c=e.touches[0].clientY;Z((function(e){return{prev:e.current,current:{x:Math.floor((n-t.left)*a),y:Math.floor((c-t.top)*r)}}}))}}}),[i.current,N]),Object(n.useEffect)((function(){i.current.onpointerdown=function(e){e.preventDefault(),W(!0)};var e=function(e){e.preventDefault(),W(!1),Z((function(e){return{prev:e.current,current:null}}))};i.current.ontouchend=e,i.current.onpointerup=e}),[]),Object(n.useEffect)((function(){var e=i.current.getContext("2d");if(0!==w.length&&b&&e){for(var t=A.width,a=A.height,r=e.getImageData(0,0,t,a),n=r.data,c=0;c<b.length/4;c++)b[4*c]=b[4*c]*w[c],b[4*c+1]=b[4*c+1]*w[c],b[4*c+2]=b[4*c+2]*w[c];for(var o=0;o<b.length;o++)n[o]=b[o];e.putImageData(r,0,0,0,0,t,a)}}),[w,b]),Object(n.useEffect)((function(){var e=u.current.getContext("2d"),t=i.current.getContext("2d");if(e&&t&&z.prev&&z.current&&b){var a=z.prev,r=z.current;M(a,r,X/4).forEach((function(t){var a=t.x,r=t.y,n=e.createRadialGradient(a,r,0,a,r,X);n.addColorStop(0,G),n.addColorStop(.5,v()(G,.3)),n.addColorStop(1,v()(G,0)),e.fillStyle=n,e.fillRect(a-X,r-X,2*X,2*X)}));for(var n=a.x,c=a.y,o=r.x,l=r.y,d=(n<o?n:o)-X,f=(c<l?c:l)-X,s=(n<o?o:n)-d+X,h=(c<l?l:c)-f+X,g=A.width,j=A.height,p=e.getImageData(0,0,g,j).data,O=t.getImageData(0,0,g,j),m=O.data,x=0;x<s*h;x++){var C=d+x%s+(f+Math.floor(x/s))*g,k=p[4*C+3]/255,_=k*I[C]*2e3,D={r:k*(8+p[4*C])*w[C],g:k*(8+p[4*C+1])*w[C],b:k*(8+p[4*C+2])*w[C]};m[4*C]=D.r+_+(1-k)*b[4*C],m[4*C+1]=D.g+_+(1-k)*b[4*C+1],m[4*C+2]=D.b+_+(1-k)*b[4*C+2]}t.putImageData(O,0,0,0,0,g,j)}}),[u.current,b,i.current,z]),Object(r.jsxs)("div",{className:O.a.panel,children:[Object(r.jsx)("div",{className:O.a.canvasContainer,ref:o}),Object(r.jsx)(D,{strokeColor:G,setStrokeColor:q,strokeWidth:X,setStrokeWidth:Y,clearDrawing:function(){if(b){var e=A.width,t=A.height,a=u.current.getContext("2d"),r=i.current.getContext("2d");if(a&&r){for(var n=a.getImageData(0,0,e,t),c=n.data,o=r.getImageData(0,0,e,t),l=o.data,d=0;d<c.length;d++)c[d]=0;a.putImageData(n,0,0,0,0,e,t);for(var f=0;f<b.length;f++)l[f]=b[f];r.putImageData(o,0,0,0,0,e,t)}}},saveDrawing:function(){var e=document.createElement("a");e.href=i.current.toDataURL("image/png").replace("data:image/png","data:application/octet-stream"),e.download="drawing.png",document.body.appendChild(e),e.click(),document.body.removeChild(e)}})]})},I=function(){return Object(r.jsxs)(d.a,{className:l.a.appContainer,children:[Object(r.jsx)("h1",{className:l.a.appHeader,children:"Wall Canvas"}),Object(r.jsx)(E,{canvasWidth:screen.width>800?800:screen.width,canvasHeight:screen.height-100>600?600:screen.height-100})]})},R=a(98),P=a(9);i.a.render(Object(r.jsx)(c.a.StrictMode,{children:Object(r.jsx)(R.a,{children:Object(r.jsx)(P.c,{children:Object(r.jsx)(P.a,{exact:!0,path:"/",component:I})})})}),document.getElementById("root"))},37:function(e,t,a){e.exports={palette:"Palette_palette__3tLi0",strokePicker:"Palette_strokePicker__25ejT",colorPicker:"Palette_colorPicker__1HHU9"}},60:function(e,t,a){e.exports={appContainer:"App_appContainer__19Cyd",appHeader:"App_appHeader__iN9K5"}},62:function(e,t,a){e.exports={panel:"Panel_panel__3VGf8",canvasContainer:"Panel_canvasContainer__3gM-_"}}},[[221,1,2]]]);
//# sourceMappingURL=main.32ca58d6.chunk.js.map