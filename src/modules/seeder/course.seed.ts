import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/models';
import { UserStatus } from '../../constants/enum';

@Injectable()
export class CourseSeeder {
    constructor(
        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,
    ) { }

    private courseSeedData = [
        {
            course: 'ADCA',
            profession: 'Advanced Diploma in Computer Applications',
            price: 3200,
            duration: '12 Months',
        },
        {
            course: 'DCA',
            profession: 'Diploma in Computer Applications',
            price: 2600,
            duration: '6 Months',
        },
        {
            course: 'Basic Computer',
            profession: 'Basic Computer Skills Training',
            price: 1200,
            duration: '2 Months',
        },
        {
            course: 'Photoshop',
            profession: 'Graphic Design with Adobe Photoshop',
            price: 2200,
            duration: '3 Months',
        },
        {
            course: 'Corel Draw',
            profession: 'Vector Graphic Design using Corel Draw',
            price: 2200,
            duration: '3 Months',
        },
        {
            course: 'HTML',
            profession: 'HTML Web Development',
            price: 1500,
            duration: '2 Months',
        },
        {
            course: 'Node.js',
            profession: 'Backend with Node.js and Express.js',
            price: 2100,
            duration: '2 Months',
        },
    ];

    async init(): Promise<string> {
        try {
            console.log('🌱 Starting Course Seeding...');

            for (const item of this.courseSeedData) {
                const durationInMonths = this.parseDuration(item.duration);

                const exists = await this.courseModel.findOne({
                    name: item.course,
                });

                if (exists) {
                    console.log(`⚠️ Course already exists: ${item.course}`);
                    continue;
                }

                await this.courseModel.create({
                    name: item.course,
                    shortName: item.course,
                    description: item.profession,
                    status: UserStatus.Active,
                    durationInMonths,
                    totalFees: item.price,
                    monthlyFees: Math.round(item.price / durationInMonths),
                });

                console.log(`✅ Course added: ${item.course}`);
            }

            return Promise.resolve('Courses seeded successfully');
        } catch (error) {
            console.error('❌ Course seeding failed', error);
            return Promise.reject(error);
        }
    }

    private parseDuration(duration: string): number {
        // Handles "12 Months", "2 Months", "15 Days"
        if (duration.toLowerCase().includes('day')) {
            return 1;
        }
        return parseInt(duration);
    }
}
