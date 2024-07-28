import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Welcome to the Conversation App! 😄</h2>
      <p className="text-lg mb-6">
        Choose an action to improve your conversation skills and prepare for interviews with the help of AI.
        Whether you&apos;re 🚂 training or 🎙️ practicing interview questions, our app provides a dynamic learning experience.
      </p>
      <div className="flex space-x-4">
        <Link href="/social-media/conversation/training">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300">
            Train 🚀
          </span>
        </Link>
        <Link href="/social-media/conversation/interview">
          <span className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300">
            Interview 🎓
          </span>
        </Link>
        <Link href="/social-media/conversation/categories">
          <span className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300">
            Categories 🎓
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Page;
