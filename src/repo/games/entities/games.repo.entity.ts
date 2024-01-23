import { QuizGameAnswerRepoEntity } from 'src/repo/games/entities/games.answer.repo.entity';
import { QuizQuestionEntity } from 'src/repo/questions/entity/questions.repo.entity';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type AvailableGameStatus = 'PendingSecondPlayer' | 'Active' | 'Finished';

@Entity('Games')
export class GamesRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRepoEntity, { nullable: false })
  player_1: UserRepoEntity;
  @Column({ nullable: false })
  player_1_id: number;

  @ManyToOne(() => UserRepoEntity, { nullable: true })
  player_2: UserRepoEntity;
  @Column({ nullable: true })
  player_2_id: number;

  @OneToMany(() => QuizGameAnswerRepoEntity, (answer) => answer.game)
  answers_p1: QuizGameAnswerRepoEntity[];

  @OneToMany(() => QuizGameAnswerRepoEntity, (answer) => answer.game)
  answers_p2: QuizGameAnswerRepoEntity[];

  @Column({ nullable: true })
  player_1_score: number;

  @Column({ nullable: true })
  player_2_score: number;

  @Column({ nullable: false })
  status: AvailableGameStatus;

  public static Init(hostPlayer: UserRepoEntity, status: AvailableGameStatus = 'PendingSecondPlayer') {
    let game = new GamesRepoEntity();
    game.player_1 = hostPlayer;
    game.player_1_id = hostPlayer.id;
    game.status = status;

    return game;
  }
}
