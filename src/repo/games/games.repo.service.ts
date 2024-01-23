import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamesRepoEntity } from './entities/games.repo.entity';
import { UserRepoEntity } from '../users/entities/users.repo.entity';

export class GamesRepoService {
  constructor(
    @InjectRepository(GamesRepoEntity)
    private repo: Repository<GamesRepoEntity>
  ) {}

  public async CreateGame(hostPlayer: UserRepoEntity) {
    //TODO сделать создание игры
    let game = GamesRepoEntity.Init(hostPlayer);
    let savedGame = await this.repo.save(game);
    return savedGame;
  }
  public async GetUserCurrentGame(userId: string) {
    let userId_num = +userId;

    let game = await this.repo
      .createQueryBuilder('game')
      .where('game.player_1_id = :id OR game.player_2_id = :id', { id: userId_num })
      .andWhere('game.status = :status', { status: 'Active' })
      .getOneOrFail();

    return game;
  }
}
