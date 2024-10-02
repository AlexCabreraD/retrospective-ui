import React, { useState, ChangeEvent, KeyboardEvent } from "react";

interface NewPostInputProps {
  onPost: (postText: string) => void;
}

const NewPostInput: React.FC<NewPostInputProps> = ({ onPost }) => {
  const [addingNewPost, setAddingNewPost] = useState<boolean>(false);
  const [newPostText, setNewPostText] = useState<string>("");
  const scrollbarStyle =
    "overflow-auto overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500";

  const handlePost = () => {
    if (newPostText.trim()) {
      onPost(newPostText);
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
    <div>
      {addingNewPost ? (
        <div className="relative flex flex-col items-center w-full bg-[#1E1E1E] mt-[32px]">
          <textarea
            value={newPostText}
            placeholder="Add a new post"
            className={`w-full bg-[#292929] h-[70px] rounded placeholder:text-[#858585] px-[16px] py-[8px] resize-none ${scrollbarStyle}`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
            className={`w-full p-1 text-center rounded-lg mb-[32px] mt-[8px] drop-shadow-2xl
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
          className="w-full bg-[#292929] hover:bg-[#FFFFFF] hover:text-black drop-shadow-2xl rounded-lg p-4 text-center text-[#858585] my-[32px]"
        >
          + Add a card
        </button>
      )}
    </div>
  );
};

export default NewPostInput;
