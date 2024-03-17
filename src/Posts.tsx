import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Posts = ({
  setPostId,
}: {
  setPostId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { data, status, error, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axios.get(
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
        {status === "pending" ? (
          <>Loading...</>
        ) : (
          <>
            {data.map((post: any) => (
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
