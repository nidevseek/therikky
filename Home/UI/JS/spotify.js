let ACCESS_TOKEN = "initial_access_token"; 
let isRefreshing = false;

async function refreshAccessToken() {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: 'AQDo48-p6cA0XTNptrg_OLc7j4_gd3XnKwSrUS3jWpa5fJgZ4CsyIeAc4SITVui0TrpNghCZ4qYcvPFj1axteSF4MJjo-t-teEdA_VbYvIrFCdEe2-mmN7GPqF8R0rXbB34', // Your refresh token
                client_id: '8282ae5ea7fb4a038a271b716cf7d076',
                client_secret: 'b6e2ec9c8f5e40ddaa5e3675e0125f4d',
            })
        });

        const data = await response.json();
        if (data.access_token) {
            ACCESS_TOKEN = data.access_token;
            console.log('New Access Token');
        } else {
            console.error('Failed to refresh access token:', data);
        }
    } catch (error) {
        console.error("Error refreshing access token:", error);
    } finally {
        isRefreshing = false;
    }
}

async function getCurrentTrack() {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
            },
        });

        if (response.status === 401) {
            console.log("Access token expired, refreshing...");
            await refreshAccessToken();
            return getCurrentTrack(); // Retry after refreshing token
        }

        if (response.status === 204) {
            document.getElementById("trackName").innerText = "Nothing's playing right now";
            document.getElementById("artistName").querySelector("span").innerText = "There could be a great artist here";
            document.getElementById("albumCover").src = "https://img.icons8.com/?size=100&id=EHtxO8ZmA602&format=png&color=bbbbbb";
            return;
        }


        const data = await response.json();

        if (data && data.item) {
            const trackName = data.item.name;
            const artistName = data.item.artists.map(artist => artist.name).join(", ");
            const albumCoverUrl = data.item.album.images[0]?.url;
            const durationMs = data.item.duration_ms;
            const progressMs = data.progress_ms;
            document.getElementById("trackName").innerText = trackName;
            document.getElementById("artistName").querySelector("span").innerText = artistName;
            document.getElementById("albumCover").src = albumCoverUrl;
            const progressPercent = (progressMs / durationMs) * 100;
            document.getElementById("progressBar").style.width = `${progressPercent}%`;
            document.getElementById("currentTime").innerText = formatTime(progressMs);
            document.getElementById("totalTime").innerText = formatTime(durationMs);
        }
    } catch (error) {
        console.error("Error while getting current track:", error);
    }
}

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

setInterval(refreshAccessToken, 60000);

setInterval(getCurrentTrack, 1000);
getCurrentTrack();
