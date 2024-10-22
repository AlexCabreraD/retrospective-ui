import Section from "@/app/types/section";
import Post from "@/app/types/post";
import { profileIconColors } from "@/app/utils/helper";

function generatePosts(postCount: number): Post[] {
  const posts: Post[] = [];

  for (let i = 1; i <= postCount; i++) {
    posts.push({
      id: i - 1,
      user: {
        id: i.toString(),
        name: `User${i}`,
        role: "user",
        color: profileIconColors[i],
      },
      text: `This is post number ${i}`,
      likeCount: Math.floor(Math.random() * 100),
      comments: [],
    });
  }

  return posts;
}

export function generateSection(
  sectionId: number,
  title: string,
  postCount: number,
): Section {
  return {
    id: sectionId,
    title: title,
    posts: generatePosts(postCount),
  };
}

export function generateMultipleSections(
  sectionCount: number,
  postsPerSection: number,
): Section[] {
  const sections: Section[] = [];

  for (let i = 1; i <= sectionCount; i++) {
    sections.push(generateSection(i, `Section ${i - 1}`, postsPerSection));
  }

  return sections;
}
