export interface EventsWeb {
  id: number;
  name: string;
  order: number | null;
  date: Date | null;
  note: string;
  files: EventFile[] | null;
}

export interface EventFile {
  fileUrl: string;
  fileFullUrl: string;
  fileName: string;
  originFile?: File;
}
