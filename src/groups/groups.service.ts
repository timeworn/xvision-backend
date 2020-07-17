import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { GroupDto } from './dtos/group.dto';
import { SuccessResponseDto } from '../common/dtos/success-response.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {
  }

  find(): Promise<Group[]> {
    return this.groupsRepository.find();
  }

  findById(id: number): Promise<Group> {
    return this.groupsRepository.findOne(id);
  }

  async add(user: User, payload: GroupDto): Promise<Group> {
    const group = new Group();
    group.user = user;
    group.name = payload.name;
    group.note = payload.note;
    return this.groupsRepository.save(group);
  }

  async findByUserId(userId: number): Promise<Group[]> {
    return this.groupsRepository.createQueryBuilder('groups')
      .leftJoinAndSelect('groups.user', 'user')
      .leftJoinAndSelect('groups.devices', 'devices')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async saveGroup(group: Group): Promise<Group> {
    await this.groupsRepository.save(group);
    return this.findById(group.id);
  }

  async deleteById(id: number): Promise<SuccessResponseDto> {
    const group = await this.findById(id);
    if (group) {
      group.devices = [];
      await this.saveGroup(group);
      await this.groupsRepository.remove(group);
    }
    return new SuccessResponseDto();
  }
}
