import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { scrollbarStyle } from "@/app/utils/helper";

interface NewPostInputProps {
  sectionId: number;
  onPost: (postText: string, sectionId: number) => void;
  voting: boolean;
}

const NewPostInput: React.FC<NewPostInputProps> = ({
  onPost,
  sectionId,
  voting,
}) => {
  const [addingNewPost, setAddingNewPost] = useState<boolean>(false);
  const [newPostText, setNewPostText] = useState<string>("");

  const handlePost = () => {
    if (newPostText.trim()) {
      onPost(newPostText, sectionId);
      setNewPostText("");
      setAddingNewPost(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePost();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewPostText(event.target.value);
  };

  const handleClose = () => {
    setNewPostText("");
    setAddingNewPost(false);
  };

  return (
    !voting && (
      <div>
        {addingNewPost ? (
          <div className="relative flex flex-col items-center w-full bg-[#1E1E1E] mt-[32px]">
            <textarea
              value={newPostText}
              placeholder="Add a new post"
              className={`w-full bg-[#292929] h-[70px] rounded placeholder:text-[#858585] px-[16px] py-[8px] resize-none ${scrollbarStyle}`}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={150}
            />
            <button
              onClick={handleClose}
              className="absolute top-1 right-2 text-[#858585] hover:text-white"
              aria-label="Close"
            >
              &#x2715;
            </button>

            <button
              onClick={handlePost}
              className={`w-full p-1 text-center rounded-lg mt-[8px] drop-shadow-2xl
                    ${newPostText.length === 0 ? "bg-[#292929] text-[#858585]" : "bg-[#292929] hover:bg-[#FFFFFF] hover:text-black text-[#858585]"}
                  `}
              disabled={newPostText.length === 0}
            >
              Post
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingNewPost(true)}
            className="w-full bg-[#292929] hover:bg-[#FFFFFF] hover:text-black drop-shadow-2xl rounded-lg p-4 text-center text-[#858585] mt-[32px]"
          >
            + Add a card
          </button>
        )}
      </div>
    )
  );
};

export default NewPostInput;
