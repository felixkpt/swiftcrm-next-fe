import React, { useEffect, useState } from 'react';
import { useCategories } from './hooks/useCategories';
import { useSubCategories } from './hooks/useSubCategories';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import ConversationOptions from './ConversationOptions';
import { ResultsMetaDataType, SubNavMenuProps } from './types';
import axios from 'axios';
import InterviewProgress from './InterviewProgress';

const InterviewSubNavMenu: React.FC<SubNavMenuProps> = ({
    setMessages,
    setMessagesMetadata,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    conversationsContainer,
    scrollToTop,
    scrollToBottom,
    mode,
    reloadKey,
}) => {

    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { categories } = useCategories(setSelectedCategory);
    const { subCategories } = useSubCategories({ selectedCategory, setSelectedSubCategory });
    const [currentSessionId, setCurrentSessionId] = useState<number | ''>('');

    // Fetch conversation messages based on selected category and sub-category
    useEffect(() => {
        const fetchConversation = async () => {

            console.log('GETTING>>>>',currentSessionId)
            if (!selectedCategory?.id || !selectedSubCategory?.id || !currentSessionId) return;
            try {
                const uri = `/social-media/conversation/sub-categories/${selectedSubCategory.id}/conversation?mode=${mode}&interview_id=${currentSessionId}`
                const response = await axios.get<ResultsMetaDataType>(appConfig.api.url(uri));
                console.log('response.data::', uri, response.data)
                setMessages(response.data.records || []);
                setMessagesMetadata(response.data.metadata || []);
            } catch (error) {
                console.error('Error fetching conversation messages:', error);
            }
        };

        fetchConversation();
    }, [selectedCategory, selectedSubCategory, setMessages, currentSessionId]);

    const handleSetSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        const selectedCategory = categories.find(cat => cat.id == categoryId);
        if (selectedCategory) {
            setSelectedCategory(selectedCategory);
            setMessages([]);
            setMessagesMetadata(null)
        }
    };

    const handleSetSelectedSubCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subCategoryId = e.target.value;
        const selectedSubCategory = subCategories.find(subCat => subCat.id == subCategoryId);
        if (selectedSubCategory) {
            setSelectedSubCategory(selectedSubCategory);
        }
    };

    const archiveConversation = async () => {
        if (!selectedCategory?.id || !selectedSubCategory?.id) return;

        setIsResetting(true);
        setError(null);

        try {
            const resp = await axios.put(appConfig.api.url(`/social-media/conversation/categories/sub-categories/archive?category_id=${selectedCategory.id}&sub_category_id=${selectedSubCategory.id}&mode=${mode}`));
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

    return (
        <>
            <ConversationOptions
                categories={categories}
                subCategories={subCategories}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                handleSetSelectedCategory={handleSetSelectedCategory}
                handleSetSelectedSubCategory={handleSetSelectedSubCategory}
                archiveConversation={archiveConversation}
                isResetting={isResetting}
                conversationsContainer={conversationsContainer}
                scrollToTop={scrollToTop}
                scrollToBottom={scrollToBottom}
            />
            <div>
                {error && <div className="text-red-500">{error}</div>}
            </div>
            <InterviewProgress
                key={selectedSubCategory?.id}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                setCurrentSessionId={setCurrentSessionId}
                setMessages={setMessages}
                setMessagesMetadata={setMessagesMetadata}
                reloadKey={reloadKey}
            />
        </>
    );
};

export default InterviewSubNavMenu;
