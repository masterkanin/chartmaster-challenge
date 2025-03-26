import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Layout = ({ children }) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white shadow-md">
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
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-center md:text-left">© 2025 ChartMaster Challenge. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-300">About</a>
              <a href="#" className="hover:text-blue-300">Privacy</a>
              <a href="#" className="hover:text-blue-300">Terms</a>
              <a href="#" className="hover:text-blue-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
