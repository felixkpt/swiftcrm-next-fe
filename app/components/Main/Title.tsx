import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CategoryType, SubCategoryType } from '../../types';

type Props = {
    setMessages: React.Dispatch<React.SetStateAction<Array<any>>>;
    selectedCategory: CategoryType | undefined;
    setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryType | undefined>>;
    selectedSubCategory: SubCategoryType | undefined;
    setSelectedSubCategory: React.Dispatch<React.SetStateAction<SubCategoryType | undefined>>;
};

type Message = {
    id: string;
    role: string;
    content: string;
    created_at: string;
};

const Title = ({ setMessages, selectedCategory, setSelectedCategory, selectedSubCategory, setSelectedSubCategory }: Props) => {
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);

    useEffect(() => {
        // Fetch categories when component mounts
        fetchCategories();
    }, []);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get<CategoryType[]>('http://127.0.0.1:8000/categories');
            setCategories(response.data);
            const initialCategory = response.data[0] || null;
            if (initialCategory) {
                setSelectedCategory(initialCategory);
                fetchSubCategories(initialCategory.id);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch sub-categories
    const fetchSubCategories = async (cat_id: string) => {
        try {
            const response = await axios.get<SubCategoryType[]>(`http://127.0.0.1:8000/categories/${cat_id}/sub-categories`);
            setSubCategories(response.data);
            setSelectedSubCategory(response.data[0]);
        } catch (error) {
            console.error('Error fetching sub-categories:', error);
        }
    };

    // Reset the conversation
    const resetConversation = async () => {
        if (!selectedCategory?.id) return

        setIsResetting(true);
        setError(null); // Reset any previous error

        setTimeout(async () => {
            try {
                const resp = await axios.get(`http://127.0.0.1:8000/reset-conversation?cat_id=${selectedCategory.id}`);
                if (resp.status === 200) {
                    setMessages([]);
                } else {
                    setError('Server returned an unexpected response.');
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(`Error: ${(error as Error).message}`);
                }
            } finally {
                setIsResetting(false);
            }
        }, 5000); // Delay milliseconds
    };

    // Fetch conversation messages based on selected category and sub-category
    useEffect(() => {
        const fetchConversation = async () => {
            if (!selectedCategory?.id) return

            try {
                const response = await axios.get<Message[]>(`http://127.0.0.1:8000/sub-categories/${selectedSubCategory?.id}/conversation`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching conversation messages:', error);
            }
        };

        fetchConversation();
    }, [selectedSubCategory, setMessages]);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategories(selectedCategory.id);
        }
    }, [selectedCategory]);

    const handleSetSelectedCategory = (e) => {
        if (categories.length > 0) {
            setMessages([])
            const res = categories.find((cat) => cat.id == e.target.value)
            setSelectedCategory(res);
        }
    }

    const handleSetSelectedSubCategory = (e) => {
        if (subCategories.length > 0) {
            const res = subCategories.find((cat) => cat.id == e.target.value)
            setSelectedSubCategory(res);
        }

    }

    return (
        <div className="flex justify-between items-center p-4 bg-indigo-950 text-gray-100 font-bold shadow">
            <div className="italic">Rachel</div>
            <div>
                <label htmlFor="cats" className="text-gray-300">Category:</label>
                <select
                    id="cats"
                    className="bg-gray-800 text-gray-300 border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCategory?.id}
                    onChange={handleSetSelectedCategory}
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <>
                    <label htmlFor="subCats" className="text-gray-300 ml-2">Sub-Category:</label>
                    <select
                        id="subCats"
                        className="bg-gray-800 text-gray-300 border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ml-2"
                        value={selectedSubCategory?.id}
                        onChange={handleSetSelectedSubCategory}
                    >
                        {subCategories.map(subCategory => (
                            <option key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                            </option>
                        ))}
                    </select>
                </>
            </div>
            <button
                onClick={resetConversation}
                className={`flex justify-between items-center gap-1 bg-white hover:bg-slate-200 text-gray-800 transition-all duration-200 ease-in-out p-1 rounded${isResetting ? ' animate-pulse' : ''}`}
                disabled={true}
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
                <span>Reset</span>
            </button>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

export default Title;
