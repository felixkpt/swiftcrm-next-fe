import React, { RefObject, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';
import CategoryType from '../../social-media/conversation/categories/AutoModel/types';
import { playAllAudioElements, pauseAllAudioElements } from './helpers'; // Import the helper functions

interface Props {
    categories: CategoryType[];
    subCategories: CategoryType[];
    selectedCategory?: CategoryType | null;
    selectedSubCategory?: CategoryType | null;
    handleSetSelectedCategory: (event: React.ChangeEvent<{ value: unknown }>) => void;
    handleSetSelectedSubCategory: (event: React.ChangeEvent<{ value: unknown }>) => void;
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

    const handlePlayAllClick = () => {
        if (!isPlaying) {
            playAllAudioElements(conversationsContainer);
            setIsPlaying(true);
            scrollToTop();
        } else {
            pauseAllAudioElements(conversationsContainer);
            setIsPlaying(false);
            scrollToBottom();
        }
    };

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" my={3} fontWeight="bold">
            <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} alignItems="center" gap={2}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Pick a category</InputLabel>
                    <Select
                        value={selectedCategory?.id || ''}
                        onChange={handleSetSelectedCategory}
                        label="Pick a category"
                        disabled={categories.length === 0}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Pick a sub category</InputLabel>
                    <Select
                        value={selectedSubCategory?.id || ''}
                        onChange={handleSetSelectedSubCategory}
                        label="Pick a sub category"
                        disabled={subCategories.length === 0}
                    >
                        {subCategories.map((subCategory) => (
                            <MenuItem key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box display="flex" justifyContent="end" gap={1}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlayAllClick}
                    startIcon={
                        isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                            </svg>
                        )
                    }
                >
                    {isPlaying ? 'Pause All' : 'Play All'}
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={archiveConversation}
                    disabled={isResetting || !selectedCategory || !selectedSubCategory}
                    startIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    }
                >
                    Archive
                </Button>
            </Box>
        </Box>
    );
};

export default ConversationOptions;
