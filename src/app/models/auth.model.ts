export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  httpStatus: number;
  message: string;
  data: UserData;
}

export interface UserData {
  id: number;
  title: string;
  name: string;
  fatherName: string;
  grandFatherName: string;
  gender: string;
  surName: string;
  maritalStatus: string;
  nationality: string;
  dateOfBirth: string;
  profileImage: string;
  designation: string;
  isBlur: boolean;
  isDisabled: boolean;
  token: string;
  refreshToken: string;
}
