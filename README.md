# TS Import

Import TypeScript files directly from Node.js script

> This project was created for educational purpose.

# Running scripts

```sh
$ node --loader ./dist/esm_hooks.js <filename>

# or
$ npm run tsimport <filename>
$ yarn tsimport <filename>
```

# Stuff that happens
* TypeScript file can be directly executed/imported
* Type checking does not occur
* File extension is required, example `import a from "./b.ts"` instead of `import a from "./b"`
* JavaScript file can import TypeScript and vice versa

# Example

`memer/index.ts`

```ts
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
```

`meme.mjs`

```js
import memer from "./memer/index.ts";

const meme = await memer("programmerhumor");
console.log(meme);

/*
Output:
{
  isVideo: false,
  isNSFW: false,
  imageURL: 'https://i.redd.it/l916na6mmi791.jpg',
  ratings: { upvote: 2825, downvote: 0, comments: 150 },
  title: 'I barely hanging on',
  url: 'https://reddit.com/r/ProgrammerHumor/comments/vji3d0/i_barely_hanging_on/',
  subreddit: 'ProgrammerHumor'
}
*/
```

### Run with

```sh
$ yarn tsimport meme.mjs
```