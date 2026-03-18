const { addonBuilder } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

const TMDB_API_KEY = "ENTER KEY HERE";

const manifest = {
    id: "org.mrzed0.streaming",
    version: "1.2.0",
    name: "MrZed0.com VidKing",
    description: "Watch movies and TV shows via VidKing.net",
    resources: ["stream", "catalog"],
    types: ["movie", "series"],
    idPrefixes: ["tt", "1", "2", "3", "4", "5", "6", "7", "8", "9"], 
    catalogs: [
        {
            type: "movie",
            id: "vidking_popular_movies",
            name: "VidKing: Popular Movies"
        },
        {
            type: "series",
            id: "vidking_top_tv",
            name: "VidKing: Top Rated TV"
        }
    ]
};

const builder = new addonBuilder(manifest);

// Converts IMDb ID (tt...) to TMDb ID (numeric)
async function getTmdbId(id, type) {
    if (!id.startsWith("tt")) return id; // Already a TMDb ID
    
    try {
        const findUrl = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
        const resp = await fetch(findUrl);
        const data = await resp.json();
        
        if (type === "movie" && data.movie_results.length > 0) {
            return data.movie_results[0].id.toString();
        } else if (type === "series" && data.tv_results.length > 0) {
            return data.tv_results[0].id.toString();
        }
    } catch (e) {
        console.error("ID Conversion Error:", e);
    }
    return id;
}

builder.defineCatalogHandler(async (args) => {
    let url = "";
    if (args.id === "vidking_popular_movies") {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`;
    } else if (args.id === "vidking_top_tv") {
        url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}`;
    }

    if (url) {
        try {
            const resp = await fetch(url);
            const data = await resp.json();
            const metas = data.results.map(item => ({
                id: item.id.toString(), 
                type: args.type,
                name: item.title || item.name,
                poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                description: item.overview
            }));
            return { metas };
        } catch (e) {
            console.error("TMDb Fetch Error:", e);
        }
    }
    return { metas: [] };
});

builder.defineStreamHandler(async (args) => {
    const { type, id } = args;
    let videoUrl = "";
    
    if (type === "movie") {
        // Convert ttXXXX to numeric TMDb ID if necessary
        const numericId = await getTmdbId(id, "movie");
        videoUrl = `https://www.vidking.net/embed/movie/${numericId}`;
    } else if (type === "series") {
        if (id.includes(":")) {
            const [rawId, season, episode] = id.split(":");
            const numericId = await getTmdbId(rawId, "series");
            videoUrl = `https://www.vidking.net/embed/tv/${numericId}/${season}/${episode}`;
        } else {
            const numericId = await getTmdbId(id, "series");
            videoUrl = `https://www.vidking.net/embed/tv/${numericId}/1/1`;
        }
    }

    if (videoUrl) {
        return {
            streams: [{
                title: "Play on VidKing.net",
                externalUrl: videoUrl 
            }]
        };
    }
    return { streams: [] };
});

module.exports = builder.getInterface();