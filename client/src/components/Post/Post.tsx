import { formatDate } from "../../utils/formatDate";

interface PostProps {
  id?: string;
  body: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

const Post = ({
  id,
  body,
  userId,
  createdAt,
  updatedAt,
}: PostProps) => {
  return (
    <div>
      <div>
        <p>{body}</p>
        <p>Posted by {userId}</p>
        <p>Created at {formatDate(createdAt)}</p>
        {updatedAt && <p>Updated at {formatDate(updatedAt)}</p>}
      </div>
    </div>
  );
};
export default Post;
