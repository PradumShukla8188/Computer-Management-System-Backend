import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, Subject } from 'src/models';
import { UserStatus } from '../../constants/enum';


@Injectable()
export class CourseSeeder {
    constructor(
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,
        @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>,
    ) { }

    async init() {
        console.log('🌱 Seeding 10 default courses...');

        await this.subjectModel.deleteMany({});
        await this.courseModel.deleteMany({});

        const coursesData = [
            {
                name: 'Bachelor of Computer Science',
                shortName: 'BCS',
                description: 'Core computer science fundamentals',
                durationInMonths: 36,
                monthlyFees: 2500,
                totalFees: 90000,
                subjects: [
                    { title: 'Data Structures', description: 'Arrays, stacks, queues, trees' },
                    { title: 'Operating Systems', description: 'Process & memory management' },
                    { title: 'DBMS', description: 'SQL & NoSQL databases' },
                ],
            },
            {
                name: 'Bachelor of Information Technology',
                shortName: 'BIT',
                description: 'IT systems and software engineering',
                durationInMonths: 36,
                monthlyFees: 2300,
                totalFees: 82800,
                subjects: [
                    { title: 'Web Development', description: 'HTML, CSS, JS' },
                    { title: 'Software Engineering', description: 'SDLC & UML' },
                    { title: 'Computer Networks', description: 'TCP/IP, OSI model' },
                ],
            },
            {
                name: 'Master of Computer Science',
                shortName: 'MCS',
                description: 'Advanced computing concepts',
                durationInMonths: 24,
                monthlyFees: 4000,
                totalFees: 96000,
                subjects: [
                    { title: 'Advanced Algorithms', description: 'Greedy & DP algorithms' },
                    { title: 'Distributed Systems', description: 'Scalable architectures' },
                ],
            },
            {
                name: 'Bachelor of Business Administration',
                shortName: 'BBA',
                description: 'Business and management studies',
                durationInMonths: 36,
                monthlyFees: 2000,
                totalFees: 72000,
                subjects: [
                    { title: 'Principles of Management', description: 'Management basics' },
                    { title: 'Marketing Management', description: 'Market strategies' },
                    { title: 'Financial Accounting', description: 'Accounts & balance sheets' },
                ],
            },
            {
                name: 'Bachelor of Commerce',
                shortName: 'BCom',
                description: 'Commerce and finance studies',
                durationInMonths: 36,
                monthlyFees: 1800,
                totalFees: 64800,
                subjects: [
                    { title: 'Business Economics', description: 'Micro & macro economics' },
                    { title: 'Corporate Accounting', description: 'Company accounts' },
                    { title: 'Taxation', description: 'Income tax basics' },
                ],
            },
            {
                name: 'Bachelor of Science (Mathematics)',
                shortName: 'BSc Math',
                description: 'Pure and applied mathematics',
                durationInMonths: 36,
                monthlyFees: 1500,
                totalFees: 54000,
                subjects: [
                    { title: 'Algebra', description: 'Groups & rings' },
                    { title: 'Calculus', description: 'Differentiation & integration' },
                    { title: 'Statistics', description: 'Probability theory' },
                ],
            },
            {
                name: 'Bachelor of Science (Physics)',
                shortName: 'BSc Physics',
                description: 'Fundamentals of physics',
                durationInMonths: 36,
                monthlyFees: 1600,
                totalFees: 57600,
                subjects: [
                    { title: 'Classical Mechanics', description: 'Newtonian mechanics' },
                    { title: 'Quantum Mechanics', description: 'Wave functions' },
                    { title: 'Electronics', description: 'Analog & digital electronics' },
                ],
            },
            {
                name: 'Bachelor of Arts',
                shortName: 'BA',
                description: 'Arts and humanities',
                durationInMonths: 36,
                monthlyFees: 1200,
                totalFees: 43200,
                subjects: [
                    { title: 'History', description: 'World history' },
                    { title: 'Political Science', description: 'Political systems' },
                    { title: 'Sociology', description: 'Society and culture' },
                ],
            },
            {
                name: 'Diploma in Computer Applications',
                shortName: 'DCA',
                description: 'Computer basics and applications',
                durationInMonths: 12,
                monthlyFees: 1500,
                totalFees: 18000,
                subjects: [
                    { title: 'Computer Fundamentals', description: 'Basics of computers' },
                    { title: 'MS Office', description: 'Word, Excel, PowerPoint' },
                    { title: 'Internet Technology', description: 'Email & web usage' },
                ],
            },
            {
                name: 'Certificate in Web Development',
                shortName: 'CWD',
                description: 'Frontend & backend development',
                durationInMonths: 6,
                monthlyFees: 3000,
                totalFees: 18000,
                subjects: [
                    { title: 'HTML & CSS', description: 'UI structure & styling' },
                    { title: 'JavaScript', description: 'Client-side scripting' },
                    { title: 'Node.js', description: 'Backend development' },
                ],
            },
        ];

        for (const courseData of coursesData) {
            const course = await this.courseModel.create({
                name: courseData.name,
                shortName: courseData.shortName,
                description: courseData.description,
                status: UserStatus.Active,
                durationInMonths: courseData.durationInMonths,
                monthlyFees: courseData.monthlyFees,
                totalFees: courseData.totalFees,
                subjectsIds: [],
            });

            // const subjectIds = [];

            // for (const subject of courseData.subjects) {
            //     const createdSubject = await this.subjectModel.create({
            //         title: subject.title,
            //         description: subject.description,
            //         courseId: course._id,
            //     });

            //     subjectIds.push(createdSubject._id);
            // }
            //  Create subjects in bulk (optimized)
            const subjectsPayload = courseData.subjects.map(subject => ({
                title: subject.title,
                description: subject.description,
                courseId: course._id,
            }));

            const createdSubjects = await this.subjectModel.insertMany(subjectsPayload);

            //  Extract ObjectIds safely
            const subjectIds: Types.ObjectId[] = createdSubjects.map(
                subject => subject._id as Types.ObjectId,
            );


            course.subjectsIds = subjectIds;
            await course.save();
        }

        console.log(' 10 default courses seeded successfully!');
    }



