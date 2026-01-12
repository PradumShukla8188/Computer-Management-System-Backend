import { SchemaFactory } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { Role, RoleSchema } from './role/role.schema';
import { UserToken, UserTokenSchema } from './user/userToken.schema';
import { EmailTemplate, EmailTemplateSchema } from './template/emailTemplates.schema';
import { Student, StudentSchema } from './student/student.schema';
import { Country, CountrySchema } from './country/country.schema';
import { State, StateSchema } from './country/states.schema';
import { City, CitySchema } from './country/cities.schema';
import { Timezone, TimezoneSchema } from './country/timezone.schema';
import { UserDetail, UserDetailSchema } from './user/userDetail.schema';
import { PermissionsSchema, Permissions } from './role/permissions.schema';
import { RolePermissions, RolePermissionsSchema } from './role/rolePermissions.schema';
import { CourseSchema, Course } from './course/course.schema';
import { SubjectSchema, Subject } from './course/subject.schema';
import { TopicSchema, Topic } from './course/topic.schema';
import { StudentFeesSchema, StudentFees } from './student/student.fees.schema';
import { Attempt, AttemptSchema } from './exam/attempts.schema';
import { CertificateTemplate, CertificateTemplateSchema } from './exam/certificate.template.schema';
import { Exam, ExamSchema } from './exam/exam.schema';
import { Question, QuestionSchema } from './exam/questions.schema';
import { Option, OptionSchema } from './exam/option.schema';
import { StudentMark, StudentMarkSchema } from './marks/student-mark.schema';


export const Models: { name: string; schema: SchemaFactory; collection?: string }[] = [
	{ name: User.name, schema: UserSchema },
	{ name: Role.name, schema: RoleSchema },
	{ name: UserToken.name, schema: UserTokenSchema },
	{ name: EmailTemplate.name, schema: EmailTemplateSchema },
	{ name: Student.name, schema: StudentSchema },
	{ name: Country.name, schema: CountrySchema },
	{ name: State.name, schema: StateSchema },
	{ name: City.name, schema: CitySchema },
	{ name: Timezone.name, schema: TimezoneSchema },
	{ name: UserDetail.name, schema: UserDetailSchema },
	{ name: Permissions.name, schema: PermissionsSchema },
	{ name: RolePermissions.name, schema: RolePermissionsSchema },
	{ name: Course.name, schema: CourseSchema },
	{ name: Subject.name, schema: SubjectSchema },
	{ name: Topic.name, schema: TopicSchema },
	{ name: StudentFees.name, schema: StudentFeesSchema },

	{ name: Attempt.name, schema: AttemptSchema },
	{ name: CertificateTemplate.name, schema: CertificateTemplateSchema },
	{ name: Exam.name, schema: ExamSchema },
	{ name: Question.name, schema: QuestionSchema },
	{ name: Option.name, schema: OptionSchema },
	{ name: StudentMark.name, schema: StudentMarkSchema },





];

export {
	User,
	Role,
	UserToken,
	EmailTemplate,
	Student,
	Country,
	State,
	City,
	Timezone,
	UserDetail,
	Permissions,
	RolePermissions,
	Course,
	Subject,
	Topic,
	StudentFees,
	Attempt,
	CertificateTemplate,
	Exam,
	Option,
	Question,
	StudentMark

};
