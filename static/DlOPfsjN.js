import{s as F,v as j,x as q,A as Y,r as v,C as N,af as X,M as D,k as z,ag as J,m as G,ah as K,H as Q,ai as Z,L as ee,i as te,b as o,J as B,S as ae,a as c,_ as oe,e as le,a7 as ne,c as se,w as r,G as re,o as ie,d as h}from"#entry";import{V as ue,d as ce,a as de,e as ve,b as me,c as fe}from"./DSUDakof.js";import{t as pe,f as ge,v as ye,w as xe,d as Te,g as M,x as Ve,a as be,V as R,k as ke,l as I}from"./oUUxz8iw.js";import{i as Ce,p as he,o as we,m as Se,b as Ee,q as _e,g as Pe,k as Ae,V as O}from"./B40JzDP1.js";import{V as Le,u as Re}from"./BEMpPPyS.js";import{a as Ie}from"./CJn3Air_.js";import{V as $}from"./CbOIDRWz.js";const Oe=`輔一甲
特教一
教博一
復碩一
高照原民專班一
科博一
數一甲
物一甲
生一
化一
光博一
統資碩一
理學位碩一
科技機電產攜專班一
人管博一
車輛碩一
AI碩士學程一
智車一
技職碩一
英一
國一甲
地一
美一
科英碩一
翻譯碩一
台文碩一
歷碩一
機電一
電機一
電機博一
電子一
資工一
工學位碩一
資管一
會一甲
企管一
財金一
運一
運碩一
運健碩一
公育一
特殊學籍班(大學部)

`;function Ne(a){const d=N(a());let s=-1;function l(){clearInterval(s)}function T(){l(),ee(()=>d.value=a())}function V(f){const b=f?getComputedStyle(f):{transitionDuration:.2},m=parseFloat(b.transitionDuration)*1e3||200;if(l(),d.value<=0)return;const p=performance.now();s=window.setInterval(()=>{const g=performance.now()-p+m;d.value=Math.max(a()-g,0),d.value<=0&&l()},m)}return Z(l),{clear:l,time:d,start:V,reset:T}}const De=j({multiLine:Boolean,text:String,timer:[Boolean,String],timeout:{type:[Number,String],default:5e3},vertical:Boolean,...xe({location:"bottom"}),...ye(),...Ee(),...Se(),...Q(),...K(Te({transition:"v-snackbar-transition"}),["persistent","noClickAnimation","scrim","scrollStrategy","stickToTarget"])},"VSnackbar"),Ge=F()({name:"VSnackbar",props:De(),emits:{"update:modelValue":a=>!0},setup(a,d){let{slots:s}=d;const l=q(a,"modelValue"),{positionClasses:T}=pe(a),{scopeId:V}=Ce(),{themeClasses:f}=Y(a),{colorClasses:b,colorStyles:m,variantClasses:p}=he(a),{roundedClasses:g}=we(a),k=Ne(()=>Number(a.timeout)),E=v(),_=v(),C=N(!1),P=N(0),A=v(),L=te(Le,void 0);X(()=>!!L,()=>{const i=Re();ae(()=>{A.value=i.mainStyles.value})}),D(l,e),D(()=>a.timeout,e),z(()=>{l.value&&e()});let w=-1;function e(){k.reset(),window.clearTimeout(w);const i=Number(a.timeout);if(!l.value||i===-1)return;const S=J(_.value);k.start(S),w=window.setTimeout(()=>{l.value=!1},i)}function t(){k.reset(),window.clearTimeout(w)}function n(){C.value=!0,t()}function u(){C.value=!1,e()}function y(i){P.value=i.touches[0].clientY}function x(i){Math.abs(P.value-i.changedTouches[0].clientY)>50&&(l.value=!1)}function H(){C.value&&u()}const U=G(()=>a.location.split(" ").reduce((i,S)=>(i[`v-snackbar--${S}`]=!0,i),{}));return Ie(()=>{const i=M.filterProps(a),S=!!(s.default||s.text||a.text);return o(M,B({ref:E,class:["v-snackbar",{"v-snackbar--active":l.value,"v-snackbar--multi-line":a.multiLine&&!a.vertical,"v-snackbar--timer":!!a.timer,"v-snackbar--vertical":a.vertical},U.value,T.value,a.class],style:[A.value,a.style]},i,{modelValue:l.value,"onUpdate:modelValue":W=>l.value=W,contentProps:B({class:["v-snackbar__wrapper",f.value,b.value,g.value,p.value],style:[m.value],onPointerenter:n,onPointerleave:u},i.contentProps),persistent:!0,noClickAnimation:!0,scrim:!1,scrollStrategy:"none",_disableGlobalStack:!0,onTouchstartPassive:y,onTouchend:x,onAfterLeave:H},V),{default:()=>[_e(!1,"v-snackbar"),a.timer&&!C.value&&c("div",{key:"timer",class:"v-snackbar__timer"},[o(Ve,{ref:_,color:typeof a.timer=="string"?a.timer:"info",max:a.timeout,modelValue:k.time.value},null)]),S&&c("div",{key:"content",class:"v-snackbar__content",role:"status","aria-live":"polite"},[s.text?.()??a.text,s.default?.()]),s.actions&&o(Pe,{defaults:{VBtn:{variant:"text",ripple:!1,slim:!0}}},{default:()=>[c("div",{class:"v-snackbar__actions"},[s.actions({isActive:l})])]})],activator:s.activator})}),ge({},E)}}),Be={class:"d-flex justify-center"},Me={class:"d-flex"},$e={class:"conditional-area d-flex align-center"},ze={class:"d-flex flex-column ga-5"},He={__name:"ClassConverter114",setup(a){const d=v(new Map),s=v(""),l=v(""),T=v(null),V=v(null),f=v("系所簡稱"),b=["系所簡稱","系所全名","學院簡稱","學院全名","系辦助理","系辦助理分機","系辦助理Email","課務承辦人","課務承辦人分機","課務承辦人Email"],m=v(!1);let p=null,g=null;const{$curridataAPI:k}=le(),E=e=>{e.preventDefault();const t=e.clipboardData.getData("text");s.value=t.trim()},_=()=>{s.value="",l.value=""},C=async()=>{try{if(!navigator.clipboard){alert("你的瀏覽器不支援剪貼簿功能，請手動複製。");return}await navigator.clipboard.writeText(l.value),m.value=!0}catch(e){console.error("複製失敗:",e),alert("複製失敗，請手動複製。")}},P=async()=>{try{if(!navigator.clipboard){alert("你的瀏覽器不支援剪貼簿功能，請手動複製。");return}await navigator.clipboard.writeText(Oe),m.value=!0}catch(e){console.error("複製失敗:",e),alert("複製失敗，請手動複製。")}};z(async()=>{try{const{data:n}=await k.get("/get_all_data");n.forEach(u=>{d.value.set(u.CLASS,u)}),console.log("資料已成功載入")}catch(n){console.error("載入資料失敗:",n)}const e=T.value?.$el.querySelector("textarea"),t=V.value?.$el.querySelector("textarea");if(e&&t){const n=x=>{x.target===e?t.scrollTop=e.scrollTop:x.target===t&&(e.scrollTop=t.scrollTop)};e.addEventListener("scroll",n),t.addEventListener("scroll",n);const u=()=>{t.style.height=`${e.offsetHeight}px`,t.style.width=`${e.offsetWidth}px`},y=()=>{e.style.height=`${t.offsetHeight}px`,e.style.width=`${t.offsetWidth}px`};p=new ResizeObserver(u),g=new ResizeObserver(y),p.observe(e),g.observe(t)}}),ne(()=>{p&&p.disconnect(),g&&g.disconnect()});const A={系所簡稱:e=>e.DEPTSHORT,系所全名:e=>e.DEPT,學院簡稱:e=>e.COLLEGESHORT,學院全名:e=>e.COLLEGE,系辦助理:e=>e.AGENT,系辦助理分機:e=>e.AGENTEXT,系辦助理Email:e=>e.AGENTEMAIL,課務承辦人:e=>e.CAGENT,課務承辦人分機:e=>e.CAGENTEXT,課務承辦人Email:e=>e.CAGENTEMAIL},L=G(()=>{if(!s.value||!d.value.size)return"";const e=s.value.split(`
`),t=A[f.value];return t?e.map(u=>{const y=u.trim(),x=d.value.get(y);return x?t(x):"查無資料"}).join(`
`):"無效選項"});D(L,e=>{l.value=e});const w=G(()=>b.reduce((u,y)=>u.length>y.length?u:y,"").length*10+80);return(e,t)=>(ie(),se("div",Be,[c("div",null,[t[11]||(t[11]=c("h1",null,"班級簡稱轉換(114以後)",-1)),c("div",Me,[o(ue,{class:"my-2 my-card-wrapper",variant:"tonal",color:"indigo"},{default:r(()=>[o(ce,null,{default:r(()=>[o(de,null,{default:r(()=>[...t[4]||(t[4]=[h("使用教學",-1)])]),_:1}),o(ve,null,{default:r(()=>[...t[5]||(t[5]=[h("輸入限制：班級簡稱",-1)])]),_:1})]),_:1}),o(me,null,{default:r(()=>[...t[6]||(t[6]=[c("ul",null,[c("li",null," 在左輸入框貼上從Excel複製的班級簡稱，右邊輸入框會自動產出結果。 "),c("li",null,"貼上後想看不同結果可選擇下拉選項"),c("li",null,"可將結果複製貼回Excel中使用。")],-1)])]),_:1}),o(fe,null,{default:r(()=>[o(R,{color:"indigo-lighten-3 text-white",variant:"elevated",onClick:P},{default:r(()=>[t[7]||(t[7]=h(" 點我複製範例 ",-1)),o(O,{icon:"mdi-content-copy",end:""})]),_:1})]),_:1})]),_:1})]),c("div",$e,[o(be,{modelValue:f.value,"onUpdate:modelValue":t[0]||(t[0]=n=>f.value=n),class:"function-selector mt-4 listitemheight",items:b,label:"功能選擇",style:re({maxWidth:`${w.value}px`}),density:"comfortable"},null,8,["modelValue","style"])]),o(Ae,{id:"mpage",class:"px-0"},{default:r(()=>[o(ke,{"no-gutters":"",class:"align-center"},{default:r(()=>[o(I,{cols:"auto"},{default:r(()=>[o($,{ref_key:"inputRef",ref:T,modelValue:s.value,"onUpdate:modelValue":t[1]||(t[1]=n=>s.value=n),class:"resizable-textarea text-right",label:"輸入框",onPaste:E},null,8,["modelValue"])]),_:1}),o(I,{cols:"auto",class:"px-2 pb-5"},{default:r(()=>[c("div",ze,[o(R,{color:"green-lighten-3 text-grey-darken-4",onClick:C},{default:r(()=>[t[8]||(t[8]=h(" Copy ",-1)),o(O,{icon:"mdi-content-copy",end:""})]),_:1}),o(R,{color:"blue-lighten-3 text-grey-darken-4",onClick:_},{default:r(()=>[t[9]||(t[9]=h(" Clear ",-1)),o(O,{icon:"mdi-close-circle-outline",end:""})]),_:1})])]),_:1}),o(I,{cols:"auto"},{default:r(()=>[o($,{ref_key:"outputRef",ref:V,modelValue:l.value,"onUpdate:modelValue":t[2]||(t[2]=n=>l.value=n),class:"resizable-textarea",label:"輸出框"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),o(Ge,{modelValue:m.value,"onUpdate:modelValue":t[3]||(t[3]=n=>m.value=n),timeout:2e3,color:"success",location:"bottom right"},{default:r(()=>[...t[10]||(t[10]=[h(" 已複製到剪貼簿 ",-1)])]),_:1},8,["modelValue"])])]))}},Je=oe(He,[["__scopeId","data-v-8ff73718"]]);export{Je as default};
