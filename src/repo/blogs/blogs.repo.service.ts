import { InjectRepository } from "@nestjs/typeorm";
import { BlogRepoEntity } from "./entity/blogs.repo.entity";
import { Repository } from "typeorm";

export class BlogsRepoService {
    /**
     *
     */
    constructor(
        @InjectRepository(BlogRepoEntity)
        private blogsRepo: Repository<BlogRepoEntity>
    ) {

        
    }
}