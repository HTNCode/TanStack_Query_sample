import { useQuery } from "@tanstack/react-query";
import { secureGet } from "./utils/secureAxios";

// Type definitions for API responses
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const Posts = ({
  setPostId,
}: {
  setPostId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { data, status, error, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<Post[]> => {
      const { data } = await secureGet<Post[]>(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return data;
    },
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isFetching) {
    return <div>Fetching...</div>;
  }

  return (
    <div>
      <h1>ポスト一覧</h1>
      <div>
        {status === "success" ? (
          <>Loading...</>
        ) : (
          <>
            {data && (data as Post[]).map((post: Post) => (
              <p key={post.id}>
                <a href="#" onClick={() => setPostId(post.id)}>
                  {post.title}
                </a>
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;
