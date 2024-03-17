import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Post = ({
  postId,
  setPostId,
}: {
  postId: number;
  setPostId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { data, status, error, isFetching } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      return data;
    },
    enabled: !!postId,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isFetching) {
    return <div>Fetching...</div>;
  }

  return (
    <div>
      {status === "pending" ? (
        <>Loading...</>
      ) : (
        <>
          <h1>{data.title}</h1>
          <div>
            <p>{data.body}</p>
          </div>
          <div>
            <a href="#" onClick={() => setPostId(-1)}>
              戻る
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
