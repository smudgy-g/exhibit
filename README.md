# Exhibit - Social Media Platform

Exhibit is a social media platform inspired by Instagram. Users can sign up, sign in, create, like, edit, save, and delete posts, as well as maintain their profiles. The app features a feed, and users can search for posts.

## Tech Stack

The project was bootstrapped with Vite and uses the following technologies:

    - [React v18 with TypeScript](https://react.dev/)
    - [Tailwind CSS](https://tailwindcss.com/)
    - [Shadcn UI Library](https://ui.shadcn.com/)
    - [Tanstack Query](https://tanstack.com/query/latest)
    - [Appwrite](https://appwrite.io/) as the open-source server.

## Installation

To run the app locally, follow these steps:

1. Clone the git repository:

```
bash
git clone https://github.com/your-username/exhibit.git

Install the required packages:

bash

npm install
```


2. Set up an Appwrite account and create a database. In the database, set up three collections: Posts, Users, and Saves.

- For each collection, enable permissions for the "Any" role and check all CRUD operations.

- In the Posts collection, create the following attributes:
  creator: Relationship with creator.
  likes: Relationship with likes.
  caption: String.
  tags: String array.
  imageUrl: URL.
  imageId: String.
  location: String.
  save: Relationship with save.

- In the Users collection, create the following attributes:
  posts: Relationship with posts.
  liked: Relationship with liked.
  name: String.
  username: String.
  accountId: String.
  email: Email.
  bio: String.
  imageId: String.
  imageUrl: URL.
  save: Relationship with save.

- In the Saves collection, create the following attributes:
  user: Relationship with user.
  post: Relationship with post.

3. Create a .env file in the root of your project and populate it with the values from your Appwrite account:

```
env

VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_URL=your_appwrite_api_url
VITE_APPWRITE_STORAGE_ID=your_storage_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_SAVES_COLLECTION_ID=your_saves_collection_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_POSTS_COLLECTION_ID=your_posts_collection_id
```

Replace your_project_id, your_appwrite_api_url, your_storage_id, your_database_id, your_saves_collection_id, your_users_collection_id, and your_posts_collection_id with the corresponding values from your Appwrite account.

## Usage

- Run the app locally after completing the installation steps.
- Sign up or sign in to your account.
- Explore the features like creating, liking, editing, saving, and deleting posts.
- Navigate through the feed and search for posts.

## Configuration

Before running the app, ensure you set up the required Appwrite collections and permissions as mentioned in the installation instructions.

## Contributing

If you want to contribute to Exhibit, follow these steps:

1. Fork the repository.
2. Create a new branch: git checkout -b feature/new-feature.
3. Make your changes and commit them: git commit -m 'Add new feature'.
4. Push to the branch: git push origin feature/new-feature.
5. Submit a pull request.

Contact

For any inquiries or support, feel free to contact me at [adamgriff86@gmail.com](mailto:adamgriff86@gmail.com)
