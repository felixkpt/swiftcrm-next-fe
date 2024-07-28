import React, { RefObject, useState } from 'react';
import CategoryType from '../../social-media/conversation/categories/AutoModel/types';
import { playAllAudioElements, pauseAllAudioElements } from './helpers'; // Import the helper functions

interface Props {
    categories: CategoryType[];
    subCategories: CategoryType[];
    selectedCategory?: CategoryType | null;
    selectedSubCategory?: CategoryType | null;
    handleSetSelectedCategory: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSetSelectedSubCategory: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    archiveConversation: () => void;
    isResetting: boolean;
    conversationsContainer: RefObject<HTMLDivElement>;
    scrollToTop: any;
    scrollToBottom: any;
}

const ConversationOptions: React.FC<Props> = ({
    categories,
    subCategories,
    selectedCategory,
    selectedSubCategory,
    handleSetSelectedCategory,
    handleSetSelectedSubCategory,
    archiveConversation,
    isResetting,
    conversationsContainer,
    scrollToTop,
    scrollToBottom,
}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Function to handle the Play All button click
    const handlePlayAllClick = () => {
        if (!isPlaying) {
            playAllAudioElements(conversationsContainer); // Start playing all audio elements
            setIsPlaying(true); // Update state to indicate playback is active
            scrollToTop()
        } else {
            pauseAllAudioElements(conversationsContainer); // Pause all audio elements
            setIsPlaying(false); // Update state to indicate playback is paused
            scrollToBottom()
        }
    };

    return (
        <div className="flex flex-wrap justify-between items-center font-bold mb-2">
            <div className="flex flex-col lg:flex-row items-center gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-xs text-nowrap">Pick a category</span>
                    </div>
                    <select
                        className="select select-bordered select-sm w-full max-w-xs"
                        value={selectedCategory?.id || ''}
                        onChange={handleSetSelectedCategory}
                        disabled={categories.length === 0}
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-xs text-nowrap">Pick a sub category</span>
                    </div>
                    <select
                        className="select select-bordered select-sm w-full max-w-xs"
                        value={selectedSubCategory?.id || ''}
                        onChange={handleSetSelectedSubCategory}
                        disabled={subCategories.length === 0}
                    >
                        {subCategories.map((subCategory) => (
                            <option key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className="form-control max-w-xs">
                    <div className="label">
                        <span className="label-text text-nowrap"></span>
                    </div>
                    <div className="flex justify-end gap-1">
                        <button
                            onClick={handlePlayAllClick}
                            className="bg-blue-500 text-white p-0.5 rounded-md flex justify-between items-center gap-1 hover:bg-blue-600 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                />
                            </svg>
                            <span>{isPlaying ? 'Pause All' : 'Play All'}</span>
                        </button>

                        <button
                            onClick={archiveConversation}
                            className={`flex justify-between items-center gap-1 bg-white p-0.5 hover:bg-slate-200 text-gray-800 transition-all duration-200 ease-in-out rounded${
                                isResetting ? ' animate-pulse' : ''
                            }`}
                            disabled={isResetting || !selectedCategory || !selectedSubCategory}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
                            </svg>
                            <span>Archive</span>
                        </button>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default ConversationOptions;
