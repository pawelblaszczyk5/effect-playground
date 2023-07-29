export const createTaggedErrorBuilder =
	<TTag extends string>(tag: TTag) =>
	() =>
		({
			_tag: tag,
		}) as const;
