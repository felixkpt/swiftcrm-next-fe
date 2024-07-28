import Link from 'next/link';
import React from 'react';

const Page = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-4">Interview section! 😄</h2>
            <p className="text-lg mb-6">
                Choose an action below.
            </p>
            <div className="flex space-x-4">
                <Link href="/social-media/conversation/interview/session">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300">
                        Got to interview session 🎓
                    </span>
                </Link>
                <Link href="/social-media/conversation/interview/results/categories">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300">
                        Past interview results 🚀
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default Page;
