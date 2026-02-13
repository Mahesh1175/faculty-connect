export interface VisitorRequest {
  _id: string;
  visitorName: string;
  email: string;
  mobile: string;
  dept: string;
  facultyName: string;
  reason: string;
  createdAt?:string;
  status: "pending" | "approved" | "hold" | "declined";
}
