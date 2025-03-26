import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>ChartMaster Challenge</title>
        <meta name="description" content="Interactive trading education platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">ChartMaster Challenge</h1>
        <p className="text-xl text-center mb-8">
          Master trading patterns through interactive challenges
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Easy Mode</h2>
            <p className="mb-4">
              Test your knowledge with quiz-based challenges on real market charts.
              Identify patterns and structures through multiple-choice questions.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Start Easy Mode
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Hard Mode</h2>
            <p className="mb-4">
              Draw directly on charts to identify market structures.
              Test your accuracy with interactive drawing challenges.
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Start Hard Mode
            </button>
          </div>
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Strategy Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 p-4 rounded">
              <h3 className="font-medium mb-2">Order Block Mastery</h3>
              <p className="text-sm text-gray-600">Learn to identify and trade order blocks</p>
            </div>
            <div className="border border-gray-200 p-4 rounded">
              <h3 className="font-medium mb-2">Fair Value Gap Strategy</h3>
              <p className="text-sm text-gray-600">Master FVG identification and trading</p>
            </div>
            <div className="border border-gray-200 p-4 rounded">
              <h3 className="font-medium mb-2">Liquidity Sweep Tactics</h3>
              <p className="text-sm text-gray-600">Understand how to spot liquidity sweeps</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 ChartMaster Challenge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
