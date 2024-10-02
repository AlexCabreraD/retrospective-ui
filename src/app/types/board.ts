import Section from "@/app/types/section";

export default interface Board {
  creator: string;
  sections: Section[];
}

export class BoardData {
  public creator: string;
  public sections: Section[];

  constructor(creator: string) {
    this.creator = creator;
    this.sections = this.createInitialSections();
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
