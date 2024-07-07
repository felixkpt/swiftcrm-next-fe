import { useState, useEffect } from 'react';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { CategoryType, SubCategoryType } from '../types';

type Props = {
    selectedCategory: CategoryType | undefined
    setSelectedSubCategory: React.Dispatch<React.SetStateAction<SubCategoryType | undefined>>
}

export const useSubCategories = ({ selectedCategory, setSelectedSubCategory }: Props) => {
    const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (!selectedCategory?.id) return;

            try {
                const response = await axios.get<{ results: SubCategoryType[] }>(appConfig.api.url(`/dashboard/categories/${selectedCategory.id}/sub-categories`));
                const data = response.data.results;
                setSubCategories(data || []);
                setSelectedSubCategory(data[0] || null);
            } catch (error) {
                console.error('Error fetching sub-categories:', error);
            }
        };

        fetchSubCategories();
    }, [selectedCategory]);

    return { subCategories };
};
