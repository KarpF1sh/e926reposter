class Post {
    // Make this more robust, by not assuming the fields are always present
    id: number;
    artists: string[];
    score: number;
    favs: number;
    url: string;
    sizeMb: number;
    sampleUrl: string;
    rating: string;
    animated: boolean;
    webm: boolean;

    // Optional fields
    parent_id: number | null;
    children: number[] | null;
    pools: number[] | null;

    // Constructor to create a Post object from the JSON response
    // Format in: https://e621.net/wiki_pages/2425
    constructor(data: any) {
        this.id = data.id;
        this.artists = data.tags.artist.filter(artist => artist !== "conditional_dnp" || artist !== "unknown_artist" || artist !== "anonymous_artist");
        this.score = data.score.total;
        this.favs = data.fav_count;
        this.url = data.file.url;
        this.sizeMb = data.file.size / 1024 / 1024; // In megabytes
        this.sampleUrl = data.sample.url;
        this.rating = data.rating;
        this.animated = data.tags.meta.includes("animated"); // for showing a text if the post is animated
        this.webm = data.tags.meta.includes("webm");

        // Optional fields
        this.parent_id = data.relationships.parent_id;
        this.children = data.relationships.children;
        this.pools = data.pools;
    }
}

export { Post };