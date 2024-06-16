import TimeAgo from 'react-timeago'
type Message = { role: string; content?: string; audio?: string, audio_uri?: string };
type Props = { messages: Message[]; isLoading: boolean };

const RenderMessages = ({ messages, isLoading }: Props) => {

    return (
        <div className="flex flex-col">
            {messages.length === 0 ? (
                <div className="text-center text-emerald-600 text-lg">
                    <p>No messages yet. Start recording to send a message!</p>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div
                        key={index}
                        className={
                            "mb-4 flex flex-col " +
                            (message.role === 'user' ? 'items-end' : 'items-start')
                        }
                    >
                        <div className="bg-slate-600 w-3/4 rounded-xl p-3">
                            <span className="font-semibold block text-gray-300 uppercase">{message.role == 'user' ? 'You' : 'Assistant'}</span>
                            {message.content && (
                                <p className="mt-2">{message.content}</p>
                            )}
                            {
                                message.audio ?
                                    <audio src={message.audio} controls className="mt-2 w-full" />
                                    :
                                    message.audio_uri ? <audio src={`http://127.0.0.1:8000${message.audio_uri}`} controls className="mt-2 w-full" />
                                        :
                                        null
                            }
                            <div className="flex justify-end">
                                <span className="rounded p-1 text-gray-400 text-sm"><TimeAgo date={message.created_at} /></span>
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
