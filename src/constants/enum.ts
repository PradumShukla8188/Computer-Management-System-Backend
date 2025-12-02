export enum UserStatus {
    'Active' = 'Active',
    'InActive' = 'InActive'
}

export enum GeneralStatus {
    'Active' = 'Active',
    'InActive' = 'InActive'
}

export enum PlanValidity {
    '1 Month' = '1 Month',
    '3 Months' = '3 Months',
    '6 Months' = '6 Months',
    '12 Months' = '12 Months'
}

export const Role = {
    Admin: {
        name: "admin",
    },
    Student: {
        name: 'student',
    },
    Staff: {
        name: 'staff',
    }
}

export enum UserTokenType {
    FORGOT_PASSWORD = 'FORGOT_PASSWORD',
    OTP = 'OTP'
}

export enum TagType {
    DEFAULT = "Default",
    'CUSTOM' = "CUSTOM"
}

export const cachePrefix = `permissions_`;

export const templatesSlug = {
    WelcomeToPlatform: 'WelcomeToPlatform',
    ResetPassword: 'ResetPassword',
    EmptyTemplate: 'EmptyTemplate',
    EmailVerification: 'EmailVerification',
    VerificationSuccess: 'VerificationSuccess',
    AppointmentConfirmed: 'AppointmentConfirmed',
    AppointmentConfirmedDocAddr: 'AppointmentConfirmedDocAddr',
    AppointmentRescheduled: 'AppointmentRescheduled',
    AppointmentCancelled: 'AppointmentCancelled',
    CabBooked: 'CabBooked',
    OneDayLeft: 'OneDayLeft',
    HalfHourLeft: 'HalfHourLeft'
}