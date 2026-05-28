import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { IsOptional, IsString } from 'class-validator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() address?: string;
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Lihat profil user yang sedang login' })
  @ApiResponse({ status: 200, description: 'Data profil berhasil diambil' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update profil user yang sedang login' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profil berhasil diupdate' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.sub, dto);
  }

  // Admin CRUD
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: '[ADMIN] Lihat semua user' })
  @ApiResponse({ status: 200, description: 'Daftar semua user' })
  @ApiResponse({ status: 403, description: 'Akses ditolak - bukan admin' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: '[ADMIN] Lihat user berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiResponse({ status: 200, description: 'Data user ditemukan' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update user berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'User berhasil diupdate' })
  updateUserById(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateUserById(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: '[ADMIN] Hapus user berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiResponse({ status: 200, description: 'User berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(Number(id));
  }
}
