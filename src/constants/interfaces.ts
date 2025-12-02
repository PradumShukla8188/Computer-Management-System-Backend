import { ObjectId } from 'mongoose';

interface UserRole {
	_id: ObjectId;
	name: string;
}

export interface JWTUser {
	_id: ObjectId;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	status: string;
	roleId: UserRole;
}
