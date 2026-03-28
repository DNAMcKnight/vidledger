
type VideoCardProps = {
    videoObject: {
        "thumbnails": {
            "url": string,
            "width": number,
            "height": number
        },
        "_id": string,
        "publishedAt": string,
        "channelId": string,
        "title": string,
        "url": string,
        "type": string
        "channelInfo": {
            "_id": string,
            "category": string,
            "name": string,
            "username": string,
            "channel_id": string,
        }
    }
};


function VideoCard(props: VideoCardProps) {
    const video = props.videoObject;
    return (
        <div className="video-card w-full">
            {/* Thumbnail */}
            <div className="video-thumbnail relative">
                <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={video.thumbnails.url}
                    alt={video.title}
                />
                {/* Optional overlay (for hover buttons later) */}
                <div className="video-overlay absolute top-0 left-0 w-full h-full"></div>
            </div>

            {/* Info */}
            <div className="video-info mt-2">
                <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                    {video.channelInfo.name} • {video.publishedAt?.split("T")[0]}
                </p>
            </div>
        </div>
    );
}
export default VideoCard;