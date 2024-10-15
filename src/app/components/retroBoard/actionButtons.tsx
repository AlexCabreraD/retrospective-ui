import User from "@/app/types/user";
import { SetStateAction } from "react";

interface actionButtonsProps {
  user: User;
  voting: boolean;
  startReview: () => void;
  onStopVotingClick: () => void;
  onVotingClick: () => void;
  setShowConfirmModal: (value: SetStateAction<boolean>) => void;
}

const ActionButtons = ({
  user,
  voting,
  startReview,
  onStopVotingClick,
  onVotingClick,
  setShowConfirmModal,
}: actionButtonsProps) => (
  <div className="flex flex-col sm:flex-row mb-[8px] justify-between">
    <div>
      {user.role === "creator" && voting && (
        <button
          className="mt-2 sm:mt-0 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm mr-[8px]"
          onClick={onStopVotingClick}
        >
          Back
        </button>
      )}
      {user.role === "creator" && voting && (
        <button
          className="mt-2 sm:mt-0 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm mr-2"
          onClick={startReview}
        >
          Review
        </button>
      )}
      {user.role === "creator" && !voting && (
        <button
          className="mt-2 sm:mt-0 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm mr-2"
          onClick={onVotingClick}
        >
          Start Vote
        </button>
      )}
      <button
        className={`mt-2 sm:mt-0 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg text-body-sm`}
        onClick={() => {
          setShowConfirmModal(true);
        }}
      >
        Leave
      </button>
    </div>
  </div>
);

export default ActionButtons;
