import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(()=>{
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme','dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme','light');
    }
  },[dark]);
  return (
    <button className="btn btn-ghost rounded-xl" onClick={()=>setDark(d=>!d)} title={dark?'Switch to light':'Switch to dark'}>
      {dark ? <Sun size={16}/> : <Moon size={16}/>}
      <span className="ml-2 text-sm">{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
