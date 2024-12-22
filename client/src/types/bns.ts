export interface Bns {
  chapterName: string;
  chapterDescription: string;
  subChapter: string;
  sectionNumber: number;
  sectionContent: string;
}

export interface BnsState {
  bnsList: Bns[];
  loading: boolean;
  error: string | null;
  fetchBnsList: () => Promise<void>;
}
