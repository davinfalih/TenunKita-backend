import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'PROCESSING',
    description: 'Status pesanan baru',
    enum: ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'])
  status: string;
}
