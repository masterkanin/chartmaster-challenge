import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <span className="font-bold text-xl cursor-pointer">ChartMaster</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/challenges">
              <span className={`cursor-pointer hover:text-blue-300 ${
                router.pathname.startsWith('/challenges') ? 'text-blue-300' : ''
              }`}>
                Challenges
              </span>
            </Link>
            <Link href="/strategies">
              <span className={`cursor-pointer hover:text-blue-300 ${
                router.pathname.startsWith('/strategies') ? 'text-blue-300' : ''
              }`}>
                Strategies
              </span>
            </Link>
            <Link href="/leaderboard">
              <span className={`cursor-pointer hover:text-blue-300 ${
                router.pathname.startsWith('/leaderboard') ? 'text-blue-300' : ''
              }`}>
                Leaderboard
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <span className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer">
                Login
              </span>
            </Link>
            <Link href="/signup">
              <span className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded cursor-pointer">
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
