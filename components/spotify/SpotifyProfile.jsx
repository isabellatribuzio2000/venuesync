export default function SpotifyProfile({ artistData }) {
  if (!artistData) return null

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="text-center">
        {artistData.images?.[0] && (
          <img
            src={artistData.images[0].url || "/placeholder.svg"}
            alt={artistData.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <h2 className="text-2xl font-bold text-white mb-2">{artistData.name}</h2>
        <p className="text-gray-400 mb-4">{artistData.genres?.join(", ")}</p>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-400">{artistData.followers?.total?.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{artistData.popularity}</p>
            <p className="text-sm text-gray-400">Popularity</p>
          </div>
        </div>
      </div>
    </div>
  )
}
