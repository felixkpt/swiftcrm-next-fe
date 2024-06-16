import { useState } from "react";
import Title from "./Title";
import RecordMessage from "./Recorder/RecordMessage";
import axios from "axios";
import RenderMessages from "./RenderMessages";
import { CategoryType, SubCategoryType } from "../../types";

interface Message {
    role: string;
    content?: string;
    audio?: string;
}

const MainContainer = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType | undefined>();
    const [uploadFailed, setUploadFailed] = useState<boolean>(false);

    const handleStop = async (blobUrl: string) => {
        setIsLoading(true);

        if (!selectedCategory?.id) return

        try {
            // Convert blob url to blob object
            const blob = await fetch(blobUrl).then((b) => b.blob());

            // Construct form data to send file
            const formData = new FormData();
            formData.append('file', blob, `my_speech_for_${selectedCategory.id}.wav`);

            // Send form data to the FastAPI backend
            const resp = await axios.post(`http://127.0.0.1:8000/post-audio?sub_cat_id=${selectedSubCategory.id}`, formData, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                },
                responseType: 'json',
            });

            if (resp.status === 200) {
                const responseData = resp.data;
                const myMessage: Message = { ...responseData[0], audio: blobUrl };
                setMessages(prevMessages => [...prevMessages, myMessage]);

                // Fetch the assistant's audio
                const assistantAudioResponse = await axios.get(`http://127.0.0.1:8000${responseData[1]['audio_uri']}`, {
                    responseType: 'blob',
                });

                if (assistantAudioResponse.status === 200) {
                    const assistantAudioBlob = assistantAudioResponse.data;
                    const assistantAudioUrl = window.URL.createObjectURL(assistantAudioBlob);
                    const assistantMessage: Message = { ...responseData[1], audio: assistantAudioUrl  };
                    setMessages(prevMessages => [...prevMessages, assistantMessage]);

                    // Play the assistant's audio response
                    const audioToPlay = new Audio(assistantAudioUrl);
                    audioToPlay.play();
                    setUploadFailed(false)
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
    };

    return (
        <div>
            <div className="flex-grow">
                <Title setMessages={setMessages} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
                <div className="h-screen overflow-auto pb-56 bg-slate-700 text-gray-300 p-4">
                    {
                        selectedSubCategory &&
                        <p className="text-center my-3 text-lg border-gray-500 border-b-2 px-2">{selectedSubCategory.learn_instructions}</p>
                    }
                    <RenderMessages messages={messages} isLoading={isLoading} />
                </div>
            </div>
            <RecordMessage handleStop={handleStop} isLoading={isLoading} uploadFailed={uploadFailed} />
        </div>
    );
};

export default MainContainer;
