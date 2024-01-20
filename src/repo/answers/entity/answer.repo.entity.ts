import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';
import { QuizQuestionEntity } from 'src/repo/questions/entity/questions.repo.entity';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AnswerStatus = 'correct' | 'incorrect';

@Entity('Answers')
export class AnswerRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: AnswerStatus;

  @ManyToOne(() => UserRepoEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserRepoEntity;
  @Column()
  userId: number;

  @ManyToOne(() => QuizQuestionEntity)
  @JoinColumn()
  question: QuizQuestionEntity;

  @OneToOne(() => GamesRepoEntity)
  @JoinColumn()
  game: GamesRepoEntity;
  @Column()
  gameId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
