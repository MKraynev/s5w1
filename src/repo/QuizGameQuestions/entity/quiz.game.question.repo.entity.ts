import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('QuizGameQuestion')
export class QuizGameQuestionRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => GamesRepoEntity)
  @JoinColumn({ name: 'gameId' })
  game: GamesRepoEntity;

  @Column()
  gameId: number;

  @OneToOne(() => QuizGameQuestionRepoEntity)
  @JoinColumn({ name: 'questionId' })
  question: QuizGameQuestionRepoEntity;

  @Column({ nullable: false })
  questionId: number;
}
