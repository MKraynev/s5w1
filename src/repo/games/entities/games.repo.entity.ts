import { AnswerRepoEntity } from 'src/repo/answers/entity/answer.repo.entity';
import { QuizQuestionEntity } from 'src/repo/questions/entity/questions.repo.entity';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type AvailableGameStatus = 'searching' | 'onGoing' | 'ended';

@Entity('Games')
export class GamesRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRepoEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  player_1_id: UserRepoEntity;

  @OneToMany(() => AnswerRepoEntity, (answer) => answer.game)
  player_1_answers: AnswerRepoEntity[];

  @ManyToOne(() => UserRepoEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  player_2_id: UserRepoEntity;

  @OneToMany(() => AnswerRepoEntity, (answer) => answer.game)
  player_2_answers: AnswerRepoEntity[];

  @ManyToMany(() => QuizQuestionEntity, {
    nullable: false,
  })
  @JoinColumn()
  questions: QuizQuestionEntity[];

  @Column()
  status: AvailableGameStatus;
}
