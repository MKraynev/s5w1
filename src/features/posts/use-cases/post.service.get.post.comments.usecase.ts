import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentInfo } from "../entities/post.controller.get.comment";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepoService } from "src/repo/comments/comments.repo.service";
import { LikeForCommentRepoService } from "src/repo/likes/commentLikes/likes.for.comment.repo.service";
import { CommentRepoEntity } from "src/repo/comments/entities/commen.repo.entity";
import { PostsRepoService } from "src/repo/posts/posts.repo.service";

export class PostServiceGetPostCommentsCommand {
	constructor(
		public postId: string,
		public sortBy: keyof CommentRepoEntity,
		public sortDirection: "desc" | "asc",
		public userId?: string,
		public skip?: number, 
		public limit?: number
	) {}
}

@Injectable()
@CommandHandler(PostServiceGetPostCommentsCommand)
export class PostServiceGetPostCommentsUseCase implements ICommandHandler<PostServiceGetPostCommentsCommand, {count: number, comments: CommentInfo[]}>{

	constructor(private commentRepo: CommentsRepoService, private postRepo: PostsRepoService) {}

	async execute(command: PostServiceGetPostCommentsCommand): Promise<{count: number;comments: CommentInfo[]}> {
		let post = await this.postRepo.ReadById(command.postId);
		
		if(!post)
			throw new NotFoundException("Post not found");

		let countAndComments = await this.commentRepo.ReadAndCountManyForCertainPost(command.postId, command.sortBy, command.sortDirection, command.userId, command.skip, command.limit)

		return countAndComments;
	}
	
}