export interface TTodo {
  id: number;
  title: string;
  description: string;
  status: "blocked" | "done" | "inProgress" | "inQA" | "todo";
}
