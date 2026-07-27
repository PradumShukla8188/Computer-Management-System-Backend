import { Controller, Post, Body, Get, Param, UseGuards, Query, Put, Delete, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ListDTO } from './dto/list.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Event')
@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post()
    @ApiOperation({ summary: 'Create Event' })
    async createEvent(@Body() dto: CreateEventDto, @Req() req: any) {
        const userId = req?.user?._id;
        return await this.eventService.createEvent(dto, userId);
    }

    @Get('dashboard-stats')
    @ApiOperation({ summary: 'Get Event Dashboard Stats' })
    async getDashboardStats() {
        return await this.eventService.getDashboardStats();
    }

    @Get()
    @ApiOperation({ summary: 'Get All Events' })
    async findAllEvents(@Query() query: ListDTO) {
        return await this.eventService.findAllEvents(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Event By ID' })
    async findEventById(@Param('id') id: string) {
        return await this.eventService.findEventById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Event By ID' })
    async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto, @Req() req: any) {
        const userId = req?.user?._id;
        return await this.eventService.updateEvent(id, dto, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Event By ID' })
    async deleteEvent(@Param('id') id: string, @Req() req: any) {
        const userId = req?.user?._id;
        return await this.eventService.deleteEvent(id, userId);
    }

    // --- PARTICIPANT ROUTES ---

    @Post(':id/participants')
    @ApiOperation({ summary: 'Add Participant to Event' })
    async addParticipant(
        @Param('id') eventId: string, 
        @Body() dto: CreateParticipantDto,
        @Req() req: any
    ) {
        const userId = req?.user?._id;
        return await this.eventService.addParticipant(eventId, dto, userId);
    }

    @Get(':id/participants')
    @ApiOperation({ summary: 'Get All Participants for Event' })
    async findAllParticipants(@Param('id') eventId: string, @Query() query: ListDTO) {
        return await this.eventService.findAllParticipants(eventId, query);
    }

    @Get(':id/participants/:participantId')
    @ApiOperation({ summary: 'Get Participant By ID' })
    async findParticipantById(
        @Param('id') eventId: string, 
        @Param('participantId') participantId: string
    ) {
        return await this.eventService.findParticipantById(eventId, participantId);
    }

    @Put(':id/participants/:participantId')
    @ApiOperation({ summary: 'Update Participant By ID' })
    async updateParticipant(
        @Param('id') eventId: string, 
        @Param('participantId') participantId: string, 
        @Body() dto: UpdateParticipantDto,
        @Req() req: any
    ) {
        const userId = req?.user?._id;
        return await this.eventService.updateParticipant(eventId, participantId, dto, userId);
    }

    @Delete(':id/participants/:participantId')
    @ApiOperation({ summary: 'Delete Participant By ID' })
    async deleteParticipant(
        @Param('id') eventId: string, 
        @Param('participantId') participantId: string,
        @Req() req: any
    ) {
        const userId = req?.user?._id;
        return await this.eventService.deleteParticipant(eventId, participantId, userId);
    }
}
