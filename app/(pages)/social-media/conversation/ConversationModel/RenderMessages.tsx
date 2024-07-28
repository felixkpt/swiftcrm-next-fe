import React, { useEffect, useState, RefObject } from 'react';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { MessageType } from './types';
import { pauseAllAudioElements } from './helpers';

type Props = {
    messages: MessageType[];
    isLoading: boolean;
    hasDoneAnyRecording: boolean;
    conversationsContainer: RefObject<HTMLDivElement>;
};

const RenderMessages = ({ messages = [], isLoading, hasDoneAnyRecording, conversationsContainer }: Props) => {
    const [userInteracted, setUserInteracted] = useState(false);

    useEffect(() => {
        const handleUserInteraction = () => {
            setUserInteracted(true);
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('keydown', handleUserInteraction);

        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);

    useEffect(() => {
        const playLastAudio = () => {
            if (conversationsContainer.current && userInteracted && hasDoneAnyRecording && !isLoading) {
                const audioElements = conversationsContainer.current.querySelectorAll('.singleConversationSection audio');
                audioElements.forEach((itm) => {
                    const audio = itm as HTMLAudioElement;
                    audio.pause();
                    audio.currentTime = 0;
                });

                setTimeout(() => {
                    if (audioElements.length > 0) {
                        const lastAudio = audioElements[audioElements.length - 1];
                        if (lastAudio instanceof HTMLAudioElement) {
                            lastAudio.volume = 0.2;
                            lastAudio.play().catch((error: any) => console.error('Audio playback error:', error));
                        }
                    }
                }, 1000);
            }
        };

        setTimeout(() => {
            playLastAudio();
        }, 300);
    }, [messages, userInteracted, hasDoneAnyRecording, isLoading]);

    useEffect(() => {
        const audioElements = conversationsContainer.current?.querySelectorAll('.singleConversationSection audio');
        audioElements?.forEach((audio) => {
            audio.addEventListener('play', (e) => pauseAllAudioElements(conversationsContainer, e.currentTarget as HTMLAudioElement));
        });

        return () => {
            audioElements?.forEach((audio) => {
                audio.removeEventListener('play', (e) => pauseAllAudioElements(conversationsContainer, e.currentTarget as HTMLAudioElement));
            });
        };
    }, [messages, conversationsContainer]);

    return (
        <div className="flex flex-col">
            {messages.length === 0 ? (
                <div className="text-center text-neutral">
                    <p>No messages yet. Start recording to send a message!</p>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div
                        key={index}
                        className={
                            'singleConversationSection mb-4 flex flex-col ' +
                            (message.role === 'user' ? 'items-end' : 'items-start')
                        }
                        data-role={message.role}
                    >
                        <div className="bg-base-300 w-3/4 rounded-xl p-3">
                            <span className={"font-semibold flex gap-1 items-center uppercase " + (message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {
                                    message.role === 'user' ?
                                        <span className="flex items-center gap-1">
                                            <div></div>
                                            <div className="avatar online placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-16">
                                                    <span className="text-normal">You</span>
                                                </div>
                                            </div>
                                        </span>
                                        :
                                        <span className="flex items-center gap-1">
                                            <div className="avatar online placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-16">
                                                    <span className="text-normal">AI</span>
                                                </div>
                                            </div>
                                            <div></div>
                                        </span>
                                }
                            </span>
                            {message.content && (
                                <ReactMarkdown className="mt-2">
                                    {message.content}
                                </ReactMarkdown>
                            )}
                            <div className="audioSection">
                                {message.audio ? (
                                    <audio src={message.audio} controls className="mt-2 w-full" />
                                ) : message.audio_uri ? (
                                    <audio
                                        src={appConfig.api.url(`${message.audio_uri}`)}
                                        controls
                                        className="mt-2 w-full"
                                    />
                                ) : null}
                            </div>
                            <div className="flex justify-end">
                                <span className="rounded p-1 text-gray-400 text-sm">
                                    <TimeAgo date={message.created_at} />
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
            {isLoading && (
                <div className="text-center my-4 animate-pulse cursor-default select-none">
                    <p>Gimmie a few seconds...</p>
                </div>
            )}
        </div>
    );
};

export default RenderMessages;
