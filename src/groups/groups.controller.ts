import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GroupsService } from './groups.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { GroupDto } from './dtos/group.dto';
import { UsersService } from '../users/users.service';
import { SuccessResponseDto } from '../common/dtos/success-response.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(
    private groupsService: GroupsService,
    private userService: UsersService
  ) {
  }

  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: GroupDto, isArray: true })
  async groups(@Request() req): Promise<GroupDto[]> {
    const userId = req.user.id;
    const allGroups = await this.groupsService.findByUserId(userId);
    return allGroups.map(group => group.toDto());
  }

  @ApiBearerAuth()
  @Post('create')
  @ApiOkResponse({ type: GroupDto })
  async create(@Request() req, @Body() body: GroupDto): Promise<GroupDto> {
    const userId = req.user.id;
    const user = await this.userService.findById(userId);
    const added = await this.groupsService.add(user, body);
    return added.toDto();
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: GroupDto })
  async update(@Param('id') id: number, @Body() body: GroupDto): Promise<GroupDto> {
    let group = await this.groupsService.findById(body.id);
    group.name = body.name;
    group.note = body.note;
    group = await this.groupsService.saveGroup(group);
    return group.toDto();
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SuccessResponseDto })
  removeGroup(@Param('id') id: number): Promise<SuccessResponseDto> {
    return this.groupsService.deleteById(id);
  }
}
