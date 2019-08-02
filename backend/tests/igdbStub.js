const data = [
    {
        "id": 26845,
        "cover": { "id": 76781, "url": "//images.igdb.com/igdb/image/upload/t_thumb/co1n8t.jpg" },
        "first_release_date": 1564099200,
        "genres": [
            { "id": 12, "name": "Role-playing (RPG)" },
            { "id": 16, "name": "Turn-based strategy (TBS)" },
        ],
        "name": "Fire Emblem: Two Houses",
        "platforms": [{ "id": 130, "abbreviation": "Switch", "name": "Nintendo Switch" }],
        "summary": "Here, order is maintained by the Church of Seiros, which hosts the prestigious Officer’s Academy within its headquarters. You are invited to teach one of its three mighty houses, each comprised of students brimming with personality and represented by a royal from one of three territories. As their professor, you must lead your students in their academic lives and in turn-based, tactical RPG battles wrought with strategic, new twists to overcome. Which house, and which path, will you choose?",
        "themes": [
            { "id": 17, "name": "Fantasy" },
            { "id": 39, "name": "Warfare" }
        ],
        "popularity": 8
    }, {
        "id": 26845,
        "cover": { "id": 76781, "url": "//images.igdb.com/igdb/image/upload/t_thumb/co1n8t.jpg" },
        "first_release_date": 1564099200,
        "genres": [
            { "id": 12, "name": "Role-playing (RPG)" },
            { "id": 16, "name": "Turn-based strategy (TBS)" },
        ],
        "name": "Fire Emblem: Three Houses",
        "platforms": [{ "id": 130, "abbreviation": "Switch", "name": "Nintendo Switch" }],
        "summary": "Here, order is maintained by the Church of Seiros, which hosts the prestigious Officer’s Academy within its headquarters. You are invited to teach one of its three mighty houses, each comprised of students brimming with personality and represented by a royal from one of three territories. As their professor, you must lead your students in their academic lives and in turn-based, tactical RPG battles wrought with strategic, new twists to overcome. Which house, and which path, will you choose?",
        "themes": [
            { "id": 17, "name": "Fantasy" },
            { "id": 39, "name": "Warfare" }
        ],
        "popularity": 10
    },
    {
        "id": 18225,
        "cover": { "id": 74152, "url": "//images.igdb.com/igdb/image/upload/t_thumb/co1l7s.jpg" },
        "first_release_date": 1561593600,
        "genres": [{ "id": 31, "name": "Adventure" }],
        "name": "The Sinking City",
        "platforms": [
            { "id": 6, "abbreviation": "PC", "name": "PC (Microsoft Windows)" },
            { "id": 48, "abbreviation": "PS4", "name": "PlayStation 4" },
        ],
        "summary": "The Sinking City is a game of investigation genre taking place in a fictional open world inspired by the works of H.P. Lovecraft. \nThe player incarnates a private investigator in 1920s, who finds himself in a city of New England, Oakmont Massachusetts. It’s currently suffering from extensive waterflood, and its cause is clearly supernatural.",
        "themes": [
            { "id": 1, "name": "Action" },
            { "id": 19, "name": "Horror" },
        ],
        "popularity": 20
    }
];

function searchGame(title) {
    return new Promise((resolve) => {
        if (title === 'Fire Emblem') {
            resolve({ data: data.slice(0, 2) });
        } else {
            resolve({ data: data.slice(2) });
        }
    });
}

function getGameCover(id) {

}

function anticipatedGames() {
    return new Promise((resolve) => {
        resolve({ data });
    });
}

function highlyRated() {
    return anticipatedGames();
}

function recentlyReleased() {
    return anticipatedGames();
}

module.exports = { searchGame, getGameCover, anticipatedGames, highlyRated, recentlyReleased };

