export interface Image {
  url: string;
  title: string;
  source: string;
  date: string;
  height: number;
  width: number;
}


export type NgbSlideLike = string | { 
    src: string; 
    alt?: string;      
    caption?: string; 
    header?: string };
