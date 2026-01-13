import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QuoteProjectDto } from './dto/quote-project.dto';
import { RespondToQuoteDto } from './dto/respond-to-quote.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ==================== USER ENDPOINTS ====================

  // Get current user's projects
  @Get('my-projects')
  async getMyProjects(@Req() req: any) {
    return this.projectsService.getUserProjects(req.user.userId);
  }

  // Get project stats for dashboard
  @Get('my-stats')
  async getMyProjectStats(@Req() req: any) {
    return this.projectsService.getUserProjectStats(req.user.userId);
  }

  // Get a single project
  @Get('my-projects/:id')
  async getMyProject(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.getUserProject(req.user.userId, id);
  }

  // Create a new project request
  @Post('request')
  async createProject(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(req.user.userId, dto);
  }

  // Respond to a quote (accept/decline)
  @Post('my-projects/:id/respond')
  async respondToQuote(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: RespondToQuoteDto,
  ) {
    return this.projectsService.respondToQuote(
      req.user.userId,
      id,
      dto.action,
      dto.declineReason,
    );
  }

  // Add a message to a project
  @Post('my-projects/:id/messages')
  async addMessage(
    @Req() req: any,
    @Param('id') id: string,
    @Body('message') message: string,
  ) {
    return this.projectsService.addMessage(req.user.userId, id, message, false);
  }

  // ==================== ADMIN ENDPOINTS ====================

  // Get all projects (admin)
  @Get('admin/all')
  @UseGuards(AdminGuard)
  async getAllProjects(@Query('status') status?: string) {
    return this.projectsService.getAllProjects(status);
  }

  // Get a single project (admin)
  @Get('admin/:id')
  @UseGuards(AdminGuard)
  async getProject(@Param('id') id: string) {
    return this.projectsService.getProject(id);
  }

  // Quote a project (admin)
  @Post('admin/:id/quote')
  @UseGuards(AdminGuard)
  async quoteProject(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: QuoteProjectDto,
  ) {
    return this.projectsService.quoteProject(req.user.userId, id, dto);
  }

  // Update project status (admin)
  @Post('admin/:id/status')
  @UseGuards(AdminGuard)
  async updateProjectStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProjectStatusDto,
  ) {
    return this.projectsService.updateProjectStatus(
      req.user.userId,
      id,
      dto.action,
      dto.reason,
      dto.deliverables,
    );
  }

  // Add a message (admin - can be internal)
  @Post('admin/:id/messages')
  @UseGuards(AdminGuard)
  async addAdminMessage(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { message: string; isInternal?: boolean },
  ) {
    return this.projectsService.addMessage(
      req.user.userId,
      id,
      body.message,
      body.isInternal ?? false,
    );
  }
}