    // private courseSeedData = [
    //     {
    //         course: 'ADCA',
    //         profession: 'Advanced Diploma in Computer Applications',
    //         price: 3200,
    //         duration: '12 Months',
    //     },
    //     {
    //         course: 'DCA',
    //         profession: 'Diploma in Computer Applications',
    //         price: 2600,
    //         duration: '6 Months',
    //     },
    //     {
    //         course: 'Basic Computer',
    //         profession: 'Basic Computer Skills Training',
    //         price: 1200,
    //         duration: '2 Months',
    //     },
    //     {
    //         course: 'Photoshop',
    //         profession: 'Graphic Design with Adobe Photoshop',
    //         price: 2200,
    //         duration: '3 Months',
    //     },
    //     {
    //         course: 'Corel Draw',
    //         profession: 'Vector Graphic Design using Corel Draw',
    //         price: 2200,
    //         duration: '3 Months',
    //     },
    //     {
    //         course: 'HTML',
    //         profession: 'HTML Web Development',
    //         price: 1500,
    //         duration: '2 Months',
    //     },
    //     {
    //         course: 'Node.js',
    //         profession: 'Backend with Node.js and Express.js',
    //         price: 2100,
    //         duration: '2 Months',
    //     },
    // ];

    // async init(): Promise<string> {
    //     try {
    //         console.log('🌱 Starting Course Seeding...');

    //         for (const item of this.courseSeedData) {
    //             const durationInMonths = this.parseDuration(item.duration);

    //             const exists = await this.courseModel.findOne({
    //                 name: item.course,
    //             });

    //             if (exists) {
    //                 console.log(`⚠️ Course already exists: ${item.course}`);
    //                 continue;
    //             }

    //             await this.courseModel.create({
    //                 name: item.course,
    //                 shortName: item.course,
    //                 description: item.profession,
    //                 status: UserStatus.Active,
    //                 durationInMonths,
    //                 totalFees: item.price,
    //                 monthlyFees: Math.round(item.price / durationInMonths),
    //             });

    //             console.log(`✅ Course added: ${item.course}`);
    //         }

    //         return Promise.resolve('Courses seeded successfully');
    //     } catch (error) {
    //         console.error('❌ Course seeding failed', error);
    //         return Promise.reject(error);
    //     }
    // }

    // private parseDuration(duration: string): number {
    //     // Handles "12 Months", "2 Months", "15 Days"
    //     if (duration.toLowerCase().includes('day')) {
    //         return 1;
    //     }
    //     return parseInt(duration);
    // }
}
