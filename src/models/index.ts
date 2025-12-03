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
};
