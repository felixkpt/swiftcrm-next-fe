export type MessageType = {
    role: string;
    content?: string;
    audio?: string;
    audio_uri?: string;
    created_at: Date;
};

import { RefObject } from "react";

export type CategoryType = {
    id: string;
    name: string;
    learn_instructions: string;
};

export type SubCategoryType = {
    id: string;
    name: string;
    learn_instructions: string;
    created_at: string
    action: string
};

export type SubNavMenuProps = {
    setMessages: React.Dispatch<React.SetStateAction<Array<any>>>;
    setMessagesMetadata: React.Dispatch<React.SetStateAction<null | any>>;
    setLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategory: CategoryType | undefined;
    setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryType | undefined>>;
    selectedSubCategory: SubCategoryType | undefined;
    setSelectedSubCategory: React.Dispatch<React.SetStateAction<SubCategoryType | undefined>>;
    conversationsContainer: RefObject<HTMLDivElement>;
    scrollToTop: any;
    scrollToBottom: any;
    mode: 'training' | 'interview';
    reloadKey?: number
};

export type InterviewSessionType = {
    id: number;
    user_id: number;
    category_id: number;
    sub_category_id: number;
    current_question_id: number;
    status_id: number;
    created_at: string;
    updated_at: string;
    category_name: string;
    sub_category_name: string
};

export type ResultsType = any[]
export type MetadataType =
    {
        [key: string]: any
        page: number
        per_page: number
        total: number
    } | null

export type ResultsWithMetaDataType = ResultsType & MetadataType
