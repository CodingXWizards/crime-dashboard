export interface TableResponse {
  column: string;
  data: string[];
}


export interface SectionData {
  chapterName: string;
  chapterDescription: string;
  subChapter: string;
  sectionNumber: number;
  sectionContent: string;
}

export interface FormData {
  district: string;
  policeStation: string;
  crimeNumber: string;
  incidentDate: string;
  firDate: string;
  csReadyDate: string;
  csFiledDate: string;
  stage: string;
  totalAccused: string;
  arrested: string;
  section: string;
  act: string;
  sectionContent: string;
  chapter: string;
  subChapter: string;
}