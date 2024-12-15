import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleEnum } from './users/entities/role.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seedRoles() {
    const roles: RoleEnum[] = [
      RoleEnum.Default,
      RoleEnum.schoolAdmin,
      RoleEnum.superAdmin,
    ];

    for (const roleName of roles) {
      const exists = await this.roleRepository.findOneBy({ name: roleName });
      if (!exists) {
        const role = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(role);
        console.log(`Role '${roleName}' created.`);
      }
    }
    console.log('Roles seeding completed!');
  }

  async seed() {
    await this.seedRoles();
    console.log('Seeding completed!');
  }
}
