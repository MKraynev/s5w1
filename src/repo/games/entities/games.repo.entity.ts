import { QuizGameAnswerRepoEntity } from 'src/repo/games/entities/games.answer.repo.entity';
import { QuizQuestionEntity } from 'src/repo/questions/entity/questions.repo.entity';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type AvailableGameStatus = 'searching' | 'onGoing' | 'ended';

@Entity('Games')
export class GamesRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRepoEntity, { nullable: false })
  player_1: UserRepoEntity;

  @ManyToOne(() => UserRepoEntity)
  player_2: UserRepoEntity;

  @OneToMany(() => QuizGameAnswerRepoEntity, (answer) => answer.game)
  answers_p1: QuizGameAnswerRepoEntity[];

  @OneToMany(() => QuizGameAnswerRepoEntity, (answer) => answer.game)
  answers_p2: QuizGameAnswerRepoEntity[];

  @Column()
  player_1_score: number;

  @Column()
  player_2_score: number;

  @Column({ nullable: false })
  status: AvailableGameStatus;
}
