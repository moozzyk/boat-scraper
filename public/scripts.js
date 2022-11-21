function hidePost(url) {
  fetch(`/hide?postId=${url}`).then((r) => {
    document.getElementById(url).hidden = true;
  });
}
