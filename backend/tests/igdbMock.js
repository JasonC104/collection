function getGamesInfo() {
    return [{
        "id": 115278,
        "cover": { "id": 73933, "image_id": "co1l1p" },
        "genres": [{ "id": 12, "name": "Role-playing (RPG)" }],
        "summary": "Experience this legendary fantasy adventure like never before and embark on exciting escapades with your favorite characters in the brand new Newlywed Mode!",
        "themes": [
            { "id": 1, "name": "Action" },
            { "id": 17, "name": "Fantasy" }
        ]
    }];
}

function search() {
    return [
        {
            "id": 41874,
            "cover": { "id": 28164, "image_id": "yp31j3blb5yl3dcqjonn" },
            "name": "Uncharted 4: A Thief's End Special Edition",
            "platforms": [{ "id": 48, "abbreviation": "PS4", "name": "PlayStation 4" }],
            "popularity": 1.0
        },
        {
            "id": 7331,
            "cover": { "id": 43485, "image_id": "zvkdiv2dze8tcit6bzza" },
            "name": "Uncharted 4: A Thief's End",
            "platforms": [{ "id": 48, "abbreviation": "PS4", "name": "PlayStation 4" }],
            "popularity": 42.43860519813997
        }
    ];
}

function getAnticipated() {
    return [{
        "id": 115278,
        "cover": { "id": 73933, "image_id": "co1l1p" },
        "first_release_date": 1564012800,
        "genres": [{ "id": 12, "name": "Role-playing (RPG)" }],
        "name": "Rune Factory 4 Special",
        "platforms": [{ "id": 130, "abbreviation": "Switch", "name": "Nintendo Switch" }],
        "summary": "Experience this legendary fantasy adventure like never before and embark on exciting escapades with your favorite characters in the brand new Newlywed Mode!",
        "themes": [
            { "id": 1, "name": "Action" },
            { "id": 17, "name": "Fantasy" }
        ]
    }];
}

function getHighlyRated() {
    return getAnticipated();
}

function getRecentlyReleased() {
    return getAnticipated();
}

module.exports = { getGamesInfo, search, getAnticipated, getHighlyRated, getRecentlyReleased };

