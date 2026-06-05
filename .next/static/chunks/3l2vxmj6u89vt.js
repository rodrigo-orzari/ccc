(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,75254,e=>{"use strict";var t=e.i(71645);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)},o=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,t.forwardRef)(({color:e="currentColor",size:r=24,strokeWidth:a=2,absoluteStrokeWidth:n,className:s="",children:l,iconNode:c,...u},d)=>(0,t.createElement)("svg",{ref:d,...i,width:r,height:r,stroke:e,strokeWidth:n?24*Number(a)/Number(r):a,className:o("lucide",s),...!l&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(l)?l:[l]]));e.s(["default",0,(e,i)=>{let n=(0,t.forwardRef)(({className:n,...s},l)=>(0,t.createElement)(a,{ref:l,iconNode:i,className:o(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...s}));return n.displayName=r(e),n}],75254)},95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={formatUrl:function(){return s},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var i in o)Object.defineProperty(r,i,{enumerable:!0,get:o[i]});let a=e.r(90809)._(e.r(98183)),n=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,o=e.protocol||"",i=e.pathname||"",s=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:r&&(c=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(a.urlQueryToSearchParams(l)));let u=e.search||l&&`?${l}`||"";return o&&!o.endsWith(":")&&(o+=":"),e.slashes||(!o||n.test(o))&&!1!==c?(c="//"+(c||""),i&&"/"!==i[0]&&(i="/"+i)):c||(c=""),s&&"#"!==s[0]&&(s="#"+s),u&&"?"!==u[0]&&(u="?"+u),i=i.replace(/[?#]/g,encodeURIComponent),u=u.replace("#","%23"),`${o}${c}${i}${u}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return s(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let o=e.r(71645);function i(e,t){let r=(0,o.useRef)(null),i=(0,o.useRef)(null);return(0,o.useCallback)(o=>{if(null===o){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=a(e,o)),t&&(i.current=a(t,o))},[e,t])}function a(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return a}});let o=e.r(18967),i=e.r(52817);function a(e){if(!(0,o.isAbsoluteUrl)(e))return!0;try{let t=(0,o.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,i.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return o}});let o=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={default:function(){return b},useLinkStatus:function(){return v}};for(var i in o)Object.defineProperty(r,i,{enumerable:!0,get:o[i]});let a=e.r(90809),n=e.r(43476),s=a._(e.r(71645)),l=e.r(95057),c=e.r(8372),u=e.r(18581),d=e.r(18967),p=e.r(5550);e.r(33525);let f=e.r(88540),h=e.r(91949),m=e.r(73668),g=e.r(9396);function b(t){var r,o;let i,a,b,[v,C]=(0,s.useOptimistic)(h.IDLE_LINK_STATUS),w=(0,s.useRef)(null),{href:x,as:k,children:j,prefetch:O=null,passHref:P,replace:S,shallow:T,scroll:A,onClick:_,onMouseEnter:z,onTouchStart:M,legacyBehavior:I=!1,onNavigate:R,transitionTypes:L,ref:B,unstable_dynamicOnHover:E,...U}=t;i=j,I&&("string"==typeof i||"number"==typeof i)&&(i=(0,n.jsx)("a",{children:i}));let W=s.default.useContext(c.AppRouterContext),N=!1!==O,D=!1!==O?null===(o=O)||"auto"===o?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,$="string"==typeof(r=k||x)?r:(0,l.formatUrl)(r);if(I){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});a=s.default.Children.only(i)}let q=I?a&&"object"==typeof a&&a.ref:B,F=s.default.useCallback(e=>(null!==W&&(w.current=(0,h.mountLinkInstance)(e,$,W,D,N,C)),()=>{w.current&&((0,h.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,h.unmountPrefetchableInstance)(e)}),[N,$,W,D,C]),G={ref:(0,u.useMergedRef)(F,q),onClick(t){I||"function"!=typeof _||_(t),I&&a.props&&"function"==typeof a.props.onClick&&a.props.onClick(t),!W||t.defaultPrevented||function(t,r,o,i,a,n,l){if("u">typeof window){let c,{nodeName:u}=t.currentTarget;if("A"===u.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(r)){i&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(99781);s.default.startTransition(()=>{d(r,i?"replace":"push",!1===a?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,o.current,l)})}}(t,$,w,S,A,R,L)},onMouseEnter(e){I||"function"!=typeof z||z(e),I&&a.props&&"function"==typeof a.props.onMouseEnter&&a.props.onMouseEnter(e),W&&N&&(0,h.onNavigationIntent)(e.currentTarget,!0===E)},onTouchStart:function(e){I||"function"!=typeof M||M(e),I&&a.props&&"function"==typeof a.props.onTouchStart&&a.props.onTouchStart(e),W&&N&&(0,h.onNavigationIntent)(e.currentTarget,!0===E)}};return(0,d.isAbsoluteUrl)($)?G.href=$:I&&!P&&("a"!==a.type||"href"in a.props)||(G.href=(0,p.addBasePath)($)),b=I?s.default.cloneElement(a,G):(0,n.jsx)("a",{...U,...G,children:i}),(0,n.jsx)(y.Provider,{value:v,children:b})}e.r(84508);let y=(0,s.createContext)(h.IDLE_LINK_STATUS),v=()=>(0,s.useContext)(y);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},61642,e=>{"use strict";var t=e.i(43476),r=e.i(78769);e.s(["default",0,()=>{let e=`
# About Compare Cloud Costs (CCC)

Compare Cloud Costs (CCC) is a comprehensive platform designed to demystify cloud pricing across the industry's leading providers. By normalizing complex billing metrics into side-by-side comparisons, CCC empowers users to make data-driven infrastructure decisions, optimize their cloud spend, and confidently navigate a multi-cloud strategy before committing to a specific architecture.

[↑ Go back to the top](#about-us)

## Why we built this

Cloud computing has revolutionized how we build and scale technology, but it has also introduced a new challenge: pricing complexity. While cloud providers offer individual calculators and purchase agreements, calculating the True Cost of Ownership (TCO) for a modern infrastructure remains a monumental task.

### The Cloud Pricing Maze

Users can find exact pricing for one provider in isolation, but comparing those costs side-by-side requires navigating disparate calculators and performing exhaustive individual studies. Data is scattered across different rate cards and service models, making an "apples-to-apples" comparison nearly impossible without manual normalization.

Many organizations rely on traditional FinOps solutions that provide an "after-the-fact" view of spending. While these help optimize existing spend, they don't provide the proactive, comparative clarity needed before a workload is deployed.

Furthermore, the modern landscape is increasingly multi-cloud. Companies run workloads across different cloud providers simultaneously to achieve specific performance, redundancy, or strategic goals. Many organizations find themselves overpaying because they lacked a unified, cross-provider view during the planning phase.

[↑ Go back to the top](#about-us)

## Features

Compare Cloud Costs (CCC) was built to bridge the gap between complex provider rate cards and actionable business intelligence.

### Side-by-Side Multi-Cloud Analysis

Compare identical configurations across the world's leading cloud providers (AWS, Microsoft Azure, Google Cloud, Oracle Cloud, DigitalOcean, and more) in a single view.

### Real-Time Data

Our engines refresh pricing data frequently to ensure you are seeing the most accurate market rates before you commit to a provider.

### Granular Breakdown

We break down compute, storage, networking, and support costs so you see exactly how a workload's cost structure changes across different providers.

### Proactive Optimization

We provide insights into right-sizing and regional price differences before deployment, complementing your existing reactive FinOps tools.

[↑ Go back to the top](#about-us)

## Who is CCC for?

### IT Managers and CTOs
IT leaders use CCC during the architectural planning phase to estimate the total cost of ownership (TCO) for new workloads. By seeing "apples-to-apples" cost comparisons for compute, databases, and networking, they can justify budget requests, avoid vendor lock-in, and select the most cost-effective cloud provider for their specific performance needs.

### Azure Sellers (and Cloud Sales Professionals)
Cloud sales professionals leverage CCC as an independent, third-party benchmark to demonstrate the competitive pricing of their offerings. For example, an Azure seller can quickly show a prospective client how Azure's pricing for a specific database or compute instance stacks up against AWS or Google Cloud, helping to close deals based on transparent cost advantages.

### Managed Service Providers (MSPs)
MSPs managing infrastructure for multiple clients use CCC to design optimized, cost-effective environments. Whether migrating a client from on-premises to the cloud or optimizing an existing cloud footprint, CCC allows MSPs to rapidly evaluate different providers and present compelling, cost-optimized proposals to their clients, thereby increasing their margins and value-add.

### Consulting Companies (Cloud Deployment Specialists)
Cloud consultants and architects use CCC as a foundational tool during the discovery and design phases of a digital transformation project. It allows them to quickly model out multi-cloud scenarios, provide clients with accurate directional estimates, and design architectures that balance performance requirements with strict budget constraints.

[↑ Go back to the top](#about-us)

## About the Creator

Hi, I'm **Rodrigo Orzari** ([Connect with me on LinkedIn](https://www.linkedin.com/in/rodrigoorzari/)). 

I built Compare Cloud Costs as a passion project to deepen my understanding of modern tech stacks and artificial intelligence—transitioning from "vibe-coding" to actively integrating AI into production-grade applications. 

The core motivation behind this tool was to solve a very specific, painful problem for the professionals mentioned above. Instead of forcing IT leaders, sales reps, and consultants to manually hunt down prices across every individual cloud provider's rate card, I wanted to provide a seamless, "apples-to-apples" comparison. CCC makes it significantly easier to navigate complex pricing models and make informed architectural choices without the headache of manual spreadsheet normalization.

[↑ Go back to the top](#about-us)

## Directional Estimates, Not Official Quotes

It is important to note that the data on CCC serves as a **directional indicator** or a sample of popular instances, designed to highlight architectural cost differences across clouds. It is not a substitute for an official quote.

Always verify your final estimates using the official calculators:
- [AWS Pricing Calculator](https://calculator.aws/)
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- [Oracle Cloud Cost Estimator](https://www.oracle.com/cloud/costestimator.html)
- [DigitalOcean Pricing](https://www.digitalocean.com/pricing)

[↑ Go back to the top](#about-us)

---

[Terms of Use](/terms) | [Privacy Policy](/privacy) | [Contact Us](mailto:hello@comparecloudcosts.com)

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

          .about-container {
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
        `}),(0,t.jsxs)("div",{className:"about-container",id:"about-us",children:[(0,t.jsxs)("aside",{className:"sidebar",children:[(0,t.jsx)("div",{style:{marginBottom:"2rem"},children:(0,t.jsx)("a",{href:"/",style:{display:"inline-block"},children:(0,t.jsx)("img",{src:"/logo.png",alt:"Compare Cloud Costs",style:{height:"32px",width:"auto"}})})}),(0,t.jsx)("h4",{style:{fontSize:"0.75rem",color:"var(--muted-text)",textTransform:"uppercase",marginBottom:"1rem"},children:"In this article"}),(0,t.jsx)("nav",{children:(0,t.jsxs)("ul",{style:{listStyle:"none",padding:0,margin:0},children:[(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#about-compare-cloud-costs-ccc",children:"About CCC"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#why-we-built-this",children:"Why we built this"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#features",children:"Features"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#who-is-ccc-for",children:"Who is CCC for?"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#about-the-creator",children:"About the Creator"})}),(0,t.jsx)("li",{style:{marginBottom:"0.6rem"},children:(0,t.jsx)("a",{href:"#directional-estimates-not-official-quotes",children:"Directional Estimates"})})]})})]}),(0,t.jsxs)("main",{className:"main-content",children:[(0,t.jsx)("h1",{style:{fontSize:"2.5rem",fontWeight:"800",marginBottom:"1.5rem"},children:"What is CompareCloudCosts.com?"}),(0,t.jsx)("div",{className:"prose",children:(0,t.jsx)(r.default,{title:"",content:e})})]})]})]})}])}]);