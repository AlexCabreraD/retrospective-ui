import React, { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from "react";
import { scrollbarStyle } from "@/app/utils/helper";

interface NewPostInputProps {
  sectionId: number;
  onPost: (postText: string, sectionId: number) => void;
  voting: boolean;
  isActive: boolean; // To control if this section is open or not
  toggleSection: () => void; // To toggle this section's open/close state
}

const NewPostInput: React.FC<NewPostInputProps> = ({
                                                     onPost,
                                                     sectionId,
                                                     voting,
                                                     isActive,
                                                     toggleSection,
                                                   }) => {
  const [newPostText, setNewPostText] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handlePost = () => {
    if (newPostText.trim()) {
      onPost(newPostText, sectionId);
      setNewPostText("");
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
    toggleSection(); // Close this section when clicking close
  };

  // Focus on the textarea when this section is active
  useEffect(() => {
    if (isActive && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isActive]);

  return (
      !voting && (
          <div>
            {isActive ? (
                <div className="relative flex flex-col items-center w-full bg-[#1E1E1E] mt-[16px]">
            <textarea
                ref={textAreaRef} // Attach the ref here
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
                    onClick={toggleSection} // Toggle the section when clicked
                    className="w-full bg-[#292929] hover:bg-[#FFFFFF] hover:text-black drop-shadow-2xl rounded-lg p-[16px] text-center text-[#858585] mt-[16px] text-body-sm"
                >
                  + Add a card
                </button>
            )}
          </div>
      )
  );
};

export default NewPostInput;
