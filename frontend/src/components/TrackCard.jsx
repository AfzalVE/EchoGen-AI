export function TrackCard({ track }) {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
      
      <div className="bg-[#111] rounded-2xl p-4 hover:bg-[#181818] transition flex flex-col justify-between h-full">
        
        {/* COVER */}
        <div className="h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl mb-4 flex items-center justify-center text-white text-lg font-semibold">
          🎵
        </div>

        {/* TITLE */}
        <h3 className="font-medium text-sm mb-3 text-white line-clamp-2">
          {track.title}
        </h3>

        {/* AUDIO */}
        <audio
          controls
          className="w-full mb-3 rounded-md"
          src={track.url}
        >
          Your browser does not support audio
        </audio>

        {/* DOWNLOAD */}
        <a
          href={track.url}
          download
          className="text-xs text-center py-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-black font-medium hover:opacity-90"
        >
          ⬇ Download
        </a>
      </div>
    </div>
  );
}