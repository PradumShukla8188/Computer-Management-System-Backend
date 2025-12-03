export const messages = {
	en: {
		INVLD_CRED: 'The email or password you entered is incorrect. Please try again.',
		ACC_INACTIVE:
			'It seems that your account is currenlty disabled by Admin. Please contact administrator for further details.',
		USER_NF: 'User not found.',
		FORGOT_PASS_SUCC: 'Password reset email has been sent to your account.',
		TOKEN_EXPIRED: 'It appears that the token is either invalid or has expired.',
		RESET_PASS_SUCCESS: 'Password updated successfully. Please login to continue.',
		USER_STATUS_UPDATED: 'User status updated successfully.',
		PASS_CONF_P_MISMATCH: `Password and Confirm password doesn't match.`,
		USER_EXIST: 'It seems you already have an account.',
		ROLE_NF: 'Role not found.',
		TEMPLATE_NF: 'Template not found.',
		PASSWORD_CHANGED: "Password changed successfully.",

		// Plan
		STUDENT_CREATED: 'Student created successfully.',
		STUDENT_NF: 'Student not found.',
		STUDENT_UPDATED: 'Student updated successfully.',
		DELETE_STUDENT: 'Student deleted successfully.',
		STUDENT_EXISTS: 'Student already exists with this email or mobile number',

		// User
		OLD_PASS_NM: 'Old password does not match.',
		PASS_CHANGED: 'Password changed successfully.',
		PROFILE_UPDATED: 'Profile updated successfully.',

		// ROLE
		ROLE_CREATED: 'Role created successfully.',
		ROLE_EXISTS: 'Role with same name already exists.',
		ROLE_PERMISSION_UPDATED: 'Role permissions updated successfully.',
		INVALID_PERM: 'Invalid permissions.',

		// USER
		USER_ADDED: 'User added successfully.',
		USER_EMAIL_EXISTS: 'User with same email already exists.',
		TIMEZONE_NF: 'Timezone not found.',
		USER_UPDATED: 'User updated successfully.'
	},
};

export function message(lang: string, key: string): string {
	return messages[lang][key] ? messages[lang][key] : '';
}
