export interface MinutesTemplate {
  id: string;
  name: string;
  content: string;
}

export interface MinutesData {
  title: string;
  date: string;
  participants: string;
  agenda: string;
  content: string;
  decisions: string;
  actionItems: string;
  additionalNotes: string;
}

export interface MinutesResult {
  html: string;
  text: string;
  data: MinutesData;
} 