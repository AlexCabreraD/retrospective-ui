import { Tooltip } from "../tooltip";

interface boardHeaderProps {
  boardName: string | undefined;
  boardCode: string | undefined;
  votesLeft: number;
  voting: boolean;
  onCopyClick: () => void;
}

const BoardHeader = ({
  boardName,
  boardCode,
  votesLeft,
  onCopyClick,
  voting,
}: boardHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center mb-[8px]">
      <h1 className="text-2xl lg:text-3xl font-bold">{boardName}</h1>
      <Tooltip text={"Copy"} position={"end"}>
        <span
          className="bg-[#1e1e1e] py-1 px-4 rounded cursor-pointer ml-[8px]"
          onClick={onCopyClick}
        >
          {boardCode}
        </span>
      </Tooltip>

      {/* Display votes left when voting */}
      {voting && (
        <div className="flex justify-center text-center align-middle content-center ml-[8px]">
          <span className="flex items-center justify-center font-bold text-center mr-[8px]">
            Votes:
          </span>
          <span
            className="min-w-[30px] w-[30px] h-[30px] flex items-center justify-center font-bold border-[2px] border-[#353535] rounded bg-[#1E1E1E] text-center"
            style={{ lineHeight: "30px", padding: "0 2px" }}
          >
            {votesLeft}
          </span>
        </div>
      )}
    </div>
  );
};

export default BoardHeader;
