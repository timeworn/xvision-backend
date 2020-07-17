import { ApiProperty } from '@nestjs/swagger';
import { DeviceDto } from '../../devices/dtos/device.dto';
import { CommonDto } from '../../common/dtos/common.dto';

export class GroupDto extends CommonDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  note: string;

  @ApiProperty({ type: DeviceDto, isArray: true, required: false })
  devices?: DeviceDto[];
}
