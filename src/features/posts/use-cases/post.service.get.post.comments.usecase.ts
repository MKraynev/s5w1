export class PostServiceGetPostCommentsCommand {
	constructor(
		public nameTerm: string,
		public sortBy: string,
	) {}
}