import { OnBoardingModule } from './onBoarding/onBoarding.module';
import { StudentModule } from './student/student.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { ExamModule } from './exam/exam.module';

export const cModules = [
    OnBoardingModule,
    StudentModule,
    UserModule,
    RoleModule,
    CourseModule,
    ExamModule
];
