import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Device } from '../devices/device.entity';
import { GroupDto } from './dtos/group.dto';
import { User } from '../users/user.entity';
import { SoftDelete } from '../common/core/soft-delete';

@Entity('groups')
export class Group extends SoftDelete {
  @Column()
  name: string;

  @Column()
  note: string;

  @OneToMany(() => Device, device => device.group)
  devices: Device[];

  @ManyToOne(() => User, user => user.groups)
  user: User;

  toDto(): GroupDto {
    return {
      ...super.toDto(),
      name: this.name,
      note: this.note,
      devices: this.devices ? this.devices.map(device => device.toDto()) : []
    };
  }
}
