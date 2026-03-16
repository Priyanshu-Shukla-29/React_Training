Compound Post Card Component

A highly flexible and reusable Card component built with React, TypeScript, and Material-UI. It uses the Compound Component Pattern to allow developers to reorder or omit specific parts of the card (Title, Content, User, Buttons) without passing endless props.

-----------------------------------------------------------------------------------------------------------
Key Features

Modular Architecture: Components like Title and Buttons are decoupled, allowing for custom layouts.

Context API Integration: Uses createContext to share the post data internally, eliminating "prop drilling."

TypeScript Support: Fully typed interfaces for Post data and Children props.

Material-UI Styling: Clean UI using standard MUI components like Card, Typography, and Box.

------------------------------------------------------------------------------------------------------------

Why use this pattern?

Implicit State Sharing: The CompoundComponent (Parent) holds the post data in a Context Provider. All sub-components (Children) like .Title or .User consume that data using useContext.

Flexible UI: The user of the component decides the order of elements. If you want the User's name at the top instead of the bottom, you just move <CompoundComponent.User /> in your JSX.

Reduced Prop Drilling: You don't have to pass the title prop to the Title component, the content prop to the Content component, etc. The Parent handles it all.