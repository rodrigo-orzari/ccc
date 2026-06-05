(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,75254,e=>{"use strict";var t=e.i(71645);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)},o=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,t.forwardRef)(({color:e="currentColor",size:r=24,strokeWidth:a=2,absoluteStrokeWidth:n,className:s="",children:l,iconNode:c,...u},d)=>(0,t.createElement)("svg",{ref:d,...i,width:r,height:r,stroke:e,strokeWidth:n?24*Number(a)/Number(r):a,className:o("lucide",s),...!l&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(l)?l:[l]]));e.s(["default",0,(e,i)=>{let n=(0,t.forwardRef)(({className:n,...s},l)=>(0,t.createElement)(a,{ref:l,iconNode:i,className:o(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...s}));return n.displayName=r(e),n}],75254)},95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={formatUrl:function(){return s},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var i in o)Object.defineProperty(r,i,{enumerable:!0,get:o[i]});let a=e.r(90809)._(e.r(98183)),n=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,o=e.protocol||"",i=e.pathname||"",s=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:r&&(c=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(a.urlQueryToSearchParams(l)));let u=e.search||l&&`?${l}`||"";return o&&!o.endsWith(":")&&(o+=":"),e.slashes||(!o||n.test(o))&&!1!==c?(c="//"+(c||""),i&&"/"!==i[0]&&(i="/"+i)):c||(c=""),s&&"#"!==s[0]&&(s="#"+s),u&&"?"!==u[0]&&(u="?"+u),i=i.replace(/[?#]/g,encodeURIComponent),u=u.replace("#","%23"),`${o}${c}${i}${u}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return s(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let o=e.r(71645);function i(e,t){let r=(0,o.useRef)(null),i=(0,o.useRef)(null);return(0,o.useCallback)(o=>{if(null===o){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=a(e,o)),t&&(i.current=a(t,o))},[e,t])}function a(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return a}});let o=e.r(18967),i=e.r(52817);function a(e){if(!(0,o.isAbsoluteUrl)(e))return!0;try{let t=(0,o.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,i.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return o}});let o=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={default:function(){return y},useLinkStatus:function(){return v}};for(var i in o)Object.defineProperty(r,i,{enumerable:!0,get:o[i]});let a=e.r(90809),n=e.r(43476),s=a._(e.r(71645)),l=e.r(95057),c=e.r(8372),u=e.r(18581),d=e.r(18967),f=e.r(5550);e.r(33525);let m=e.r(88540),p=e.r(91949),h=e.r(73668),g=e.r(9396);function y(t){var r,o;let i,a,y,[v,C]=(0,s.useOptimistic)(p.IDLE_LINK_STATUS),x=(0,s.useRef)(null),{href:w,as:j,children:k,prefetch:S=null,passHref:P,replace:T,shallow:_,scroll:O,onClick:U,onMouseEnter:A,onTouchStart:B,legacyBehavior:L=!1,onNavigate:D,transitionTypes:M,ref:R,unstable_dynamicOnHover:z,...N}=t;i=k,L&&("string"==typeof i||"number"==typeof i)&&(i=(0,n.jsx)("a",{children:i}));let E=s.default.useContext(c.AppRouterContext),G=!1!==S,I=!1!==S?null===(o=S)||"auto"===o?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,$="string"==typeof(r=j||w)?r:(0,l.formatUrl)(r);if(L){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});a=s.default.Children.only(i)}let W=L?a&&"object"==typeof a&&a.ref:R,q=s.default.useCallback(e=>(null!==E&&(x.current=(0,p.mountLinkInstance)(e,$,E,I,G,C)),()=>{x.current&&((0,p.unmountLinkForCurrentNavigation)(x.current),x.current=null),(0,p.unmountPrefetchableInstance)(e)}),[G,$,E,I,C]),F={ref:(0,u.useMergedRef)(q,W),onClick(t){L||"function"!=typeof U||U(t),L&&a.props&&"function"==typeof a.props.onClick&&a.props.onClick(t),!E||t.defaultPrevented||function(t,r,o,i,a,n,l){if("u">typeof window){let c,{nodeName:u}=t.currentTarget;if("A"===u.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(r)){i&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(99781);s.default.startTransition(()=>{d(r,i?"replace":"push",!1===a?m.ScrollBehavior.NoScroll:m.ScrollBehavior.Default,o.current,l)})}}(t,$,x,T,O,D,M)},onMouseEnter(e){L||"function"!=typeof A||A(e),L&&a.props&&"function"==typeof a.props.onMouseEnter&&a.props.onMouseEnter(e),E&&G&&(0,p.onNavigationIntent)(e.currentTarget,!0===z)},onTouchStart:function(e){L||"function"!=typeof B||B(e),L&&a.props&&"function"==typeof a.props.onTouchStart&&a.props.onTouchStart(e),E&&G&&(0,p.onNavigationIntent)(e.currentTarget,!0===z)}};return(0,d.isAbsoluteUrl)($)?F.href=$:L&&!P&&("a"!==a.type||"href"in a.props)||(F.href=(0,f.addBasePath)($)),y=L?s.default.cloneElement(a,F):(0,n.jsx)("a",{...N,...F,children:i}),(0,n.jsx)(b.Provider,{value:v,children:y})}e.r(84508);let b=(0,s.createContext)(p.IDLE_LINK_STATUS),v=()=>(0,s.useContext)(b);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},67102,e=>{"use strict";var t=e.i(43476),r=e.i(78769);e.s(["default",0,()=>{let e=`
# Terms of Use

_Last updated: 20 May 2026._

## Agreement to Terms

By accessing and using Compare Cloud Costs, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

[↑ Go back to the top](#terms-of-use)

## Use License

Permission is granted to temporarily download one copy of the materials (information or software) on Compare Cloud Costs for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials
- Use the materials for any commercial purpose or for any public display
- Attempt to reverse engineer, disassemble, or decompile any software contained on the site
- Remove any copyright or other proprietary notations from the materials
- Transfer the materials to another person or "mirror" the materials on any other server

[↑ Go back to the top](#terms-of-use)

## Disclaimer

The materials on Compare Cloud Costs are provided on an 'as is' basis. Compare Cloud Costs makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

[↑ Go back to the top](#terms-of-use)

## Limitations

In no event shall Compare Cloud Costs or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Compare Cloud Costs, even if Compare Cloud Costs or an authorized representative has been notified orally or in writing of the possibility of such damage.

[↑ Go back to the top](#terms-of-use)

## Accuracy of Materials

The materials appearing on Compare Cloud Costs could include technical, typographical, or photographic errors. Compare Cloud Costs does not warrant that any of the materials on its website are accurate, complete, or current. Compare Cloud Costs may make changes to the materials contained on its website at any time without notice.

[↑ Go back to the top](#terms-of-use)

## Links

Compare Cloud Costs has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Compare Cloud Costs of the site. Use of any such linked website is at the user's own risk.

[↑ Go back to the top](#terms-of-use)

## Modifications

Compare Cloud Costs may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.

[↑ Go back to the top](#terms-of-use)

## Governing Law

These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.

[↑ Go back to the top](#terms-of-use)

## Pricing Disclaimer

### Directional and Sample Data Only

CCC functions as an aggregator of publicly available information, designed to provide a **directional indicator** of cloud costs rather than official pricing quotes. For providers with flexible pricing models (such as custom CPU/RAM configurations), our data represents a curated **sample** of popular instances to enable apples-to-apples comparisons. 

While we refresh data frequently (at least weekly), cloud providers update their pricing, introduce new instances, and offer private negotiated discounts that are not reflected here.

### Data Normalization

To provide a seamless comparison experience across entirely different cloud architectures, CCC normalizes proprietary billing metrics into standard equivalents. For example, in the Data & Analytics category, we map 100 Azure Synapse DWUs (Data Warehouse Units) or 100 Google BigQuery Slots to equal 1 standard "Compute Unit" (equivalent to 1 Databricks DBU or 1 Snowflake Credit). Similar approximations are applied across Virtual Machines, Databases, Serverless, and Networking categories.

This abstraction means the data you see is an approximation designed to match "like for like" compute power. Actual performance and cost ratios will vary significantly depending on your specific workload.

### Official Pricing Calculators

Because CCC is not the primary source of truth for final billing, you must **always** rely on official provider pricing calculators and your own specific purchase agreements for final financial decisions. 

Please refer directly to the official tools for exact quotes:
- **AWS:** [AWS Pricing Calculator](https://calculator.aws/)
- **Microsoft Azure:** [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- **Google Cloud:** [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- **Oracle Cloud:** [Oracle Cloud Cost Estimator](https://www.oracle.com/cloud/costestimator.html)
- **DigitalOcean:** [DigitalOcean Pricing](https://www.digitalocean.com/pricing)

### No warranties or liability

The pricing data on this platform is provided as-is for informational and comparative purposes only. We make no warranties regarding accuracy, completeness, or fitness for any particular purpose. Users should independently verify all pricing before making purchasing decisions.

[↑ Go back to the top](#terms-of-use)

## Contact

For questions about these Terms of Use, please email us at [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).

[↑ Go back to the top](#terms-of-use)

---

[Privacy Policy](/privacy) | [Contact Us](mailto:hello@comparecloudcosts.com) | [About Us](/about)

---

\xa9 2026 Co-Sell Plus LLC. All rights reserved.
`;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:`
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

          .terms-container {
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
        `}),(0,t.jsxs)("div",{className:"terms-container",id:"terms-of-use",children:[(0,t.jsxs)("aside",{className:"sidebar",children:[(0,t.jsx)("div",{style:{marginBottom:"2rem"},children:(0,t.jsx)("a",{href:"/",style:{display:"inline-block"},children:(0,t.jsx)("img",{src:"/logo.png",alt:"Compare Cloud Costs",style:{height:"32px",width:"auto"}})})}),(0,t.jsx)("h4",{style:{fontSize:"0.75rem",color:"var(--muted-text)",textTransform:"uppercase",marginBottom:"1rem"},children:"In this article"}),(0,t.jsx)("nav",{children:(0,t.jsxs)("ul",{style:{listStyle:"none",padding:0,margin:0},children:[(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#agreement-to-terms",children:"Agreement to Terms"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#use-license",children:"Use License"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#disclaimer",children:"Disclaimer"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#limitations",children:"Limitations"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#accuracy-of-materials",children:"Accuracy of Materials"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#modifications",children:"Modifications"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#governing-law",children:"Governing Law"})}),(0,t.jsxs)("li",{style:{marginBottom:"0.6rem"},children:[(0,t.jsx)("a",{href:"#pricing-disclaimer",children:"Pricing Disclaimer"}),(0,t.jsxs)("ul",{style:{listStyle:"none",paddingLeft:"1rem",marginTop:"0.5rem"},children:[(0,t.jsx)("li",{style:{marginBottom:"0.4rem"},children:(0,t.jsx)("a",{href:"#directional-and-sample-data-only",style:{fontSize:"0.85rem"},children:"Directional data only"})}),(0,t.jsx)("li",{style:{marginBottom:"0.4rem"},children:(0,t.jsx)("a",{href:"#data-normalization",style:{fontSize:"0.85rem"},children:"Data normalization"})}),(0,t.jsx)("li",{style:{marginBottom:"0.4rem"},children:(0,t.jsx)("a",{href:"#official-pricing-calculators",style:{fontSize:"0.85rem"},children:"Official calculators"})}),(0,t.jsx)("li",{style:{marginBottom:"0.4rem"},children:(0,t.jsx)("a",{href:"#no-warranties-or-liability",style:{fontSize:"0.85rem"},children:"No liability"})})]})]}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#contact",children:"Contact"})})]})})]}),(0,t.jsxs)("main",{className:"main-content",children:[(0,t.jsx)("h1",{style:{fontSize:"2.5rem",fontWeight:"800",marginBottom:"1.5rem"},children:"Terms of Use"}),(0,t.jsx)("div",{className:"prose",children:(0,t.jsx)(r.default,{title:"",content:e})})]})]})]})}])}]);