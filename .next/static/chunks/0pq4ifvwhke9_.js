(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,75254,e=>{"use strict";var r=e.i(71645);let t=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,t)=>t?t.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},o=(...e)=>e.filter((e,r,t)=>!!e&&""!==e.trim()&&t.indexOf(e)===r).join(" ").trim();var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,r.forwardRef)(({color:e="currentColor",size:t=24,strokeWidth:i=2,absoluteStrokeWidth:a,className:l="",children:s,iconNode:c,...u},d)=>(0,r.createElement)("svg",{ref:d,...n,width:t,height:t,stroke:e,strokeWidth:a?24*Number(i)/Number(t):i,className:o("lucide",l),...!s&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(s)?s:[s]]));e.s(["default",0,(e,n)=>{let a=(0,r.forwardRef)(({className:a,...l},s)=>(0,r.createElement)(i,{ref:s,iconNode:n,className:o(`lucide-${t(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...l}));return a.displayName=t(e),a}],75254)},95057,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o={formatUrl:function(){return l},formatWithValidation:function(){return c},urlObjectKeys:function(){return s}};for(var n in o)Object.defineProperty(t,n,{enumerable:!0,get:o[n]});let i=e.r(90809)._(e.r(98183)),a=/https?|ftp|gopher|file/;function l(e){let{auth:r,hostname:t}=e,o=e.protocol||"",n=e.pathname||"",l=e.hash||"",s=e.query||"",c=!1;r=r?encodeURIComponent(r).replace(/%3A/i,":")+"@":"",e.host?c=r+e.host:t&&(c=r+(~t.indexOf(":")?`[${t}]`:t),e.port&&(c+=":"+e.port)),s&&"object"==typeof s&&(s=String(i.urlQueryToSearchParams(s)));let u=e.search||s&&`?${s}`||"";return o&&!o.endsWith(":")&&(o+=":"),e.slashes||(!o||a.test(o))&&!1!==c?(c="//"+(c||""),n&&"/"!==n[0]&&(n="/"+n)):c||(c=""),l&&"#"!==l[0]&&(l="#"+l),u&&"?"!==u[0]&&(u="?"+u),n=n.replace(/[?#]/g,encodeURIComponent),u=u.replace("#","%23"),`${o}${c}${n}${u}${l}`}let s=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return l(e)}},18581,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useMergedRef",{enumerable:!0,get:function(){return n}});let o=e.r(71645);function n(e,r){let t=(0,o.useRef)(null),n=(0,o.useRef)(null);return(0,o.useCallback)(o=>{if(null===o){let e=t.current;e&&(t.current=null,e());let r=n.current;r&&(n.current=null,r())}else e&&(t.current=i(e,o)),r&&(n.current=i(r,o))},[e,r])}function i(e,r){if("function"!=typeof e)return e.current=r,()=>{e.current=null};{let t=e(r);return"function"==typeof t?t:()=>e(null)}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),r.exports=t.default)},73668,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"isLocalURL",{enumerable:!0,get:function(){return i}});let o=e.r(18967),n=e.r(52817);function i(e){if(!(0,o.isAbsoluteUrl)(e))return!0;try{let r=(0,o.getLocationOrigin)(),t=new URL(e,r);return t.origin===r&&(0,n.hasBasePath)(t.pathname)}catch(e){return!1}}},84508,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"errorOnce",{enumerable:!0,get:function(){return o}});let o=e=>{}},22016,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o={default:function(){return g},useLinkStatus:function(){return b}};for(var n in o)Object.defineProperty(t,n,{enumerable:!0,get:o[n]});let i=e.r(90809),a=e.r(43476),l=i._(e.r(71645)),s=e.r(95057),c=e.r(8372),u=e.r(18581),d=e.r(18967),f=e.r(5550);e.r(33525);let h=e.r(88540),p=e.r(91949),m=e.r(73668),y=e.r(9396);function g(r){var t,o;let n,i,g,[b,x]=(0,l.useOptimistic)(p.IDLE_LINK_STATUS),w=(0,l.useRef)(null),{href:j,as:C,children:P,prefetch:k=null,passHref:_,replace:S,shallow:O,scroll:T,onClick:A,onMouseEnter:U,onTouchStart:L,legacyBehavior:R=!1,onNavigate:W,transitionTypes:B,ref:I,unstable_dynamicOnHover:E,...M}=r;n=P,R&&("string"==typeof n||"number"==typeof n)&&(n=(0,a.jsx)("a",{children:n}));let N=l.default.useContext(c.AppRouterContext),D=!1!==k,$=!1!==k?null===(o=k)||"auto"===o?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,z="string"==typeof(t=C||j)?t:(0,s.formatUrl)(t);if(R){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=l.default.Children.only(n)}let K=R?i&&"object"==typeof i&&i.ref:I,F=l.default.useCallback(e=>(null!==N&&(w.current=(0,p.mountLinkInstance)(e,z,N,$,D,x)),()=>{w.current&&((0,p.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,p.unmountPrefetchableInstance)(e)}),[D,z,N,$,x]),q={ref:(0,u.useMergedRef)(F,K),onClick(r){R||"function"!=typeof A||A(r),R&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(r),!N||r.defaultPrevented||function(r,t,o,n,i,a,s){if("u">typeof window){let c,{nodeName:u}=r.currentTarget;if("A"===u.toUpperCase()&&((c=r.currentTarget.getAttribute("target"))&&"_self"!==c||r.metaKey||r.ctrlKey||r.shiftKey||r.altKey||r.nativeEvent&&2===r.nativeEvent.which)||r.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(t)){n&&(r.preventDefault(),location.replace(t));return}if(r.preventDefault(),a){let e=!1;if(a({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(99781);l.default.startTransition(()=>{d(t,n?"replace":"push",!1===i?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,o.current,s)})}}(r,z,w,S,T,W,B)},onMouseEnter(e){R||"function"!=typeof U||U(e),R&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),N&&D&&(0,p.onNavigationIntent)(e.currentTarget,!0===E)},onTouchStart:function(e){R||"function"!=typeof L||L(e),R&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),N&&D&&(0,p.onNavigationIntent)(e.currentTarget,!0===E)}};return(0,d.isAbsoluteUrl)(z)?q.href=z:R&&!_&&("a"!==i.type||"href"in i.props)||(q.href=(0,f.addBasePath)(z)),g=R?l.default.cloneElement(i,q):(0,a.jsx)("a",{...M,...q,children:n}),(0,a.jsx)(v.Provider,{value:b,children:g})}e.r(84508);let v=(0,l.createContext)(p.IDLE_LINK_STATUS),b=()=>(0,l.useContext)(v);("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),r.exports=t.default)},7528,e=>{"use strict";var r=e.i(43476),t=e.i(78769);e.s(["default",0,()=>{let e=`
# Privacy Policy

_Last updated: 5 May 2026._

## Overview

Compare Cloud Costs ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use our website and services.

## Information We Collect

### Usage Data
When you use Compare Cloud Costs, we automatically collect certain information about your interactions:
- Pages visited and time spent on each page
- Filters and search parameters you use when comparing cloud pricing
- Device information (browser type, operating system)
- IP address (anonymized for analytics purposes)
- Referral source

### Information You Provide
We do not require you to create an account or provide personal information to use our service. Any information you voluntarily provide (such as through contact forms or emails) will be used only for the purpose you provided it.

### Cookies and Tracking
We use minimal cookies for essential functionality only. We do not use cookies for tracking or advertising purposes.

## How We Use Your Information

We use collected information to:
- Improve and optimize our pricing data and user experience
- Understand how users interact with our platform
- Debug and troubleshoot technical issues
- Generate aggregated analytics (never identifying individuals)

## Data Sharing and Disclosure

We do not sell, trade, or rent your personal information to third parties. We may share aggregated, anonymized data with partners to improve our services, but this data cannot identify you.

We may disclose information when required by law, regulation, or legitimate legal process.

## Data Security

We take reasonable measures to protect information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure. You use our service at your own risk.

## Third-Party Services

Our platform uses the following services:
- **Cloud Providers**: AWS, Azure, Google Cloud, Oracle Cloud APIs (for pricing data only)
- **Analytics**: Basic analytics to understand usage patterns

These services have their own privacy policies, and we encourage you to review them.

## Advertising

Currently, we do not serve third-party advertisements on this platform.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date above.

## Contact Us

For questions about this Privacy Policy or our privacy practices, please email us at [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).

---

[Terms of Use](/terms) | [About Us](/about) | [Contact Us](mailto:hello@comparecloudcosts.com)

---

\xa9 2026 Co-Sell Plus LLC. All rights reserved.
`;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:`
          :root {
            --bg-color: #ffffff;
            --text-color: #1a1a1a;
            --sidebar-bg: #f9fafb;
            --border-color: #e5e7eb;
            --link-color: #2563eb;
            --muted-text: #6b7280;
            --divider-color: #e5e7eb;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-color: #0f172a;
              --text-color: #f1f5f9;
              --sidebar-bg: #1e293b;
              --border-color: #334155;
              --link-color: #60a5fa;
              --muted-text: #94a3b8;
              --divider-color: #334155;
            }
          }

          .privacy-container {
            display: flex;
            min-height: 100vh;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }

          .sidebar {
            width: 280px;
            border-right: 1px solid var(--border-color);
            padding: 2rem 1.5rem;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            background-color: var(--sidebar-bg);
          }

          .sidebar a {
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.2s;
          }

          .sidebar a:hover {
            color: var(--link-color);
          }

          .main-content {
            margin-left: 280px;
            flex: 1;
            padding: 3rem 4rem;
            max-width: 850px;
          }

          .prose h2, .prose h3 {
            color: var(--text-color);
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }

          .prose hr {
            border: 0;
            border-top: 1px solid var(--divider-color);
            margin: 3rem 0;
          }

          .prose a {
            color: var(--link-color);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 500;
          }

          .prose blockquote {
            border-left: 4px solid #f59e0b;
            background-color: #fffbeb;
            padding: 1rem 1.25rem;
            margin: 1.5rem 0;
            border-radius: 0 0.375rem 0.375rem 0;
          }

          @media (prefers-color-scheme: dark) {
            .prose blockquote {
              background-color: #1c1a0f;
            }
          }

          @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 2rem; }
          }
        `}),(0,r.jsxs)("div",{className:"privacy-container",id:"privacy-policy",children:[(0,r.jsxs)("aside",{className:"sidebar",children:[(0,r.jsx)("div",{style:{marginBottom:"2rem"},children:(0,r.jsx)("a",{href:"/",style:{display:"inline-block"},children:(0,r.jsx)("img",{src:"/logo.png",alt:"Compare Cloud Costs",style:{height:"32px",width:"auto"}})})}),(0,r.jsx)("h4",{style:{fontSize:"0.75rem",color:"var(--muted-text)",textTransform:"uppercase",marginBottom:"1rem"},children:"In this article"}),(0,r.jsx)("nav",{children:(0,r.jsxs)("ul",{style:{listStyle:"none",padding:0,margin:0},children:[(0,r.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,r.jsx)("a",{href:"#overview",children:"Overview"})}),(0,r.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,r.jsx)("a",{href:"#information-we-collect",children:"Information We Collect"})}),(0,r.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,r.jsx)("a",{href:"#how-we-use-your-information",children:"How We Use Your Information"})}),(0,r.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,r.jsx)("a",{href:"#data-sharing-and-disclosure",children:"Data Sharing"})}),(0,r.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,r.jsx)("a",{href:"#data-security",children:"Data Security"})}),(0,r.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,r.jsx)("a",{href:"#third-party-services",children:"Third-Party Services"})}),(0,r.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,r.jsx)("a",{href:"#advertising",children:"Advertising"})}),(0,r.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,r.jsx)("a",{href:"#contact-us",children:"Contact Us"})})]})})]}),(0,r.jsxs)("main",{className:"main-content",children:[(0,r.jsx)("h1",{style:{fontSize:"2.5rem",fontWeight:"800",marginBottom:"1.5rem"},children:"Privacy Policy"}),(0,r.jsx)("div",{className:"prose",children:(0,r.jsx)(t.default,{title:"",content:e})})]})]})]})}])}]);