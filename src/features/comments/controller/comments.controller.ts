import { Controller, Get, Param } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CommentsRepoService } from "src/repo/comments/comments.repo.service";

@Controller('comments')
export class CommentsController{
/**
 *
 */
constructor(commandBus: CommandBus) {
    
}
    @Get(':id')
    public async GetById(@Param('id') id: string) {
    //   let numId = +id;
    //   let blog = await this.blogRepo.ReadById(numId, true);
  
    //   if (blog) return blog;
  
    //   throw new NotFoundException();
    }
}