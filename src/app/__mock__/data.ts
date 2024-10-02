const retroBoardData = {
  sections: [
    {
      id: 1,
      title: "Glad",
      posts: [
        {
          id: 101,
          user: "John Doe",
          text: "I'm glad we completed the sprint on time!",
          likeCount: 5,
          comments: [
            {
              id: 1001,
              user: "Jane Smith",
              text: "Great job, team! Totally agree!",
            },
            {
              id: 1002,
              user: "Alice Johnson",
              text: "It's been a smooth week!",
            },
          ],
        },
        {
          id: 102,
          user: "Emma Wilson",
          text: "Glad we managed to fix the critical bugs before release.",
          likeCount: 3,
          comments: [
            {
              id: 1003,
              user: "Mike Brown",
              text: "Yeah, that was impressive. Kudos to the dev team!",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Sad",
      posts: [
        {
          id: 201,
          user: "Jane Smith",
          text: "Sad that we didn’t have enough time for code refactoring.",
          likeCount: 4,
          comments: [
            {
              id: 1004,
              user: "John Doe",
              text: "Yeah, we should prioritize that in the next sprint.",
            },
            {
              id: 1005,
              user: "Alice Johnson",
              text: "Agreed. It was a tight deadline.",
            },
          ],
        },
        {
          id: 202,
          user: "Mike Brown",
          text: "Sad that communication was a bit off this sprint.",
          likeCount: 2,
          comments: [
            {
              id: 1006,
              user: "Emma Wilson",
              text: "We definitely need to sync more frequently.",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Mad",
      posts: [
        {
          id: 301,
          user: "Alice Johnson",
          text: "I'm mad about the unexpected changes to the requirements.",
          likeCount: 7,
          comments: [
            {
              id: 1007,
              user: "Jane Smith",
              text: "That really threw off our plans. It was frustrating.",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: "Neutral",
      posts: [
        {
          id: 401,
          user: "Emma Wilson",
          text: "I'm neutral about the team's new process. It worked fine, but there's room for improvement.",
          likeCount: 1,
          comments: [
            {
              id: 1008,
              user: "Mike Brown",
              text: "I think it needs more time to prove its worth.",
            },
          ],
        },
      ],
    },
  ],
};

export default retroBoardData;
