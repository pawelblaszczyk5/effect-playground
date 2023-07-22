import { Effect } from "effect";

const createTaggedErrorBuilder =
	<TTag extends string>(tag: TTag) =>
	() =>
		({
			_tag: tag,
		}) as const;

const createMissingUserError = createTaggedErrorBuilder("MISSING_USER");

export const getUser = (id: string) =>
	Effect.succeed(id).pipe(
		Effect.tap(() => Effect.sleep("2 seconds")),
		Effect.flatMap(value =>
			Effect.if(value === "test123", {
				onFalse: Effect.fail(createMissingUserError()),
				onTrue: Effect.succeed({
					id: "test123",
					username: "Jon Snow",
				}),
			}),
		),
		Effect.tap(user => Effect.log(`Successfully fetched user with id ${user.id}`)),
	);
