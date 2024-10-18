import Post from "../types/post";
import PostWithSectionTitle from "../types/postWithSectionTitle";
import Section from "../types/section";

export const SOCKET_SERVER_URL: string = "http://localhost:8080";

export const scrollbarStyle =
  "overflow-auto overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500";

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const profileIconColors: string[] = [
  "#CC462A",
  "#9F002F",
  "#CC9A00",
  "#CC462A",
  "#A1C68E",
  "#471238",
  "#730A31",
  "#CC584F",
  "#3C0068",
  "#CC7000",
  "#1F8F39",
  "#2871A9",
  "#6F3290",
  "#C3870F",
  "#B3661B",
  "#184A6D",
  "#C1A107",
  "#A44300",
  "#24A05C",
  "#8D4FA6",
];

export const gatherAndSortPostsWithSectionTitle = (
  sections: Section[],
): PostWithSectionTitle[] => {
  const allPostsWithSectionTitle: PostWithSectionTitle[] = sections.flatMap(
    (section: Section) =>
      section.posts.map((post: Post) => ({
        post: post,
        sectionTitle: section.title,
        sectionId: section.id,
      })),
  );

  const sortedPostsWithSectionTitle: PostWithSectionTitle[] =
    allPostsWithSectionTitle.sort(
      (a: PostWithSectionTitle, b: PostWithSectionTitle) =>
        b.post.likeCount - a.post.likeCount,
    );

  return sortedPostsWithSectionTitle;
};
