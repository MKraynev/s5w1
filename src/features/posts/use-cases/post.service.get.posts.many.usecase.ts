// [
//       {
//         "id": "string",
//         "title": "string",
//         "shortDescription": "string",
//         "content": "string",
//         "blogId": "string",
//         "blogName": "string",
//         "createdAt": "2023-12-14T19:01:02.468Z",
//         "extendedLikesInfo": {
//           "likesCount": 0,
//           "dislikesCount": 0,
//           "myStatus": "None",
//           "newestLikes": [
//             {
//               "addedAt": "2023-12-14T19:01:02.468Z",
//               "userId": "string",
//               "login": "string"
//             }
//           ]
//         }
//       }
//     ]
//   }

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostRepoEntity } from "src/repo/posts/entity/posts.repo.entity";
import { PostInfo } from "./post.service.get.post.by.id.usecase";
import { Injectable } from "@nestjs/common";
import { PostsRepoService } from "src/repo/posts/posts.repo.service";
import { LikeForPostRepoService } from "src/repo/likes/postLikes/likes.for.post.repo.service";

export class PostServiceGetManyCommand{
    constructor(
    public userId?: string,
    public sortBy: keyof PostRepoEntity = 'createdAt',
    public sortDirection: 'asc' | 'desc' = 'desc',
    public skip: number = 0,
    public limit: number = 10,
) {
        
    }
}

@Injectable()
@CommandHandler(PostServiceGetManyCommand)
export class PostServiceGetManyUseCase implements ICommandHandler<PostServiceGetManyCommand, {count: number, postInfos: PostInfo[]}>{

    constructor(private postRepo: PostsRepoService, private likeRepo: LikeForPostRepoService ) {}

    async execute(command: PostServiceGetManyCommand): Promise<{count: number, postInfos: PostInfo[]}> {
        let {count, posts} = await this.postRepo.ReadMany(command.sortBy, command.sortDirection, command.skip, command.limit);

        let postInfos = await Promise.all(posts.map(async (post) => {
            
            console.log('post info:', post);

            const [userlike, statistic, lastLikes] = await Promise.all([
                this.likeRepo.GetUserStatus(post.id.toString(), command.userId),
                this.likeRepo.Count(post.id.toString()),
                this.likeRepo.ReadManyLikes(post.id.toString(), 'createdAt', 'desc', 0, 3),
              ]);

              let result = new PostInfo(post as PostRepoEntity, userlike, statistic.likes, statistic.dislikes, lastLikes);
            return result;
        }))

        return {count: count, postInfos: postInfos};
    }
    
}