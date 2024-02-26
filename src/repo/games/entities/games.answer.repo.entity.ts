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
export class QuizGameAnswerRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  answer: string;

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
  @Column()
  questionId: number;

  @ManyToOne(() => GamesRepoEntity, { nullable: false, onDelete: 'CASCADE' })
  game: GamesRepoEntity;
  @Column()
  gameId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
