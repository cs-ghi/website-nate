export interface Books{
  bookss: Book[];
}

export interface Book {
  name: string;
  desc: String;
  link: String;
  type?: 'pdf' | 'html';
  children?: Book[];
}
