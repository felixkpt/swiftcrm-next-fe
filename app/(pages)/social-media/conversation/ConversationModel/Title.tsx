import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import CategoryType from '../../social-media/conversation/categories/AutoModel/types';
import SubCategoryType from '../../social-media/conversation/categories/[categoryId]/sub-categories/AutoModel/types';
import Menu from './Menu';
import { ResultsMetaDataType } from './types';

type Props = {
    setMessages: React.Dispatch<React.SetStateAction<Array<any>>>;
    setMessagesMetadata: React.Dispatch<React.SetStateAction<null | any>>;
    selectedCategory: CategoryType | undefined;
    setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryType | undefined>>;
    selectedSubCategory: SubCategoryType | undefined;
    setSelectedSubCategory: React.Dispatch<React.SetStateAction<SubCategoryType | undefined>>;
};

const Title: React.FC<Props> = ({
    setMessages,
    setMessagesMetadata,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
}: Props) => {
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
            const response = await axios.get<CategoryType[]>(appConfig.api.url('/social-media/conversation/categories'));
            setCategories(response.data?.records || []);
            const initialCategory = response.data?.records[0] || null;
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
            const response = await axios.get<SubCategoryType[]>(appConfig.api.url(`/social-media/conversation/categories/sub-categories/?category_id=${cat_id}`));
            
            const data = response.data?.records
            console.log(data)
            setSubCategories(data || []);
            setSelectedSubCategory(data[0] || null);
        } catch (error) {
            console.error('Error fetching sub-categories:', error);
        }
    };

    // Archive the conversation
    const archiveConversation = async () => {
        if (!selectedCategory?.id || !selectedSubCategory?.id) return;

        setIsResetting(true);
        setError(null); // Reset any previous error

        try {
            const resp = await axios.put(appConfig.api.url(`/social-media/conversation/categories/sub-categories/archive?category_id=${selectedCategory.id}&sub_category_id=${selectedSubCategory.id}`));
            if (resp.status === 200) {
                setMessages([]);
                setMessagesMetadata(null)
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
    };

    // Fetch conversation messages based on selected category and sub-category
    useEffect(() => {
        const fetchConversation = async () => {
            if (!selectedCategory?.id || !selectedSubCategory?.id) return;

            try {
                const response = await axios.get<ResultsMetaDataType>(appConfig.api.url(`/social-media/conversation/sub-categories/conversation/?sub_category_id=${selectedSubCategory.id}`));
                setMessages(response.data.records || []);
                setMessagesMetadata(response.data.records || null)
            } catch (error) {
                console.error('Error fetching conversation messages:', error);
            }
        };

        fetchConversation();
    }, [selectedCategory, selectedSubCategory, setMessages]);

    const handleSetSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        const selectedCategory = categories.find(cat => cat.id == categoryId);
        if (selectedCategory) {
            setSelectedCategory(selectedCategory);
            setMessages([]);
            setMessagesMetadata(null)
            fetchSubCategories(categoryId);
        }
    };

    const handleSetSelectedSubCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subCategoryId = e.target.value;
        const selectedSubCategory = subCategories.find(subCat => subCat.id == subCategoryId);
        if (selectedSubCategory) {
            setSelectedSubCategory(selectedSubCategory);
        }
    };

    return (
        <>
                <Menu
                    categories={categories}
                    subCategories={subCategories}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    handleSetSelectedCategory={handleSetSelectedCategory}
                    handleSetSelectedSubCategory={handleSetSelectedSubCategory}
                    archiveConversation={archiveConversation}
                    isResetting={isResetting}
                />
            <div>
                {error && <div className="text-red-500">{error}</div>}
            </div>
        </>
    );
};

export default Title;
