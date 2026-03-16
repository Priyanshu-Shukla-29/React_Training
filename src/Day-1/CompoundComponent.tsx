import React, { createContext, useContext } from "react";
import { Card, CardContent, CardActions, Typography, Button, Box } from "@material-ui/core";

// 1. Define Types
interface Post {
  id: string;
  title: string;
  content: string;
  name: string;
}

interface PostCardProps {
  post: Post;
  children: React.ReactNode;
}

// 2. Setup Context
const PostCardContext = createContext<{ post: Post } | any>({
  id: "",
  title: "",
  content: "",
  name: "",
});

// 3. Main Component
export default function CompoundComponent({ post, children }: PostCardProps) {
  return (
    <PostCardContext.Provider value={{ post }}>
      <Box width={300} bgcolor="#262626" borderRadius={4} p={2}>
        <Card>{children}</Card>
      </Box>
    </PostCardContext.Provider>
  );
}

CompoundComponent.Title = function PostCardTitle() {
  const { post } = useContext(PostCardContext);
  return <Typography variant="h6">{post.title}</Typography>;
};

CompoundComponent.Content = function PostCardContent() {
  const { post } = useContext(PostCardContext);
  return (
    <CardContent>
      <Typography variant="body1">{post.content}</Typography>
    </CardContent>
  );
};

CompoundComponent.User = function PostCardUser() {
  const { post } = useContext(PostCardContext);
  return <Typography variant="body2">By {post.name}</Typography>;
};

CompoundComponent.Buttons = function PostCardButtons() {
  return (
    <CardActions>
      <Button variant="contained" color="primary" size="small">
        Read More
      </Button>
      <Button variant="outlined" color="primary" size="small">
        Comments
      </Button>
    </CardActions>
  );
};

{
  /* <CompoundComponent.Title /> */
}
{
  /* <CompoundComponent.Content />
        <CompoundComponent.User />
        <CompoundComponent.Buttons />
      </CompoundComponent>
      <CompoundComponent post={postData}>
        <CompoundComponent.Title />
        <CompoundComponent.Content />
        <CompoundComponent.User />
        <CompoundComponent.Buttons />
      </CompoundComponent> */
}

//  const postData = {
//     id: "1",
//     title: "Hello, World!",
//     content: "This is the first post on our new blog.",
//     name: "John Doe"
  
//   };