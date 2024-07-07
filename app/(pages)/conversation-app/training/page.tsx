'use client'
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { MessageType, MetadataType } from "../ConversationModel/types";
import CategoryType from "../../dashboard/categories/AutoModel/types";
import SubCategoryType from "../../dashboard/categories/[categoryId]/sub-categories/AutoModel/types";
import { appConfig } from "@/app/components/baseComponents/utils/helpers";
import RenderMessages from "../ConversationModel/RenderMessages";
import RecordMessage from "../ConversationModel/Recorder/RecordMessage";
import TrainingSubNavMenu from "../ConversationModel/TrainingSubNavMenu";

const Page = () => {
    const mode = 'training'

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [messagesMetadata, setMessagesMetadata] = useState<MetadataType>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType | undefined>();
    const [uploadFailed, setUploadFailed] = useState<boolean>(false);
    const [hasDoneAnyRecording, setHasDoneAnyRecording] = useState(false); // State to track if user has done any recording

    const conversationsContainer = useRef<HTMLDivElement>(null);

    const handleStop = async (blobUrl: string) => {
        setIsLoading(true);

        if (selectedCategory?.id && selectedSubCategory?.id) {

            try {
                // Convert blob url to blob object
                const blob = await fetch(blobUrl).then((b) => b.blob());

                // Construct form data to send file
                const formData = new FormData();
                formData.append('file', blob, `my_speech_for_${selectedCategory.id}.wav`);

                // Send form data to the FastAPI backend
                const resp = await axios.post(appConfig.api.url(`/post-audio?sub_cat_id=${selectedSubCategory.id}&mode=${mode}`), formData, {
                    headers: {
                        'Content-Type': 'audio/mpeg',
                    },
                    responseType: 'json',
                });

                if (resp.status === 200) {
                    const results = resp.data.results;
                    const metadata = resp.data.metadata;
                    const myMessage: MessageType = { ...results[0], audio: blobUrl };
                    setMessages(prevMessages => [...prevMessages, myMessage]);
                    setMessagesMetadata(metadata || null)

                    // Fetch the assistant's audio
                    const assistantAudioResponse = await axios.get(appConfig.api.url(`${results[1]['audio_uri']}`), {
                        responseType: 'blob',
                    });

                    if (assistantAudioResponse.status === 200) {
                        const assistantAudioBlob = assistantAudioResponse.data;
                        const assistantAudioUrl = window.URL.createObjectURL(assistantAudioBlob);
                        const assistantMessage: MessageType = { ...results[1], audio: assistantAudioUrl };
                        setMessages(prevMessages => [...prevMessages, assistantMessage]);
                        setUploadFailed(false)
                        setHasDoneAnyRecording(true)

                    } else {
                        setUploadFailed(true)
                        console.error('Error fetching assistant audio.');
                    }
                } else {
                    setUploadFailed(true)
                    console.error('Error posting audio.');
                }
            } catch (error) {
                setUploadFailed(true)
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const scrollToTop = () => {
        if (conversationsContainer.current) {
            conversationsContainer.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const scrollToBottom = () => {
        if (conversationsContainer.current) {
            conversationsContainer.current.scrollTo({
                top: conversationsContainer.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        setHasDoneAnyRecording(false);
    }, [selectedSubCategory]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="bg-base-100 flex flex-col h-screen p-1 relative">
            <TrainingSubNavMenu mode={mode} setMessages={setMessages} setMessagesMetadata={setMessagesMetadata} reloadKey={0} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} conversationsContainer={conversationsContainer} scrollToTop={scrollToTop} scrollToBottom={scrollToBottom} />
            <div ref={conversationsContainer} className="flex-1 overflow-auto p-4">
                <div className="space-y-2">
                    {
                        selectedSubCategory &&
                        <p className="text-center my-3 text-lg border-base-300 border-b-2 px-2 text-success">{selectedSubCategory.learn_instructions}</p>
                    }
                    <RenderMessages messages={messages} isLoading={isLoading} hasDoneAnyRecording={hasDoneAnyRecording} conversationsContainer={conversationsContainer} />
                </div>
            </div>
            <div className="sticky bottom-0 left-0 right-0 shadow-lg z-50 min-h-32">
                <RecordMessage handleStop={handleStop} messagesMetadata={messagesMetadata} isLoading={isLoading} uploadFailed={uploadFailed} conversationsContainer={conversationsContainer} />
            </div>
        </div>
    );
};

export default Page;
