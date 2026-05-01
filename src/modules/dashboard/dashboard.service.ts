import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentFees, StudentMark, IssuedCertificate } from 'src/models';
import { Course } from 'src/models';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Student.name) private studentModel: Model<any>,
        @InjectModel(StudentFees.name) private feesModel: Model<any>,
        @InjectModel(StudentMark.name) private markModel: Model<any>,
        @InjectModel(IssuedCertificate.name) private certModel: Model<any>,
        @InjectModel(Course.name) private courseModel: Model<any>,
    ) { }

    async getStats(startDate?: string, endDate?: string) {
        const dateFilter: any = { deletedAt: null };
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateFilter.createdAt.$lte = end;
            }
        }

        const [
            totalStudents,
            totalCourses,
            totalCertificates,
            totalMarksheets,
            revenueAgg,
        ] = await Promise.all([
            this.studentModel.countDocuments(dateFilter),
            this.courseModel.countDocuments({}), // Courses are usually not date filtered in overview
            this.certModel.countDocuments(startDate || endDate ? { createdAt: dateFilter.createdAt } : {}),
            this.markModel.aggregate([
                { $match: startDate || endDate ? { createdAt: dateFilter.createdAt } : {} },
                { $group: { _id: { studentId: '$studentId', examName: '$examName' } } },
                { $count: 'total' },
            ]).then(res => res[0]?.total || 0),
            this.feesModel.aggregate([
                { $match: dateFilter },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
        ]);

        const totalRevenue = revenueAgg[0]?.total || 0;

        return {
            totalStudents,
            totalCourses,
            totalCertificates,
            totalMarksheets,
            totalRevenue,
        };
    }

    async getChartData(startDate?: string, endDate?: string) {
        let since: Date;
        let until: Date = new Date();
        let days = 30;

        if (startDate && endDate) {
            since = new Date(startDate);
            until = new Date(endDate);
            until.setHours(23, 59, 59, 999);
            days = Math.ceil((until.getTime() - since.getTime()) / (1000 * 60 * 60 * 24));
            if (days <= 0) days = 1;
        } else {
            since = new Date();
            since.setDate(since.getDate() - (days - 1));
            since.setHours(0, 0, 0, 0);
        }

        const match: any = { createdAt: { $gte: since, $lte: until }, deletedAt: null };

        // Students per day
        const studentDaily = await this.studentModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Revenue per day
        const revenueDaily = await this.feesModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    total: { $sum: '$amount' },
                },
            },
        ]);

        const studentMap: Record<string, number> = {};
        studentDaily.forEach((r) => { studentMap[r._id] = r.count; });

        const revenueMap: Record<string, number> = {};
        revenueDaily.forEach((r) => { revenueMap[r._id] = r.total; });

        // Build array
        const chart = Array.from({ length: days }, (_, i) => {
            const d = new Date(since);
            d.setDate(since.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            return {
                date: label,
                students: studentMap[key] || 0,
                revenue: revenueMap[key] || 0,
            };
        });

        return chart;
    }
}
