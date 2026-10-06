import * as r0 from "@/local-api/health/route";
import * as r1 from "@/local-api/landlords/route";
import * as r2 from "@/local-api/listings/route";
import * as r3 from "@/local-api/matches/route";
import * as r4 from "@/local-api/matches/[id]/route";
import * as r5 from "@/local-api/messages/route";
import * as r6 from "@/local-api/reset/route";
import * as r7 from "@/local-api/swipes/route";
import * as r8 from "@/local-api/tenants/route";
import { initializeDatabase } from "@/db";
type Handler = (request:Request, context:{params:Promise<{id:string}>}) => Promise<Response>;
const routes: Array<[string, Record<string,unknown>]> = [
  ["/api/health", r0],
  ["/api/landlords", r1],
  ["/api/listings", r2],
  ["/api/matches", r3],
  ["/api/matches/[id]", r4],
  ["/api/messages", r5],
  ["/api/reset", r6],
  ["/api/swipes", r7],
  ["/api/tenants", r8],
];
let queue:Promise<unknown>=Promise.resolve();
// Serialize operations so rapid clicks cannot double-spend or create duplicate records.
export function localFetch(url:string,init:RequestInit={}) : Promise<Response> {
 const execute=async()=>{
   await initializeDatabase();
   const parsed=new URL(url,location.origin);
   for(const [pattern,handlers] of routes){
     const match=parsed.pathname.match(new RegExp("^"+pattern.replace("[id]","([^/]+)")+"$"));
     if(!match)continue;
     const handler=handlers[(init.method??"GET").toUpperCase()] as Handler | undefined;
     if(!handler)return Response.json({error:"Method not allowed"},{status:405});
     return handler(new Request(parsed,init),{params:Promise.resolve({id:match[1]??""})});
   }
   return Response.json({error:"Not found"},{status:404});
 };
 const result=queue.then(execute); queue=result.catch(()=>{}); return result;
}
