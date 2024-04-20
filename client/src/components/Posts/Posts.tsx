import Post from "../Post/Post";
import { useQuery, gql } from "@apollo/client";

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      body
      userId
      createdAt
    }
  }
`;

export type PostType = {
  id?: string;
  body: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
};

const Posts = () => {
  const { data } = useQuery(GET_POSTS);

  return (
    <div>
      {data &&
        data.posts.map((post: PostType) => (
          <Post
            key={post.id}
            id={post.id}
            body={post.body}
            userId={post.userId}
            createdAt={post.createdAt}
          />
        ))}
    </div>
  );
};
export default Posts;
