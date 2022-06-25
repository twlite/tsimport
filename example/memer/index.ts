interface MemeData {
    isVideo: boolean;
    isNSFW: boolean;
    imageURL: string;
    ratings: {
        upvote: number;
        downvote: number;
        comments: number;
    };
    title: string;
    url: string;
    subreddit: string;
}

function memer(subreddit: string): Promise<MemeData> {
    return new Promise((resolve, reject) => {
        if (!subreddit) reject("subreddit was not provided!");
        const url = `https://api.reddit.com/r/${subreddit}/random`;

        fetch(url)
            .then((res) => res.json())
            .then((body) => {
                const base = body[0].data.children[0].data;
                if (!base) reject(new Error("No result found!"));

                let data: MemeData = {
                    isVideo: base.is_video,
                    isNSFW: base.over_18,
                    imageURL: base.url,
                    ratings: {
                        upvote: base.ups,
                        downvote: base.downs,
                        comments: base.num_comments,
                    },
                    title: base.title,
                    url: `https://reddit.com${base.permalink}`,
                    subreddit: base.subreddit,
                };
                resolve(data);
            })
            .catch((e) => {
                reject(`Something went wrong: ${e}`);
            });
    });
}

export default memer;