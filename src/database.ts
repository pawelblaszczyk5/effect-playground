import { Context, Effect } from "effect";

import { createTaggedErrorBuilder } from "~/utils";

const createMissingUserError = createTaggedErrorBuilder("MISSING_USER");

const getUser = (id: string) =>
	Effect.succeed(id).pipe(
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

export const DatabaseLive = {
	getUser,
};

export const Database = Context.Tag<typeof DatabaseLive>();
