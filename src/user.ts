import { Context, Effect } from "effect";

import { Database } from "~/database";

const getUserName = (id: string) =>
	Database.pipe(Effect.flatMap(database => database.getUser(id).pipe(Effect.map(({ username }) => username))));

export const UserServiceLive = {
	getUserName,
};

export const UserService = Context.Tag<typeof UserServiceLive>();
