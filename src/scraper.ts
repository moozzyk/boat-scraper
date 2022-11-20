import { forSaleBoats } from "craigslist-automation";
import { GalleryPost } from "craigslist-automation/types";
import { DB_FILENAME } from "./common";
import { PostsDb } from "./postsdb";

const regex = new RegExp(
  "^19\\d\\d|seadoo|sea-doo|whaler|sailboat|vintage|smokecraft|pontoon|dingy|inflatable|superjet|yacht",
  "i"
);
function shouldSkip(post: GalleryPost): boolean {
  return regex.test(post.title || "");
}

(async () => {
  const postsDb = new PostsDb(DB_FILENAME);
  postsDb.createPostsDb();

  const lastPostDate = postsDb.lastPostDate();

  for await (let galleryPost of forSaleBoats("seattle", {
    hasImage: true,
    minPrice: 5000,
    maxPrice: 35000,
  })) {
    console.log(galleryPost);
    if (shouldSkip(galleryPost)) {
      continue;
    }
    const post = await galleryPost.getPost();
    const postDate = post.dateUpdated ?? post.datePosted ?? Date.now();
    // if (postDate < lastPostDate) {
    //   break;
    // }
    console.log(post);
    postsDb.insertPost(post);
  }
})();
