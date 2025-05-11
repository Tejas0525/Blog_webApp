import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage() {
  const [posts, SetPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/post").then((response) => {
      response.json().then((posts) => {
        SetPosts(posts);
      });
    });
  }, []);

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => {
          return <Post key={post._id}{...post}/>;
        })}
    </>
  );
}
