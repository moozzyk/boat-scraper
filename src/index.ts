import { forSaleCarAndTrucks } from "craigslist-automation";

(async () => {
  let value = 0;
  for await (let galleryPost of forSaleCarAndTrucks("seattle", {
    query: "blazer k5",
  })) {
    console.log(galleryPost);
    const post = await galleryPost.getPost();
    console.log(post);
    if (value++ > 3) {
      break;
    }
  }
})();
