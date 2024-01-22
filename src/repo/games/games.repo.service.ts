import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamesRepoEntity } from './entities/games.repo.entity';

export class GamesRepoService {
  constructor(
    @InjectRepository(GamesRepoEntity)
    repo: Repository<GamesRepoEntity>
  ) {}

  public async CreateGame(playerId: string) {}
  public async GetUserCurrentGame(userId: string) {}
}
