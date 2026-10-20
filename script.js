// Find the HTML elements we need.
const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const status = document.getElementById("status");
const profile = document.getElementById("profile");
const searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit",async (event) => {

    event.preventDefault();
    const username = usernameInput.value.trim();

    if(!username){
        status.textContent = "Please enter a username.";
        profile.replaceChildren();
        usernameInput.focus();
        return;
    }

    status.textContent = "Searching for profile...";
    searchBtn.disabled=true;
    profile.replaceChildren();

    try{
        const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`
);

        if (!response.ok) {
    if (response.status === 404) {
        throw new Error("User not found. Check the username.");
    }

    if (response.status === 403 || response.status === 429) {
        throw new Error("GitHub API rate limit reached. Try again later.");
    }

    throw new Error(`GitHub returned an error (${response.status}).`);
}

        const data = await response.json();

        status.textContent=`Found ${data.login}`;
        const avatar=document.createElement("img");
        avatar.src=data.avatar_url;
        avatar.alt=`${data.login}'s profile picture`;
        avatar.width=120;

        const name=document.createElement("h2");
        name.textContent=data.name || data.login;

        const bio=document.createElement("p");
        bio.textContent=data.bio || "No bio available";

        const stats=document.createElement("p");
        stats.textContent =
    `Followers: ${data.followers} | Following: ${data.following} | Repositories: ${data.public_repos}`;
        
        const link=document.createElement("a");
        link.href=data.html_url;
        link.textContent="View Github profile";
        link.target="_blank";
        link.rel="noopener norefreer";

        profile.append(avatar,name,bio,stats,link);
        
    } catch (error){
        status.textContent=error.message || "Network error. Try again.";
    } finally{
        searchBtn.disabled=false;
        searchBtn.textContent="Search";
    }
});