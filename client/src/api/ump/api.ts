import { AuthApi, MessengerApi, RegisterApi, UserApi, MeetingApi } from '../../../open-api/ump/api'

export const authApi = new AuthApi({ basePath: process.env.PRIVATE_UMP_HOST || process.env.NEXT_PUBLIC_UMP_HOST })
export const messengerApi = new MessengerApi({ basePath: process.env.PRIVATE_UMP_HOST || process.env.NEXT_PUBLIC_UMP_HOST })
export const registerApi = new RegisterApi({ basePath: process.env.PRIVATE_UMP_HOST || process.env.NEXT_PUBLIC_UMP_HOST })
export const userApi = new UserApi({ basePath: process.env.PRIVATE_UMP_HOST || process.env.NEXT_PUBLIC_UMP_HOST })
export const meetingApi = new MeetingApi({ basePath: process.env.PRIVATE_UMP_HOST || process.env.NEXT_PUBLIC_UMP_HOST })
