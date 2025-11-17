// import { createContext, useContext, useEffect, useState } from "react";
// import { httpAuth } from "../api/httpAuth";
// import { auth } from "../lib/auth";

// type User = { id:number; name:string|null; email:string|null; role:"admin"|"user" };
// type Ctx = { user:User|null; ready:boolean;
//   login:(email:string,pw:string)=>Promise<void>;
//   register:(n:string,e:string,pw:string)=>Promise<void>;
//   logout:()=>void;
// };
// const C = createContext<Ctx|null>(null);

// export function AuthProvider({ children }:{children:React.ReactNode}) {
//   const [user,setUser] = useState<User|null>(null);
//   const [ready,setReady] = useState(false);

//   useEffect(() => { (async()=>{
//     try {
//       const t = auth.get();
//       if (t) {
//         const { data } = await httpAuth.get("/auth/me", { headers:{Authorization:`Bearer ${t}`} });
//         setUser(data.user);
//       }
//     } catch {}
//     setReady(true);
//   })(); }, []);

//   async function login(email:string,password:string){
//     const { data } = await httpAuth.post("/auth/login",{ email,password });
//     auth.set(data.token); setUser(data.user);
//   }
//   async function register(name:string,email:string,password:string){
//     const { data } = await httpAuth.post("/auth/register",{ name,email,password });
//     auth.set(data.token); setUser(data.user);
//   }
//   function logout(){ auth.clear(); setUser(null); }

//   return <C.Provider value={{user,ready,login,register,logout}}>{children}</C.Provider>;
// }
// export const useAuth = ()=> {
//   const v = useContext(C);
//   if (!v) throw new Error("useAuth must be used within <AuthProvider>");
//   return v;
// };


import { createContext, useContext, useEffect, useState } from "react";
import { httpAuth } from "../api/httpAuth";
import { auth } from "../lib/auth";

type User = { id:number; name:string|null; email:string|null; role:"admin"|"user" };
type Ctx = {
  user: User | null;
  ready: boolean;
  login: (email:string, password:string)=>Promise<void>;
  register: (name:string, email:string, password:string)=>Promise<void>;
  logout: ()=>void;
};

const C = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = auth.get();
        if (!token) { setReady(true); return; }
        const { data } = await httpAuth.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
      } catch {
        auth.clear();
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const { data } = await httpAuth.post("/auth/login", { email, password });
    auth.set(data.token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await httpAuth.post("/auth/register", { name, email, password });
    auth.set(data.token);
    setUser(data.user);
  }

  function logout() {
    auth.clear();
    setUser(null);
  }

  return <C.Provider value={{ user, ready, login, register, logout }}>{children}</C.Provider>;
}

export function useAuth() {
  const v = useContext(C);
  if (!v) throw new Error("useAuth must be used within <AuthProvider>");
  return v;
}
