import Post from "@/app/types/post";
import Card from "../card";
import NewPostInput from "../newPostInput";
import Section from "@/app/types/section";
import { Socket } from "socket.io-client";
import { Dispatch, SetStateAction, useState } from "react";
import { scrollbarStyle } from "@/app/utils/helper";

interface cardsViewProps {
  sections: Section[];
  voting: boolean;
  handleNewPost: (text: string, sectionId: number) => Promise<void>;
  socket: Socket | null;
  setReplyTo: Dispatch<
    SetStateAction<{ post: Post | null; sectionId: number | null }>
  >;
  votesLeft: number;
  setVotesLeft: Dispatch<SetStateAction<number>>;
}

const CardsView = ({
  sections,
  voting,
  handleNewPost,
  socket,
  votesLeft,
  setVotesLeft,
  setReplyTo,
}: cardsViewProps) => {
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);

  const toggleSection = (sectionId: number) => {
    setActiveSectionId((prevId) => (prevId === sectionId ? null : sectionId));
  };
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full h-full overflow-auto md:overflow-hidden"
      id={"cards"}
    >
      {sections?.map((section: Section) => (
        <div
          key={section.id}
          className={`bg-[#1e1e1e] rounded-lg overflow-auto ${scrollbarStyle} min-h-[75vh]`}
        >
          <div className={"sticky top-0 bg-[#1e1e1e] p-4 z-10"}>
            <div className="flex justify-between items-center">
              <h2 className="text-h3 font-semibold text-[#858585]">
                {section.title}
              </h2>
              <div className="rounded-lg border-[2px] border-[#353535] w-[30px] h-[30px] flex justify-center items-center text-body-sm">
                <p>{section.posts.length}</p>
              </div>
            </div>
            <NewPostInput
              onPost={handleNewPost}
              sectionId={section.id}
              voting={voting}
              isActive={activeSectionId === section.id}
              toggleSection={() => toggleSection(section.id)}
            />
            <hr className="h-px bg-[#292929] border-0 mt-[16px]" />
          </div>
          <div className={"w-full overflow-auto px-4 relative"}>
            {section.posts
              .slice()
              .sort((a: Post, b: Post) => b.id - a.id)
              .map((post: Post) => (
                <Card
                  key={post.id}
                  post={post}
                  className="mt-4"
                  voting={voting}
                  socket={socket}
                  sectionId={section.id}
                  votesLeft={votesLeft}
                  setVotesLeft={setVotesLeft}
                  onClickReply={setReplyTo}
                  replyable
                />
              ))}
          </div>
        </div>
      )) ?? <div>No sections available</div>}
    </div>
  );
};

export default CardsView;
