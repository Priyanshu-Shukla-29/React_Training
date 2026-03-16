import React from 'react';
import { render, screen } from '@testing-library/react';
import CompoundComponent from './CompoundComponent'; // Adjust path if needed

describe('CompoundComponent (PostCard)', () => {
  const postData = {
    id: "1",
    title: "Testing Compound Components",
    content: "This is a test content for the blog post.",
    name: "Jane Doe"
  };

  test('should render all sub-components with the correct context data', () => {
    render(
      <CompoundComponent post={postData}>
        <CompoundComponent.Title />
        <CompoundComponent.Content />
        <CompoundComponent.User />
        <CompoundComponent.Buttons />
      </CompoundComponent>
    );

    // 1. Check Title
    expect(screen.getByText("Testing Compound Components")).toBeInTheDocument();

    // 2. Check Content
    expect(screen.getByText("This is a test content for the blog post.")).toBeInTheDocument();

    // 3. Check User
    expect(screen.getByText("By Jane Doe")).toBeInTheDocument();

    // 4. Check Buttons
    expect(screen.getByRole('button', { name: /read more/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comments/i })).toBeInTheDocument();
  });

  test('should render correctly even if sub-components are rearranged', () => {
    // Compound components should be flexible in order
    render(
      <CompoundComponent post={postData}>
        <CompoundComponent.User />
        <CompoundComponent.Title />
      </CompoundComponent>
    );

    const user = screen.getByText("By Jane Doe");
    const title = screen.getByText("Testing Compound Components");

    expect(user).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });
});