import { useState } from "react";
import "./App.css";
import Post from "./Post";
import Posts from "./Posts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// インスタンスを作成
const queryClient = new QueryClient();

function App() {
  const [postId, setPostId] = useState(-1);

  return (
    // QueryClientProviderでラップ
    <QueryClientProvider client={queryClient}>
      {postId > -1 ? (
        <Post postId={postId} setPostId={setPostId} />
      ) : (
        <Posts setPostId={setPostId} />
      )}
      {/* ReactQueryDevtoolsを追加 */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
