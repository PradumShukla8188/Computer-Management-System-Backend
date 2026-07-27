import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/models/event/event.schema';
import { EventParticipant } from 'src/models/event/eventParticipant.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ListDTO } from './dto/list.dto';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private EventModel: Model<Event>,
        @InjectModel(EventParticipant.name) private EventParticipantModel: Model<EventParticipant>,
    ) { }

    // --- EVENT METHODS ---

    async createEvent(dto: CreateEventDto, userId: string) {
        try {
            if (new Date(dto.registrationEndDate) < new Date(dto.registrationStartDate)) {
                throw new BadRequestException('Registration end date cannot be before start date.');
            }
            if (new Date(dto.eventDate) < new Date(dto.registrationEndDate)) {
                throw new BadRequestException('Event date cannot be before registration end date.');
            }

            return await this.EventModel.create({ 
                ...dto,
                createdBy: userId 
            });
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException('Failed to create event');
        }
    }

    async findAllEvents(query: ListDTO) {
        try {
            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;
            const skip = (page - 1) * limit;

            const filter: any = { deletedAt: null };

            if (query.search) {
                filter.$or = [
                    { eventName: { $regex: query.search, $options: 'i' } },
                    { category: { $regex: query.search, $options: 'i' } },
                    { venue: { $regex: query.search, $options: 'i' } },
                ];
            }

            if (query.status) {
                filter.status = query.status;
            }

            const [data, total] = await Promise.all([
                this.EventModel
                    .find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.EventModel.countDocuments(filter),
            ]);

            // Add participant count for each event
            const dataWithCounts = await Promise.all(data.map(async (event) => {
                const count = await this.EventParticipantModel.countDocuments({ eventId: event._id, deletedAt: null });
                return { ...event.toObject(), totalParticipants: count };
            }));

            return {
                data: {
                    events: dataWithCounts,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch events');
        }
    }

    async getDashboardStats() {
        try {
            const totalEvents = await this.EventModel.countDocuments({ deletedAt: null });
            const activeEvents = await this.EventModel.countDocuments({ status: 'Active', deletedAt: null });
            const totalParticipants = await this.EventParticipantModel.countDocuments({ deletedAt: null });
            
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const todayRegistrations = await this.EventParticipantModel.countDocuments({ 
                createdAt: { $gte: startOfDay },
                deletedAt: null 
            });

            return {
                totalEvents,
                activeEvents,
                totalParticipants,
                todayRegistrations
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch dashboard stats');
        }
    }

    async findEventById(id: string) {
        try {
            const event = await this.EventModel.findOne({ _id: id, deletedAt: null });
            if (!event) throw new NotFoundException('Event not found');
            return event;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to fetch event');
        }
    }

    async updateEvent(id: string, dto: UpdateEventDto, userId: string) {
        try {
            const event = await this.EventModel.findOneAndUpdate(
                { _id: id, deletedAt: null },
                { ...dto, updatedBy: userId },
                { new: true },
            );
            if (!event) throw new NotFoundException('Event not found');
            return event;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to update event');
        }
    }

    async deleteEvent(id: string, userId: string) {
        try {
            const event = await this.EventModel.findOneAndUpdate(
                { _id: id, deletedAt: null },
                { deletedAt: new Date(), updatedBy: userId },
                { new: true },
            );
            if (!event) throw new NotFoundException('Event not found');
            return { message: 'Event deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to delete event');
        }
    }

    // --- PARTICIPANT METHODS ---

    async generateRollNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const prefix = `EV${year}`;
        
        const latestParticipant = await this.EventParticipantModel
            .findOne({ rollNumber: { $regex: `^${prefix}` } })
            .sort({ rollNumber: -1 })
            .exec();

        let nextNumber = 1;
        if (latestParticipant && latestParticipant.rollNumber) {
            const lastNumberStr = latestParticipant.rollNumber.replace(prefix, '');
            const lastNumber = parseInt(lastNumberStr, 10);
            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }
        
        return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
    }

    async generateCertificateNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const prefix = `CERT-${year}-`;
        
        const latestParticipant = await this.EventParticipantModel
            .findOne({ certificateNumber: { $regex: `^${prefix}` } })
            .sort({ certificateNumber: -1 })
            .exec();

        let nextNumber = 1;
        if (latestParticipant && latestParticipant.certificateNumber) {
            const lastNumberStr = latestParticipant.certificateNumber.replace(prefix, '');
            const lastNumber = parseInt(lastNumberStr, 10);
            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }
        
        return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
    }

    async addParticipant(eventId: string, dto: CreateParticipantDto, userId: string) {
        try {
            const event = await this.EventModel.findOne({ _id: eventId, deletedAt: null });
            if (!event) throw new NotFoundException('Event not found');

            const rollNumber = await this.generateRollNumber();
            const certificateNumber = await this.generateCertificateNumber();

            const participant = await this.EventParticipantModel.create({
                ...dto,
                eventId,
                rollNumber,
                certificateNumber,
                createdBy: userId
            });

            return participant;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to add participant');
        }
    }

    async findAllParticipants(eventId: string, query: ListDTO) {
        try {
            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;
            const skip = (page - 1) * limit;

            const filter: any = { eventId, deletedAt: null };

            if (query.search) {
                filter.$or = [
                    { fullName: { $regex: query.search, $options: 'i' } },
                    { rollNumber: { $regex: query.search, $options: 'i' } },
                    { srNumber: { $regex: query.search, $options: 'i' } },
                    { mobileNumber: { $regex: query.search, $options: 'i' } },
                ];
            }

            const [data, total] = await Promise.all([
                this.EventParticipantModel
                    .find(filter)
                    .populate('eventId', 'eventName eventDate organizerName')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.EventParticipantModel.countDocuments(filter),
            ]);

            return {
                data: {
                    participants: data,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch participants');
        }
    }

    async findParticipantById(eventId: string, participantId: string) {
        try {
            const participant = await this.EventParticipantModel
                .findOne({ _id: participantId, eventId, deletedAt: null })
                .populate('eventId');
            if (!participant) throw new NotFoundException('Participant not found');
            return participant;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to fetch participant');
        }
    }

    async updateParticipant(eventId: string, participantId: string, dto: UpdateParticipantDto, userId: string) {
        try {
            const participant = await this.EventParticipantModel.findOneAndUpdate(
                { _id: participantId, eventId, deletedAt: null },
                { ...dto, updatedBy: userId },
                { new: true },
            );
            if (!participant) throw new NotFoundException('Participant not found');
            return participant;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to update participant');
        }
    }

    async deleteParticipant(eventId: string, participantId: string, userId: string) {
        try {
            const participant = await this.EventParticipantModel.findOneAndUpdate(
                { _id: participantId, eventId, deletedAt: null },
                { deletedAt: new Date(), updatedBy: userId },
                { new: true },
            );
            if (!participant) throw new NotFoundException('Participant not found');
            return { message: 'Participant deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to delete participant');
        }
    }
}
