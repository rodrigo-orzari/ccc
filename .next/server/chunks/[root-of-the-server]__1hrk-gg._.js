module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},59906,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),i=e.i(61916),s=e.i(74677),o=e.i(69741),p=e.i(16795),l=e.i(87718),u=e.i(95169),d=e.i(47587),c=e.i(66012),g=e.i(70101),h=e.i(74838),v=e.i(10372),x=e.i(93695);e.i(52474);var R=e.i(220),_=e.i(89171),m=e.i(43793),E=e.i(74129);async function f(e){try{let{searchParams:t}=new URL(e.url),r=Object.fromEntries(t.entries()),a="true"===r.aggregate,n=`
      p.name as provider,
      s.name as service,
      r.slug as region,
      pr.instance_type,
      pr.vcpus,
      pr.memory_gb,
      pr.arch,
      pr.os,
      pr.cpu_vendor,
      pr.gpu_count,
      pr.geography,
      pr.price_per_unit,
      pr.unit,
      pr.category,
      pr.attributes,
      pr.data_source,
      pr.updated_at
    `;a&&(n=`
        p.name as provider,
        'Various' as service,
        'Various' as region,
        pr.instance_type,
        pr.vcpus,
        pr.memory_gb,
        pr.arch,
        pr.os,
        pr.cpu_vendor,
        pr.gpu_count,
        'Various' as geography,
        MIN(pr.price_per_unit) as min_price,
        AVG(pr.price_per_unit) as avg_price,
        MAX(pr.price_per_unit) as max_price,
        MIN(pr.price_per_unit) as price_per_unit,
        pr.unit,
        pr.category,
        MAX(pr.updated_at) as updated_at,
        MAX(pr.attributes::text)::jsonb as attributes,
        MAX(pr.data_source) as data_source
      `);let i=`
      SELECT ${n}
      FROM pricing_records pr
      JOIN services s ON pr.service_id = s.id
      JOIN regions r ON pr.region_id = r.id
      JOIN providers p ON s.provider_id = p.id
      WHERE 1=1
    `,{whereClause:s,values:o}=(0,E.buildPricingFilters)(r);i+=" "+s,a?i+=`
        GROUP BY
          p.name, pr.instance_type, pr.vcpus, pr.memory_gb,
          pr.arch, pr.os, pr.cpu_vendor, pr.gpu_count, pr.category, pr.unit
        ORDER BY avg_price ASC
        LIMIT 1000
      `:i+=" ORDER BY pr.price_per_unit ASC LIMIT 1000",console.log("SQL Query:",i),console.log("SQL Params:",o);let p=await m.default.unsafe(i,o);return _.NextResponse.json(p)}catch(e){return console.error("API Error:",e),_.NextResponse.json({error:"Failed to fetch pricing data",details:e.message},{status:500})}}e.s(["GET",0,f],7913);var y=e.i(7913);let w=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/pricing/route",pathname:"/api/pricing",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/pricing/route.ts",nextConfigOutput:"",userland:y,...{}}),{workAsyncStorage:C,workUnitAsyncStorage:A,serverHooks:b}=w;async function N(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),w.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let _="/api/pricing/route";_=_.replace(/\/index$/,"")||"/";let m=await w.prepare(e,t,{srcPage:_,multiZoneDraftMode:!1});if(!m)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:E,deploymentId:f,params:y,nextConfig:C,parsedUrl:A,isDraftMode:b,prerenderManifest:N,routerServerContext:O,isOnDemandRevalidate:T,revalidateOnlyGenerated:P,resolvedPathname:S,clientReferenceManifest:I,serverActionsManifest:q}=m,M=(0,o.normalizeAppPath)(_),j=!!(N.dynamicRoutes[M]||N.routes[S]),k=async()=>((null==O?void 0:O.render404)?await O.render404(e,t,A,!1):t.end("This page could not be found"),null);if(j&&!b){let e=!!N.routes[S],t=N.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await k();throw new x.NoFallbackError}}let H=null;!j||w.isDev||b||(H="/index"===(H=S)?"/":H);let U=!0===w.isDev||!j,D=j&&!U;q&&I&&(0,s.setManifestsSingleton)({page:_,clientReferenceManifest:I,serverActionsManifest:q});let F=e.method||"GET",L=(0,i.getTracer)(),$=L.getActiveScopeSpan(),B=!!(null==O?void 0:O.isWrappedByNextServer),K=!!(0,n.getRequestMeta)(e,"minimalMode"),V=(0,n.getRequestMeta)(e,"incrementalCache")||await w.getIncrementalCache(e,C,N,K);null==V||V.resetRequestCache(),globalThis.__incrementalCache=V;let X={params:y,previewProps:N.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:U,incrementalCache:V,cacheLifeProfiles:C.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>w.onRequestError(e,t,a,n,O)},sharedContext:{buildId:E,deploymentId:f}},G=new p.NodeNextRequest(e),W=new p.NodeNextResponse(t),J=l.NextRequestAdapter.fromNodeNextRequest(G,(0,l.signalFromNodeResponse)(t));try{let n,s=async e=>w.handle(J,X).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=L.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${F} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",a),n.updateName(t))}else e.updateName(`${F} ${_}`)}),o=async n=>{var i,o;let p=async({previousCacheEntry:r})=>{try{if(!K&&T&&P&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(n);e.fetchMetrics=X.renderOpts.fetchMetrics;let o=X.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let p=X.renderOpts.collectedTags;if(!j)return await (0,c.sendResponse)(G,W,i,X.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(i.headers);p&&(t[v.NEXT_CACHE_TAGS_HEADER]=p),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==X.renderOpts.collectedRevalidate&&!(X.renderOpts.collectedRevalidate>=v.INFINITE_CACHE)&&X.renderOpts.collectedRevalidate,a=void 0===X.renderOpts.collectedExpire||X.renderOpts.collectedExpire>=v.INFINITE_CACHE?void 0:X.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:T})},!1,O),t}},l=await w.handleResponse({req:e,nextConfig:C,cacheKey:H,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:P,responseGenerator:p,waitUntil:a.waitUntil,isMinimalMode:K});if(!j)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",T?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),b&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,g.fromNodeOutgoingHttpHeaders)(l.value.headers);return K&&j||u.delete(v.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,h.getCacheControlHeader)(l.cacheControl)),await (0,c.sendResponse)(G,W,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};B&&$?await o($):(n=L.getActiveScopeSpan(),await L.withPropagatedContext(e.headers,()=>L.trace(u.BaseServerSpan.handleRequest,{spanName:`${F} ${_}`,kind:i.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},o),void 0,!B))}catch(t){if(t instanceof x.NoFallbackError||await w.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:T})},!1,O),j)throw t;return await (0,c.sendResponse)(G,W,new Response(null,{status:500})),null}}e.s(["handler",0,N,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:A})},"routeModule",0,w,"serverHooks",0,b,"workAsyncStorage",0,C,"workUnitAsyncStorage",0,A],59906)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1hrk-gg._.js.map