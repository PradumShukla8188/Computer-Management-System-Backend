export enum UserStatus {
    'Active' = 'Active',
    'InActive' = 'InActive'
}

export enum GeneralStatus {
    'Active' = 'Active',
    'InActive' = 'InActive'
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
    },
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


/** Enum students */
export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

export enum Religion {
    Hindu = 'Hindu',
    Muslim = 'Muslim',
    Sikh = 'Sikh',
    Christian = 'Christian',
    Jain = 'Jain',
    Buddhist = 'Buddhist',
    Other = 'Other',
}

export enum Category {
    General = 'General',
    OBC = 'OBC',
    SC = 'SC',
    ST = 'ST',
    Other = 'Other',
}

export enum ExamMode {
    Online = 'Online',
    Offline = 'Offline',
}

export enum ExamType { OBJECTIVE = 'OBJECTIVE', TYPING = 'TYPING' }

export enum QuestionType {
    MCQ = 'MCQ',
    TYPING = 'TYPING',
    SUBJECTIVE = 'SUBJECTIVE'
}

