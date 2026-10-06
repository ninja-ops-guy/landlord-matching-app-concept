// Local browser identity only; this is not server authentication.
const prefix = "landlord-matching-app-concept:";
export async function cookies() { return {
 get(name:string) { const value=localStorage.getItem(prefix+name); return value?{value}:undefined; },
 set(name:string,value:string,_options?:unknown) { localStorage.setItem(prefix+name,value); },
 delete(name:string) { localStorage.removeItem(prefix+name); }
}; }
