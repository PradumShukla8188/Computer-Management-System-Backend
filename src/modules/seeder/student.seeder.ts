import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student } from 'src/models/student/student.schema';
import { Role as RoleEnum } from '../../constants/enum';


import {
    Gender,
    Religion,
    Category,
    ExamMode,
    UserStatus,
} from 'src/constants/enum';
import { Role } from 'src/models/role/role.schema';

@Injectable()
export class StudentSeeder {
    constructor(
        @InjectModel(Student.name)
        private readonly studentModel: Model<Student>,

        @InjectModel(Role.name)
        private readonly roleModel: Model<Role>,
    ) { }

    async init(): Promise<string> {
        try {
            console.log(' Starting Student Seeding...');

            // Fetch student role (adjust name if needed)
            const studentRole = await this.roleModel.findOne({ name: RoleEnum.Student.name });

            if (!studentRole) {
                throw new Error('Student role not found');
            }

            const students = this.generateStudents(studentRole._id);

            for (const student of students) {
                const exists = await this.studentModel.findOne({
                    rollNo: student.rollNo,
                });

                if (exists) {
                    console.log(` Student already exists: ${student.rollNo}`);
                    continue;
                }

                await this.studentModel.create(student);
                console.log(` Student added: ${student.name} (${student.rollNo})`);
            }

            return Promise.resolve('Students seeded successfully');
        } catch (error) {
            console.error(' Student seeding failed', error);
            return Promise.reject(error);
        }
    }

    private generateStudents(roleId: Types.ObjectId) {
        const baseDate = new Date('2003-01-01');

        return Array.from({ length: 20 }).map((_, index) => ({
            name: `Student ${index + 1}`,
            fatherName: `Father ${index + 1}`,
            motherName: `Mother ${index + 1}`,
            dob: new Date(baseDate.setFullYear(2003 + (index % 3))),
            roleId,

            gender: index % 2 === 0 ? Gender.Male : Gender.Female,
            mobile: `98765432${index.toString().padStart(2, '0')}`,
            email: `student${index + 1}@example.com`,

            residentialAddress: `House No ${index + 10}, Main Road`,
            state: 'Uttar Pradesh',
            district: 'Lucknow',
            country: 'India',
            pinCode: '226001',

            religion: Religion.Hindu,
            category: index % 3 === 0 ? Category.OBC : Category.General,

            dateOfAdmission: new Date(),
            selectedCourse: index % 2 === 0 ? 'ADCA' : 'DCA',
            courseDuration: index % 2 === 0 ? '12 Months' : '6 Months',
            session: '2024-2025',
            totalFees: index % 2 === 0 ? 3200 : 2600,

            examMode: index % 2 === 0 ? ExamMode.Online : ExamMode.Offline,

            studentPhoto: `students/photos/student_${index + 1}.jpg`,
            uploadEducationProof: `students/docs/edu_${index + 1}.pdf`,
            uploadIdentityProof: `students/docs/id_${index + 1}.pdf`,

            status: UserStatus.Active,
            rollNo: `ROLL-${2024}${(index + 1).toString().padStart(3, '0')}`,
        }));
    }
}
