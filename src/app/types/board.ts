import Section from "@/app/types/section";
import User from "@/app/types/user";

export default interface Board {
  boardName: string;
  boardCode: string;
  creator: string;
  sections: Section[];
  users: User[];
}

export class BoardData {
  public boardName: string;
  public boardCode: string;
  public creator: string;
  public sections: Section[];
  public users: User[];

  constructor(creator: string) {
    this.boardCode = "new code";
    this.boardName = "New Board";
    this.creator = creator;
    this.sections = this.createInitialSections();
    this.users = [];
  }

  private createInitialSections(): Section[] {
    return [
      { id: 1, title: "Glad", posts: [] },
      { id: 2, title: "Sad", posts: [] },
      { id: 3, title: "Mad", posts: [] },
      { id: 4, title: "Neutral", posts: [] },
    ];
  }
}
