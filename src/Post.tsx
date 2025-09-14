import { useQuery } from "@tanstack/react-query";
import { secureGet } from "./utils/secureAxios";

// Type definitions for API responses
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const Post = ({
  postId,
  setPostId,
}: {
  postId: number;
  setPostId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { data, status, error, isFetching } = useQuery({
    queryKey: ["post", postId],
    queryFn: async (): Promise<Post> => {
      const { data } = await secureGet<Post>(
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
      {status === "success" ? (
        <>Loading...</>
      ) : (
        <>
          <h1>{data && (data as Post).title}</h1>
          <div>
            <p>{data && (data as Post).body}</p>
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
