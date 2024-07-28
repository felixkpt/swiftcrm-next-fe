import { useState, useEffect } from 'react';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { CategoryType } from '../types';

type Prop = React.Dispatch<React.SetStateAction<CategoryType | undefined>>

export const useCategories = (setSelectedCategory: Prop) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const params = {
                per_page: 20,
            }

            try {
                const response = await axios.get<CategoryType[]>(appConfig.api.url('social-media/conversation/categories'), {
                    params
                });
                const data = response.data
                setCategories(data?.records || []);
                const initialCategory = data?.records[0] || null;
                if (initialCategory) {
                    setSelectedCategory(initialCategory);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [setSelectedCategory]);

    return { categories };
};
