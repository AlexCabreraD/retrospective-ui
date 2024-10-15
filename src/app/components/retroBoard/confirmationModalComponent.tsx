interface confirmationModalComponentProps {
  showConfirmModal: boolean;
  confirmLeave: () => void;
  cancelLeave: () => void;
}

const ConfirmationModalComponent = ({
  showConfirmModal,
  confirmLeave,
  cancelLeave,
}: confirmationModalComponentProps) =>
  showConfirmModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0f0f0f] p-6 rounded shadow-[0_0px_55px_2px_rgba(0,0,0,.4)]">
        <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">
          If you leave, your posts will remain visible on the board.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            onClick={confirmLeave}
          >
            Yes, Leave
          </button>
          <button
            className="mt-2 sm:mt-0 sm:ml-2 border-[1px] hover:bg-[#1f1f1f] px-4 py-1 rounded-lg"
            onClick={cancelLeave}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

export default ConfirmationModalComponent;
