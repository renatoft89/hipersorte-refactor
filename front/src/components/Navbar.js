'use client'

import React from 'react'; 
import { useRouter } from 'next/navigation'
import Link from 'next/link';

const Navbar = (() => {
  const router = useRouter();
  const currentPath = router.asPath;
  return (
    <nav className="container-md min-h-32 bg-sky-500 flex items-center justify-between ">
      <div className="flex px-8">
        {/* <Link to="/" className={currentPath === '/' ? 'disabled-link' : 'active-link'}>
          Home
        </Link> */}
        
        <p>Navbar</p>
        <p>Navbar</p>
      </div>
      <div className="p-8 mr-6 bg-slate-950">
        <p>User</p>
      </div>
    </nav>
  );
});


export default Navbar;